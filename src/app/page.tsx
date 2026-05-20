import {
  ArrowUpRight, GithubLogo, LinkedinLogo, ArrowDown,
  Code, Brain, TerminalWindow,
  Cpu, Sparkle,
  Envelope, CaretRight,
} from "@/components/ClientIcons";
import { ShaderCanvas } from "@/components/ShaderCanvas";
import { TiltCard } from "@/components/TiltCard";

// ─── DATA ────────────────────────────────────────────────────────────────────

// Duplicated significantly so the marquee never resets visually mid-screen
const SKILLS_ROW1 = Array(4).fill(["Python","LangGraph","FastAPI","QdrantDB","Redis","Ollama"]).flat();
const SKILLS_ROW2 = Array(4).fill(["RAG Systems","Prompt Engineering","ComfyUI","Hugging Face","FFmpeg","NumPy"]).flat();

const EXPERIENCE = [
  {
    role: "GenAI Engineer Intern",
    company: "Astroraaga",
    period: "Apr 2026 – Present",
    tags: ["LangGraph","RAG","Prompt Eng"],
    bullets: [
      "Restructured LangGraph pipeline into a modular architecture — −60% debug time, +40% dev velocity.",
      "Optimized production GenAI pipeline via prompt engineering & token budgeting — −50% latency, −70% cost.",
      "Contributing across backend infra, optimisation, and US-timezone production operations.",
    ],
    metrics: ["-50% latency", "-70% cost", "-60% debug"],
  },
  {
    role: "Python Developer Intern",
    company: "SovereigntLabs (web3)",
    period: "Oct 2024 – Feb 2025",
    tags: ["Python","DeepFace","AI Auth"],
    bullets: [
      "Led team to design and build AI face-auth system using DeepFace and Python, owning core architecture.",
      "Implemented facial encoding to generate unique text-based codes for secure user login — first end-to-end production system.",
    ],
    metrics: ["End-to-end owned", "Face auth prod"],
  },
];

const PROJECTS = [
  {
    id: "rag",
    title: "RAG Knowledge QA System",
    description: "Production hybrid RAG pipeline: QdrantDB dense retrieval + BM25 sparse + CrossEncoder reranking. +40% retrieval coverage, −60% low-quality chunks filtered before LLM generation.",
    stack: ["Python","FastAPI","Redis","QdrantDB","Ollama","NLTK"],
    stat: "+40% coverage",
    icon: <Brain size={28} weight="duotone" />,
    span: "col-span-12 md:col-span-8",
    tall: true,
    href: "https://github.com/dev2180/rag-async-chat",
    shaderType: "liquid" as const,
  },
  {
    id: "deadcrypt",
    title: "DeadCrypt",
    description: "Binary → RGB pixel video encoding. Maps arbitrary files to video via pixel values. Lossless FFV1 codec.",
    stack: ["Python","NumPy","Pillow","FFmpeg"],
    stat: "Systems-level",
    icon: <TerminalWindow size={28} weight="duotone" />,
    span: "col-span-12 md:col-span-4",
    tall: false,
    href: "https://github.com/dev2180/DeadCrypt",
    shaderType: "digital" as const,
  },
  {
    id: "building",
    title: "Currently Building",
    description: "Next project in stealth. Stay tuned on LinkedIn → #0to100Xengineer.",
    stack: [],
    stat: "Stealth mode",
    icon: <Sparkle size={28} weight="duotone" />,
    span: "col-span-12 md:col-span-4",
    tall: false,
    href: "https://www.linkedin.com/in/dev-sharma-a33214256/",
    shaderType: "stealth" as const,
  },
  {
    id: "cohort",
    title: "100xEngineers Cohort",
    description: "ComfyUI · SDXL · FLUX · LoRA training on Hugging Face. Sharing weekly AI engineering learnings publicly.",
    stack: ["ComfyUI","SDXL","FLUX","LoRA"],
    stat: "Mar 2026–Now",
    icon: <Cpu size={28} weight="duotone" />,
    span: "col-span-12 md:col-span-8",
    tall: false,
    href: "https://www.linkedin.com/in/dev-sharma-a33214256/",
    shaderType: "neural" as const,
  },
];

