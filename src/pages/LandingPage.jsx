import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, Zap, Brain, Users, BarChart3, Lock,
  ArrowRight, CheckCircle2, ChevronRight, Activity,
  FileText, Search, DollarSign, AlertTriangle, MessageSquare, Workflow, Moon, Sun
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import './LandingPage.css'

/* ── Persona cards ── */
const PERSONAS = [
  {
    icon: Users,
    role: 'Policyholder',
    color: 'var(--input-bg)',
    gradient: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    desc: 'Submit claims, upload documents, and track real-time settlement status from anywhere.',
    tag: 'Claimant Portal',
  },
  {
    icon: FileText,
    role: 'Claims Adjuster',
    color: 'var(--primary)',
    gradient: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    desc: 'Review AI-escalated complex claims with full reasoning traces and one-click decisions.',
    tag: 'Adjuster Console',
  },
  {
    icon: AlertTriangle,
    role: 'SIU Investigator',
    color: 'var(--button-orange)',
    gradient: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    desc: 'Investigate fraud-flagged cases with risk scores, red-flag breakdowns, and watchlist data.',
    tag: 'SIU Dashboard',
  },
  {
    icon: BarChart3,
    role: 'Supervisor',
    color: 'var(--button-orange)',
    gradient: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    desc: 'Monitor STP rates, TAT metrics, CSAT scores, and agent-level KPIs in real time.',
    tag: 'KPI Command Center',
  },
  {
    icon: Activity,
    role: 'IT / Ops',
    color: 'var(--hover-orange)',
    gradient: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    desc: 'Watch agent health, API latencies, error rates, and system observability dashboards.',
    tag: 'Ops Monitor',
  },
]

/* ── Agent pipeline steps ── */
const AGENTS = [
  { id: 'A1', icon: Workflow, label: 'Orchestrator', desc: 'State machine that coordinates the entire claim pipeline.' },
  { id: 'A2', icon: FileText, label: 'FNOL Intake', desc: 'OCR/NER extraction from forms, emails, voice, and images.' },
  { id: 'A3', icon: Shield, label: 'Coverage Verify', desc: 'Validates policy in-force status, limits, and exclusions.' },
  { id: 'A4', icon: Search, label: 'Damage Assessment', desc: 'CV model + RAG estimates repair costs from photos/docs.' },
  { id: 'A5', icon: AlertTriangle, label: 'Fraud & Risk Score', desc: 'Predictive model flags red flags and SIU watchlist hits.' },
  { id: 'A6', icon: DollarSign, label: 'Settlement', desc: 'Calculates payout, initiates payment, generates letter.' },
  { id: 'A7', icon: Users, label: 'Adjuster Handoff', desc: 'Packages complex claims with reasoning trace for human.' },
  { id: 'A8', icon: MessageSquare, label: 'Claimant Chatbot', desc: 'Real-time Q&A and status updates via conversational AI.' },
]

/* ── Stats ── */
const STATS = [
  { value: '≥60%', label: 'Straight-Through Processing' },
  { value: '<2hrs', label: 'Auto-Settlement TAT' },
  { value: '≥99%', label: 'Coverage Decision Accuracy' },
  { value: '≥85%', label: 'Fraud Recall @ Top 10%' },
]

/* ── Features ── */
const FEATURES = [
  { icon: Brain, title: 'Multi-Agent AI Core', desc: '8 specialized agents orchestrated by LangGraph state machine.' },
  { icon: Shield, title: 'Five-Rail Guardrails', desc: 'Input · Dialog · Retrieval · Execution · Output rails enforced.' },
  { icon: Zap, title: '<5s Agent Loop P95', desc: 'Deterministic feedback loops with circuit-breaker protection.' },
  { icon: Lock, title: 'GDPR · SOC 2 Ready', desc: 'End-to-end encryption, PII redaction, immutable audit logs.' },
]

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

