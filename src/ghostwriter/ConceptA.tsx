import { G } from './tokens'
import { LeafIcon } from './LeafIcon'

const cards = [
  {
    tag: 'KNOWLEDGE',
    file: 'content.md',
    title: 'Existing Knowledge',
    desc: 'Related Skill badges, MongoDB Book, Docs and SME Insights',
  },
  {
    tag: 'AUDIENCE CONTEXT',
    file: 'audience-and-tactics.md',
    title: 'Audience & Tactics',
    desc: 'AI Native segments, stakeholders, channel tactics by funnel stage (TOFU/MOFU/BOFU), V1/V2 launch readiness.',
  },
  {
    tag: 'STRATEGIC FRAME',
    file: 'campaign-brief-fy27.md',
    title: 'Campaign Brief F27',
    desc: 'Goals, content themes, phased rollout (V1 end-May, V2 mid-July), and the core shift: enablement-first → technical-respect-first.',
  },
]

const steps = [
  { num: '01', pill: 'INPUT',   label: 'Curated Knowledge',  active: true  },
  { num: '02', pill: 'PROCESS', label: 'Templates & Style',  active: false },
  { num: '03', pill: 'OUTPUT',  label: 'Tailored Content',   active: false },
]

export function ConceptA() {
  return (
    <div style={{ background: G.bg, minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <header style={{
        background: G.hdr, borderBottom: `1px solid ${G.bdr}`,
        display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, flexShrink: 0,
      }}>
        <LeafIcon />
        <span style={{ color: G.wht, fontSize: 16, fontWeight: 600, marginLeft: 10 }}>Ghostwriter</span>
        <span style={{ color: G.mut, fontSize: 16, marginLeft: 8 }}>Content Package</span>
        <div style={{ flex: 1 }} />
        <span style={{ background: G.dim, color: G.mut, fontSize: 11, fontWeight: 500, padding: '4px 12px', borderRadius: 12 }}>
          May 2026
        </span>
      </header>

      {/* Step indicator */}
      <div style={{
        background: G.stp, borderBottom: `1px solid ${G.bdr}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px 0', flexShrink: 0,
      }}>
        {steps.map((step, i) => (
          <div key={step.num} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 148 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: step.active ? G.gpb : G.dim,
                  border: `2px solid ${step.active ? G.grn : G.bdr}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {step.active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: G.grn }} />}
                </div>
                <span style={{ color: step.active ? G.grn : G.mut, fontSize: 13, fontWeight: 700 }}>{step.num}</span>
              </div>
              <div style={{ background: step.active ? G.gpb : G.dim, padding: '2px 10px', borderRadius: 10 }}>
                <span style={{ color: step.active ? G.grn : G.mut, fontSize: 9, fontWeight: 600 }}>{step.pill}</span>
              </div>
              <span style={{ color: step.active ? G.wht : G.mut, fontSize: 11 }}>{step.label}</span>
            </div>
            {i < 2 && <div style={{ width: 72, height: 1, background: G.bdr, marginBottom: 20 }} />}
          </div>
        ))}
      </div>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px 100px' }}>
        <div style={{ width: '100%', maxWidth: 840 }}>
          <div style={{ color: G.grn, fontSize: 11, fontWeight: 600, marginBottom: 8, letterSpacing: '0.5px' }}>
            LAYER 01 · INPUT
          </div>
          <h2 style={{ color: G.wht, fontSize: 32, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.2 }}>
            Curated Knowledge
          </h2>
          <p style={{ color: G.mut, fontSize: 15, margin: '0 0 32px' }}>
            The context that grounds every output in real campaign signal.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {cards.map(card => <KnowledgeCard key={card.tag} {...card} />)}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: G.hdr, borderTop: `1px solid ${G.bdr}`,
        display: 'flex', alignItems: 'center', padding: '0 48px', height: 64,
      }}>
        <span style={{ color: G.mut, fontSize: 12 }}>Step 1 of 3</span>
        <div style={{ flex: 1 }} />
        <button style={{
          background: G.grn, color: G.bg, fontSize: 14, fontWeight: 600,
          padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}>
          Continue →
        </button>
      </footer>
    </div>
  )
}

function KnowledgeCard({ tag, file, title, desc }: { tag: string; file: string; title: string; desc: string }) {
  return (
    <div style={{ background: G.crd, borderRadius: 8, display: 'flex', overflow: 'hidden', minHeight: 96 }}>
      <div style={{ width: 4, background: G.grn, flexShrink: 0 }} />
      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'stretch', flex: 1, gap: 24 }}>
        <div style={{ minWidth: 148 }}>
          <div style={{ background: G.gpb, display: 'inline-block', padding: '3px 10px', borderRadius: 10, marginBottom: 8 }}>
            <span style={{ color: G.grn, fontSize: 9, fontWeight: 600 }}>{tag}</span>
          </div>
          <div style={{ color: G.gmut, fontSize: 11 }}>{file}</div>
        </div>
        <div style={{ width: 1, background: G.bdr, flexShrink: 0 }} />
        <div style={{ paddingLeft: 8 }}>
          <div style={{ color: G.wht, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{title}</div>
          <div style={{ color: G.mut, fontSize: 12, lineHeight: 1.5 }}>{desc}</div>
        </div>
      </div>
    </div>
  )
}