const LI_POSTS = [
  {
    tag: "#0to100Xengineer",
    excerpt: "Built a production hybrid RAG pipeline this week — combining BM25 sparse retrieval with dense QdrantDB vectors. The CrossEncoder reranking step alone cut irrelevant chunks by 60%...",
    likes: "142",
    comments: "18",
    href: "https://www.linkedin.com/in/dev-sharma-a33214256/",
  },
  {
    tag: "Prompt Engineering",
    excerpt: "Reduced LLM inference cost by 70% without touching the model. Token budgeting + response trimming + model switching. Here's the exact playbook I used at Astroraaga...",
    likes: "208",
    comments: "31",
    href: "https://www.linkedin.com/in/dev-sharma-a33214256/",
  },
  {
    tag: "ComfyUI + FLUX",
    excerpt: "Trained a custom LoRA on FLUX for a client project using Hugging Face. The quality jump over SDXL base is insane. Here's the training config breakdown...",
    likes: "176",
    comments: "22",
    href: "https://www.linkedin.com/in/dev-sharma-a33214256/",
  },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="navbar-custom">
      <span className="nav-logo">.:DS</span>
      <div className="nav-links-container">
        {["About","Work","Projects","Writing"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="nav-link-item">{l}</a>
        ))}
      </div>
      <a
        href="https://docs.google.com/document/d/18qKvb34XjSTxdSJBjIRYYcfWa9R1MZS5/edit?usp=sharing&ouid=101310281811549086582&rtpof=true&sd=true"
        target="_blank" rel="noopener noreferrer"
        className="nav-resume-btn"
      >
        Resume
        <span className="nav-resume-btn-icon">
          <ArrowUpRight size={10} weight="bold" />
        </span>
      </a>
    </nav>
  );
}

