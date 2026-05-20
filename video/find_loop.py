#!/usr/bin/env python3
"""
Find the first frame after the start that matches the start frame,
then output a trimmed video that loops perfectly.

Usage:
    python3 find_loop.py input.mp4 [output.mp4] [--threshold 0.90] [--skip 30] [--method ssim|hist|mse]

Options:
    --threshold   Similarity threshold 0-1 (default: 0.90)
    --skip        Frames to skip before searching (default: FPS, i.e. 1 second)
    --method      Comparison method: ssim, hist, mse (default: ssim)
    --show        Show matched frames visually (requires display)
"""

import cv2
import numpy as np
import argparse
import sys
import subprocess
import os


def resize_frame(frame, size=(64, 64)):
    return cv2.resize(frame, size)


def compare_ssim(f1, f2):
    """Structural similarity (needs grayscale)."""
    g1 = cv2.cvtColor(f1, cv2.COLOR_BGR2GRAY)
    g2 = cv2.cvtColor(f2, cv2.COLOR_BGR2GRAY)
    # Manual SSIM (no skimage dependency)
    C1, C2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    g1, g2 = g1.astype(np.float64), g2.astype(np.float64)
    mu1, mu2 = cv2.GaussianBlur(g1, (11, 11), 1.5), cv2.GaussianBlur(g2, (11, 11), 1.5)
    mu1_sq, mu2_sq, mu12 = mu1 ** 2, mu2 ** 2, mu1 * mu2
    s1 = cv2.GaussianBlur(g1 * g1, (11, 11), 1.5) - mu1_sq
    s2 = cv2.GaussianBlur(g2 * g2, (11, 11), 1.5) - mu2_sq
    s12 = cv2.GaussianBlur(g1 * g2, (11, 11), 1.5) - mu12
    ssim_map = ((2 * mu12 + C1) * (2 * s12 + C2)) / ((mu1_sq + mu2_sq + C1) * (s1 + s2 + C2))
    return float(ssim_map.mean())


def compare_hist(f1, f2):
    """Histogram correlation."""
    h1 = cv2.calcHist([f1], [0, 1, 2], None, [32, 32, 32], [0, 256, 0, 256, 0, 256])
    h2 = cv2.calcHist([f2], [0, 1, 2], None, [32, 32, 32], [0, 256, 0, 256, 0, 256])
    cv2.normalize(h1, h1)
    cv2.normalize(h2, h2)
    return cv2.compareHist(h1, h2, cv2.HISTCMP_CORREL)


def compare_mse(f1, f2):
    """MSE similarity (1 = identical, 0 = fully different)."""
    r1 = resize_frame(f1).astype(np.float64)
    r2 = resize_frame(f2).astype(np.float64)
    mse = np.mean((r1 - r2) ** 2)
    return 1.0 - min(mse / (255 ** 2), 1.0)


METHODS = {"ssim": compare_ssim, "hist": compare_hist, "mse": compare_mse}


def find_loop_point(video_path, threshold=0.90, skip_frames=None, method="ssim", verbose=True):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"ERROR: Cannot open {video_path}")
        sys.exit(1)

    fps = cap.get(cv2.CAP_PROP_FPS)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    if verbose:
        print(f"Video: {w}x{h} @ {fps:.2f}fps, {total} frames ({total/fps:.2f}s)")

    # Read first frame
    ret, first_frame = cap.read()
    if not ret:
        print("ERROR: Cannot read first frame")
        sys.exit(1)

    if skip_frames is None:
        skip_frames = max(int(fps), 1)

    compare_fn = METHODS[method]
    best_score = 0.0
    best_frame = -1

    print(f"Searching with method={method}, threshold={threshold}, skip={skip_frames} frames...")

    for i in range(1, total):
        ret, frame = cap.read()
        if not ret:
            break

        if i < skip_frames:
            continue

        score = compare_fn(first_frame, frame)

        if score > best_score:
            best_score = score
            best_frame = i

        if score >= threshold:
            print(f"  Match found at frame {i} ({i/fps:.3f}s) — score={score:.4f}")
            cap.release()
            return i, fps, score

        if verbose and i % int(fps * 5) == 0:
            print(f"  Progress: {i}/{total} frames, best so far: {best_score:.4f} at frame {best_frame}")

    cap.release()

    if best_frame > 0:
        print(f"\nNo frame above threshold. Best match: frame {best_frame} ({best_frame/fps:.3f}s), score={best_score:.4f}")
        ans = input(f"Use frame {best_frame} (score={best_score:.4f})? [y/N] ").strip().lower()
        if ans == 'y':
            return best_frame, fps, best_score

    print("No suitable loop point found.")
    sys.exit(1)


def trim_video(input_path, output_path, end_frame, fps):
    duration = end_frame / fps
    cmd = [
        "ffmpeg", "-y",
        "-i", input_path,
        "-t", str(duration),
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "18",
        "-c:a", "aac",
        "-movflags", "+faststart",
        output_path
    ]
    print(f"\nTrimming to {end_frame} frames ({duration:.3f}s)...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("FFmpeg error:", result.stderr[-500:])
        sys.exit(1)
    print(f"Output: {output_path}")
    size = os.path.getsize(output_path) / 1024
    print(f"File size: {size:.1f} KB")


def main():
    parser = argparse.ArgumentParser(description="Find perfect loop point in a video")
    parser.add_argument("input", help="Input video file")
    parser.add_argument("output", nargs="?", help="Output video file (default: input_loop.mp4)")
    parser.add_argument("--threshold", type=float, default=0.90, help="Similarity threshold (0-1, default 0.90)")
    parser.add_argument("--skip", type=int, default=None, help="Frames to skip before searching (default: 1 second)")
    parser.add_argument("--method", choices=["ssim", "hist", "mse"], default="ssim", help="Comparison method")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"ERROR: File not found: {args.input}")
        sys.exit(1)

    if args.output is None:
        base, ext = os.path.splitext(args.input)
        args.output = base + "_loop.mp4"

    loop_frame, fps, score = find_loop_point(
        args.input,
        threshold=args.threshold,
        skip_frames=args.skip,
        method=args.method
    )

    print(f"\nLoop point: frame {loop_frame} @ {loop_frame/fps:.3f}s (score={score:.4f})")
    trim_video(args.input, args.output, loop_frame, fps)
    print("\nDone! The output video starts and ends on the same frame.")


if __name__ == "__main__":
    main()