export default function LandingPage() {
  const navigate = useNavigate()

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="landing min-h-screen">
      {/* ── NAVBAR ── */}
      <nav className="landing-nav glass fixed top-0 left-0 right-0 z-[100] rounded-none">
        <div className="landing-nav-inner max-w-[1200px] mx-auto py-4 px-8 flex items-center justify-between gap-6">
          <div className="logo">
            <div className="logo-icon" style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={18} color="#fff" /></div>
            <span className="logo-text">Claim<span className="gradient-text">AI</span></span>
          </div>
          <div className="nav-links">
            <a href="#agents" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Agents</a>
            <a href="#personas" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Personas</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Features</a>
          </div>
          <div className="nav-actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title="Toggle Theme"
              className="border-none hover:bg-transparent"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Get Started <ArrowRight size={16} className="ml-1"/>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        {/* background orbs */}
        <div className="orb orb-1 w-[400px] h-[400px] -top-[100px] -left-[100px] bg-[rgba(var(--primary-orange-rgb),0.25)]" />
        <div className="orb orb-2 w-[350px] h-[350px] bottom-0 right-0 bg-[rgba(var(--primary-orange-rgb),0.2)]" />
        <div className="orb orb-3 w-[250px] h-[250px] top-[50%] left-[45%] bg-[rgba(var(--primary-orange-rgb),0.1)]" />

        <motion.div
          className="hero-content"
          initial="hidden" animate="visible" variants={stagger}
        >
          <motion.div variants={fadeUp} className="hero-badge">
            <span className="badge badge-info">✦ AI-Powered Insurance Platform</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-title">
            From FNOL to Settlement
            <br />
            <span className="gradient-text">in Under 2 Hours</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-desc text-muted-foreground">
            An 8-agent AI system that automates the complete insurance claims lifecycle —
            intake, verification, assessment, fraud scoring, and settlement — with
            intelligent human escalation for complex cases.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-ctas">
            <Button variant="primary" className="hero-cta-main h-[54px] px-[32px] text-[1.05rem]" onClick={() => navigate('/login')}>
              Access Your Dashboard <ArrowRight size={18} className="ml-2"/>
            </Button>
            <a href="#agents" className="text-text hover:bg-hover hover:text-foreground inline-flex items-center justify-center rounded-[10px] font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none h-[54px] px-[32px] text-[1.05rem]">
              See How It Works <ChevronRight size={16} className="ml-2"/>
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeUp} className="hero-stats border-t border-border">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <div className="hero-stat-value gradient-text">{s.value}</div>
                <div className="hero-stat-label text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Animated pipeline visual */}
        <motion.div
          className="hero-visual animate-float"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="pipeline-card glass">
            <div className="pipeline-header text-muted-foreground">
              <span className="pip-dot green w-[10px] h-[10px] rounded-full bg-button-orange" /><span className="pip-dot yellow w-[10px] h-[10px] rounded-full bg-hover-orange" /><span className="pip-dot red w-[10px] h-[10px] rounded-full bg-orange-border" />
              <span className="pipeline-title">Claim Pipeline — Live</span>
            </div>
            {['FNOL Received', 'Coverage ✓', 'Damage: $8,500', 'Fraud Score: 0.03', 'Settlement Initiated'].map((step, i) => (
              <div key={step} className="pipeline-step border-b border-border" style={{ animationDelay: `${i * 0.4}s` }}>
                <CheckCircle2 size={14} color="#FF7A45" />
                <span className="flex-1">{step}</span>
                <span className="pipeline-step-time text-muted-foreground">{['09:00', '09:02', '09:04', '09:06', '09:08'][i]}</span>
              </div>
            ))}
            <div className="pipeline-result" style={{ color: "var(--button-orange)" }}>
              <DollarSign size={16} color="#FF7A45" />
              <strong className="flex-1">₹3,500 Settled — Auto</strong>
              <span className="badge badge-success">Done</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── AGENT PIPELINE ── */}
      <section className="section" id="agents">
        <motion.div
          className="section-header"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          <motion.p variants={fadeUp} className="section-label" style={{ color: "var(--hover-orange)" }}>The Engine</motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            8 Specialized AI Agents
          </motion.h2>
          <motion.p variants={fadeUp} className="section-desc text-muted-foreground">
            Each agent has a distinct role, bounded autonomy, and isolated context — orchestrated by LangGraph.
          </motion.p>
        </motion.div>

        <motion.div
          className="agents-grid"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          {AGENTS.map((ag, i) => (
            <motion.div key={ag.id} variants={fadeUp} className="agent-card glass">
              <div className="agent-id" style={{ color: "var(--hover-orange)" }}>{ag.id}</div>
              <div className="agent-icon-wrap">
                <ag.icon size={22} color="#F56B2F" />
              </div>
              <div className="agent-label">{ag.label}</div>
              <p className="agent-desc text-muted-foreground">{ag.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── PERSONAS ── */}
      <section className="section" id="personas">
        <motion.div
          className="section-header"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          <motion.p variants={fadeUp} className="section-label" style={{ color: "var(--hover-orange)" }}>Who It Serves</motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            Role-Based Access for Every Stakeholder
          </motion.h2>
          <motion.p variants={fadeUp} className="section-desc text-muted-foreground">
            Each persona gets a tailored dashboard with exactly the tools and data they need.
          </motion.p>
        </motion.div>

        <motion.div
          className="personas-grid"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          {PERSONAS.map(p => (
            <motion.div
              key={p.role}
              variants={fadeUp}
              className="persona-card glass"
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => navigate('/login')}
            >
              <div className="persona-icon " style={{ background: p.gradient }}>
                <p.icon size={22} className="text-white" />
              </div>
              <div className="persona-tag text-muted-foreground">{p.tag}</div>
              <h3 className="persona-role">{p.role}</h3>
              <p className="persona-desc text-muted-foreground">{p.desc}</p>
              <div className="persona-link" style={{ color: "var(--hover-orange)" }}>
                Access Dashboard <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section features-section" id="features">
        <motion.div
          className="features-inner"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          <div className="features-left">
            <motion.p variants={fadeUp} className="section-label" style={{ color: "var(--hover-orange)" }}>Enterprise-Grade</motion.p>
            <motion.h2 variants={fadeUp} className="section-title left text-left">
              Built for Production,<br />Not Just Demos
            </motion.h2>
            <motion.p variants={fadeUp} className="section-desc left m-0 text-left">
              Every design decision is grounded in real insurance ops: guardrails, memory isolation,
              audit immutability, and regulator-ready explainability.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button variant="primary" className="mt-4" onClick={() => navigate('/login')}>
                Start Processing Claims <ArrowRight size={16} className="ml-2"/>
              </Button>
            </motion.div>
          </div>

          <div className="features-right">
            {FEATURES.map(f => (
              <motion.div key={f.title} variants={fadeUp} className="feature-item glass">
                <div className="feature-icon">
                  <f.icon size={20} color="#F56B2F" />
                </div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc text-muted-foreground">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="cta-section bg-gradient-to-b from-transparent to-[rgba(var(--primary-orange-rgb),0.06)] border-t border-border">
        <div className="orb orb-cta-1 w-[500px] h-[500px] -top-[200px] left-1/2 -translate-x-1/2 bg-[rgba(var(--primary-orange-rgb),0.15)]" />
        <div className="orb orb-cta-2 w-[300px] h-[300px] -bottom-[100px] right-[10%] bg-[rgba(var(--primary-orange-rgb),0.1)]" />
        <motion.div
          className="cta-inner"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="cta-title">
            Ready to transform your claims operation?
          </motion.h2>
          <motion.p variants={fadeUp} className="cta-desc text-muted-foreground">
            Select your role and log in to experience the full multi-agent claims automation platform.
          </motion.p>
          <motion.div variants={fadeUp} className="cta-buttons">
            {PERSONAS.map(p => (
              <Button
                key={p.role}
                variant="outline"
                className="flex justify-center p-6 gap-10 h-[52px] text-sm hover:border-[var(--p-color)]"
                style={{ '--p-color': p.color }}
                onClick={() => navigate('/login')}
              >
                <p.icon size={16} />
                {p.role}
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer border-t border-border">
        <div className="logo">
          <div className="logo-icon bg-gradient-to-br from-primary to-primary-orange"><Shield size={16} /></div>
          <span className="logo-text">Claim<span className="gradient-text">AI</span></span>
        </div>
        <p className="footer-note text-muted-foreground">© 2024 ClaimAI — Agent 7 Claims Automation Platform</p>
      </footer>
    </div>
  )
}