function Hero({ isClone = false }: { isClone?: boolean }) {
  return (
    <section 
      id={isClone ? undefined : "about"} 
      className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden max-w-7xl mx-auto px-6" 
      style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        textAlign: "center",
        paddingTop: "6rem", 
        paddingBottom: "6rem" 
      }}
    >
      <style>{`
        @keyframes breath {
          0% {
            text-shadow: 0 0 0px rgba(0, 122, 255, 0);
            filter: brightness(0.9);
          }
          50% {
            text-shadow: 0 0 25px rgba(0, 122, 255, 0.65), 0 0 45px rgba(0, 122, 255, 0.3);
            filter: brightness(1.3);
          }
          100% {
            text-shadow: 0 0 10px rgba(0, 122, 255, 0.2);
            filter: brightness(1.0);
          }
        }
        .animate-breath {
          display: inline-block !important;
          animation: breath 3s ease-in-out infinite alternate !important;
          will-change: filter;
          backface-visibility: hidden;
        }
      `}</style>

      {/* eyebrow */}
      <p className="hero-sub mb-8 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse" />
        GenAI Engineer · Agentic Pipelines · RAG Systems
      </p>

      {/* headline — centered, text-balance prevents awkward wrapping */}
      <h1 className="leading-[0.88] font-display tracking-tight mb-8 max-w-5xl text-balance mx-auto" style={{fontSize:"var(--text-hero)"}}>
        <span className="hero-word block text-white">I build systems</span>
        <span className="hero-word block text-white/40">
          that <span className="text-[#007AFF] inline-block animate-breath">think.</span>
        </span>
      </h1>

      {/* sub copy — text-balance ensures wrapping on mobile to prevent off-center layout breaks */}
      <p className="hero-sub text-white/50 text-base leading-relaxed max-w-xl mx-auto text-balance px-4" style={{ marginBottom: "4.5rem" }}>
        I can do things which A.I can&apos;t. Currently building
        production LangGraph workflows at <strong className="text-[#007AFF]">Astroraaga</strong>.
      </p>

      {/* CTAs aligned center */}
      <div className="hero-ctas flex flex-wrap gap-4 justify-center">
        <a href="#projects"
          className="group flex items-center justify-center gap-3 pl-2 pr-5 py-2 rounded-full bg-[#007AFF] text-white font-bold text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]">
          <span className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
            <Code size={14} weight="bold" />
          </span>
          View Projects
        </a>
        <a href="https://github.com/dev2180" target="_blank" rel="noopener noreferrer"
          className="group flex items-center justify-center gap-3 pl-2 pr-5 py-2 rounded-full bg-white/5 border border-white/15 text-white font-bold text-sm tracking-wide hover:bg-white/10 transition-all duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <GithubLogo size={14} weight="fill" />
          </span>
          GitHub
        </a>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <section className="w-full py-16 overflow-hidden border-y border-white/5 bg-black/40" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="overflow-hidden mb-4">
        <div className="marquee-track-left">
          {SKILLS_ROW1.map((s, i) => (
            <span key={i} className="flex-shrink-0 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs font-bold tracking-[0.15em] uppercase hover:text-[#007AFF] transition-colors duration-300" style={{ padding: "0.5rem 1.25rem", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.05)" }}>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="marquee-track-right">
          {SKILLS_ROW2.map((s, i) => (
            <span key={i} className="flex-shrink-0 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs font-bold tracking-[0.15em] uppercase hover:text-[#007AFF] transition-colors duration-300" style={{ padding: "0.5rem 1.25rem", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.05)" }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="work" className="w-full py-32 md:py-48 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
      <p className="reveal mb-4 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Experience</p>
      <h2 className="reveal font-display mb-16 mx-auto" style={{fontSize:"var(--text-section)"}}>
        Where I&apos;ve built.
      </h2>

      <div className="w-full space-y-0 border-t border-white/10 text-left" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        {EXPERIENCE.map((exp, i) => (
          <details key={i} className="accordion-item group w-full">
            <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
              <div className="flex items-center gap-5 overflow-hidden">
                <span className="text-[10px] text-white/20 font-mono w-6 shrink-0">{String(i+1).padStart(2,"0")}</span>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-white group-hover:text-[#007AFF] transition-colors duration-300 truncate">{exp.role}</p>
                  <p className="text-sm text-white/40 truncate">{exp.company} &nbsp;·&nbsp; {exp.period}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden md:flex gap-2">
                  {exp.metrics.map((m) => (
                    <span key={m} className="px-3 py-1 rounded-full text-[#007AFF] text-[10px] font-bold whitespace-nowrap" style={{ backgroundColor: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>{m}</span>
                  ))}
                </div>
                <CaretRight size={16} className="text-white/30 group-open:rotate-90 transition-transform duration-300 shrink-0" />
              </div>
            </summary>
            <div className="pb-8 pl-11 grid md:grid-cols-2 gap-8 w-full">
              <ul className="space-y-3">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="text-sm text-white/60 leading-relaxed flex gap-3 break-words">
                    <span className="text-[#007AFF] mt-1 flex-shrink-0">›</span>
                    <span className="min-w-0">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 content-start">
                {exp.tags.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full text-white/50 text-[11px] font-bold whitespace-nowrap" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.375rem 0.75rem", borderRadius: "9999px" }}>{t}</span>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="w-full py-32 md:py-48 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
      <p className="reveal mb-4 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Projects</p>
      <h2 className="reveal font-display mb-16 mx-auto" style={{fontSize:"var(--text-section)"}}>
        What I&apos;ve shipped.
      </h2>

      <div className="w-full grid grid-cols-12 gap-4 grid-flow-dense auto-rows-auto text-left">
        {PROJECTS.map((p) => (
          <TiltCard key={p.id} className={p.span}>
            <a
              href={p.href}
              target="_blank" rel="noopener"
              className="project-card card-shell group block h-full"
            >
              <div className={`card-inner p-8 flex flex-col justify-between overflow-hidden ${p.tall ? "min-h-[360px]" : "min-h-[200px]"}`}>
                {/* Hardware-accelerated dynamic WebGL background shader */}
                <ShaderCanvas type={p.shaderType} />

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <span className="text-[#007AFF] shrink-0">{p.icon}</span>
                  <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 group-hover:bg-[#007AFF] group-hover:text-white group-hover:border-[#007AFF] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <ArrowUpRight size={12} weight="bold" />
                  </span>
                </div>
                <div className="min-w-0 relative z-10">
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:text-[#007AFF] transition-colors duration-300 truncate">{p.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-6 break-words">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span key={s} className="px-2.5 py-1 text-[10px] font-bold tracking-wide text-white/40 rounded-full whitespace-nowrap" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.25rem 0.625rem", borderRadius: "9999px" }}>{s}</span>
                    ))}
                    {p.stat && (
                      <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#007AFF] rounded-full ml-auto whitespace-nowrap" style={{ backgroundColor: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", padding: "0.25rem 0.625rem", borderRadius: "9999px" }}>{p.stat}</span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section id="writing" className="w-full py-32 md:py-48 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
      <div className="mb-16">
        <p className="reveal mb-4 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Writing</p>
        <h2 className="reveal font-display mb-4 mx-auto" style={{fontSize:"var(--text-section)"}}>
          What I share.
        </h2>
        <p className="reveal text-white/40 text-sm">
          Weekly AI engineering learnings on LinkedIn &rarr;&nbsp;
          <a href="https://www.linkedin.com/in/dev-sharma-a33214256/" target="_blank" rel="noopener noreferrer" className="text-[#007AFF] hover:underline">#0to100Xengineer</a>
        </p>
      </div>

      <div className="w-full grid gap-5 text-left">
        {LI_POSTS.map((post, i) => (
          <TiltCard key={i}>
            <a
              href={post.href}
              target="_blank" rel="noopener noreferrer"
              className="li-card card-shell group block h-full"
            >
              <div className="card-inner p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 overflow-hidden">
                <div className="flex-1 min-w-0">
                  <span className="inline-block mb-4 px-3 py-1 rounded-full text-[#007AFF] text-[10px] font-bold tracking-widest whitespace-nowrap" style={{ backgroundColor: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>{post.tag}</span>
                  <p className="text-sm text-white/70 leading-relaxed line-clamp-2 max-w-3xl break-words">{post.excerpt}</p>
                </div>
                <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 shrink-0">
                  <div className="flex gap-4 text-xs text-white/30 font-mono">
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/30 group-hover:text-[#007AFF] transition-colors duration-300">
                    View post <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 shrink-0" />
                  </span>
                </div>
              </div>
            </a>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full py-32 md:py-48 px-4 max-w-7xl mx-auto flex flex-col items-center text-center border-t border-white/5">
      <p className="reveal mb-4 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Contact</p>
      <h2 className="reveal font-display leading-[0.88] mb-12 text-balance mx-auto" style={{fontSize:"var(--text-section)"}}>
        Let&apos;s build something<br />
        <span className="text-white/40">that thinks.</span>
      </h2>
      <div className="flex flex-wrap gap-4 mb-16 justify-center">
        <a href="mailto:dev.sra2180@gmail.com"
          className="group flex items-center justify-center gap-3 pl-2 pr-5 py-2 rounded-full bg-white/5 border border-white/15 text-white font-bold text-sm hover:bg-white/10 transition-all duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95">
          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
            <Envelope size={14} weight="duotone" />
          </span>
          dev.sra2180@gmail.com
        </a>
        <a href="https://www.linkedin.com/in/dev-sharma-a33214256/" target="_blank" rel="noopener noreferrer"
          className="group flex items-center justify-center gap-3 pl-2 pr-5 py-2 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-white font-bold text-sm hover:bg-[#0A66C2]/20 transition-all duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95">
          <span className="w-8 h-8 rounded-full bg-[#0A66C2]/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
            <LinkedinLogo size={14} weight="fill" />
          </span>
          LinkedIn
        </a>
        <a href="https://github.com/dev2180" target="_blank" rel="noopener noreferrer"
          className="group flex items-center justify-center gap-3 pl-2 pr-5 py-2 rounded-full bg-white/5 border border-white/15 text-white font-bold text-sm hover:bg-white/10 transition-all duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95">
          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
            <GithubLogo size={14} weight="fill" />
          </span>
          GitHub
        </a>
      </div>
      <p className="text-xs text-white/20 font-mono">© 2026 Dev Sharma · Built with Next.js + GSAP + Lenis</p>
    </footer>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="overflow-x-hidden w-full max-w-full">
      <Nav />
      <Hero />
      <Marquee />
      <Experience />
      <Projects />
      <Writing />
      <Footer />
      {/* Cloned Hero for seamless infinite scroll looping */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        <Hero isClone={true} />
      </div>
    </main>
  );
}

