import { G } from './tokens'
import { LeafIcon } from './LeafIcon'

const kFiles = [
  { tag: 'KNOWLEDGE',        file: 'content.md',              desc: 'Skill badges · MongoDB Book · Docs · SME Insights' },
  { tag: 'AUDIENCE CONTEXT', file: 'audience-and-tactics.md', desc: 'AI Native · TOFU/MOFU/BOFU · V1/V2 launch readiness' },
  { tag: 'STRATEGIC FRAME',  file: 'campaign-brief-fy27.md',  desc: 'FY27 goals · phased rollout · technical-respect-first' },
]

const blogSteps = [
  ['01', 'Title',          'Value-first, outcome-clear'],
  ['02', 'Lede',           '≤150 words, real developer problem'],
  ['03', 'Why it matters', 'Stakes, limitations, change'],
  ['04', 'What it is',     'Plain-English before deep dive'],
  ['05', 'How it works',   '2–4 subsections, ≤300w each'],
  ['06', 'Example',        'Code snippet + explanation'],
  ['07', 'Best practices', 'Tradeoffs, when to use/avoid'],
  ['08', 'Next steps',     'Docs, Atlas, related resources'],
]

const styleGuide = [
  ['Audience',           'AI-native founders & engineers — production RAG / agent systems'],
  ['Opening rule',       'First 150 words: specific failure mode, not a capability'],
  ['Pain anchoring',     'Name cost of NOT solving: trust, quality, debug time, risk'],
  ['MongoDB placement',  'Next Steps only — one option, never the conclusion'],
  ['Trust signals',      'One honest tradeoff per post — leveled-with audiences stay'],
]

const outputs = [
  { label: 'BLOG POST',      accent: G.grn,  title: 'How to Evaluate a Memory Solution',  meta: 'Draft v0.1 · 5 min read · AI-native engineers' },
  { label: 'LINKEDIN',       accent: G.blue, title: '5-post thread · Engineering Leads',   meta: 'Draft v0.1 · MOFU · Same source, different channel' },
  { label: 'EMAIL SEQUENCE', accent: G.orng, title: '2-email sequence, 7 days apart',      meta: 'Draft v0.1 · MOFU · Engineering Leads · Memory Eval' },
]

export function ConceptB() {
  return (
    <div style={{ background: G.bg, minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <header style={{
        background: G.hdr, borderBottom: `1px solid ${G.bdr}`,
        display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, flexShrink: 0,
      }}>
        <LeafIcon />
        <span style={{ color: G.wht, fontSize: 16, fontWeight: 600, marginLeft: 10 }}>Ghostwriter</span>
        <span style={{ color: G.mut, fontSize: 14, marginLeft: 24 }}>AI Native Campaign</span>
        <div style={{ flex: 1 }} />
        <button style={{
          background: G.grn, color: G.bg, fontSize: 13, fontWeight: 600,
          padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}>⚡ Generate All</button>
      </header>

      {/* 3-column grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', minHeight: 0 }}>

        {/* Col 1: INPUT */}
        <div style={{ borderRight: `1px solid ${G.bdr}`, padding: '24px 24px 40px', overflowY: 'auto' }}>
          <ColHeader num="01" pill="INPUT" title="Curated Knowledge" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            {kFiles.map(f => (
              <div key={f.file} style={{ background: G.crd, borderRadius: 8, overflow: 'hidden', display: 'flex', minHeight: 80 }}>
                <div style={{ width: 4, background: G.grn, flexShrink: 0 }} />
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ background: G.gpb, display: 'inline-block', padding: '2px 8px', borderRadius: 8, marginBottom: 6 }}>
                    <span style={{ color: G.grn, fontSize: 8, fontWeight: 600 }}>{f.tag}</span>
                  </div>
                  <div style={{ color: G.gmut, fontSize: 11, marginBottom: 4 }}>{f.file}</div>
                  <div style={{ color: G.mut, fontSize: 10 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: PROCESS */}
        <div style={{ borderRight: `1px solid ${G.bdr}`, padding: '24px 24px 40px', overflowY: 'auto' }}>
          <ColHeader num="02" pill="PROCESS" title="Templates & Style" />
          <div style={{ marginTop: 16 }}>
            <div style={{ color: G.grn, fontSize: 9, fontWeight: 600, letterSpacing: '0.5px', marginBottom: 8 }}>
              GHOSTWRITER BLOG TEMPLATE
            </div>
            <div style={{ borderTop: `1px solid ${G.bdr}`, paddingTop: 10 }}>
              {blogSteps.map(([num, name, desc]) => (
                <div key={num} style={{ display: 'flex', gap: 10, padding: '4px 0', alignItems: 'baseline' }}>
                  <span style={{ color: G.grn, fontSize: 11, fontWeight: 600, minWidth: 22 }}>{num}</span>
                  <span style={{ color: G.wht, fontSize: 12, fontWeight: 600, minWidth: 110 }}>{name}</span>
                  <span style={{ color: G.mut, fontSize: 11 }}>{desc}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${G.bdr}`, marginTop: 14, paddingTop: 14 }}>
              <div style={{ color: G.orng, fontSize: 9, fontWeight: 600, letterSpacing: '0.5px', marginBottom: 10 }}>
                AI-NATIVE STYLE GUIDE
              </div>
              {styleGuide.map(([label, desc]) => (
                <div key={label} style={{ display: 'flex', gap: 12, paddingBottom: 10, marginBottom: 2 }}>
                  <div style={{ width: 3, background: G.orng, borderRadius: 1, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ color: G.wht, fontSize: 12, fontWeight: 600 }}>{label}</div>
                    <div style={{ color: G.mut, fontSize: 11, marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: OUTPUT */}
        <div style={{ padding: '24px 24px 40px', overflowY: 'auto' }}>
          <ColHeader num="03" pill="OUTPUT" title="Tailored Content" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {outputs.map(out => (
              <div key={out.label} style={{ background: G.crd, borderRadius: 10, overflow: 'hidden', display: 'flex', minHeight: 108 }}>
                <div style={{ width: 4, background: out.accent, flexShrink: 0 }} />
                <div style={{ padding: '14px 16px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ background: G.gpb, padding: '2px 8px', borderRadius: 8 }}>
                      <span style={{ color: out.accent, fontSize: 8, fontWeight: 600 }}>{out.label}</span>
                    </div>
                    <div style={{ background: G.dim, padding: '2px 8px', borderRadius: 8 }}>
                      <span style={{ color: G.mut, fontSize: 8, fontWeight: 500 }}>Draft</span>
                    </div>
                  </div>
                  <div style={{ color: G.wht, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{out.title}</div>
                  <div style={{ color: G.mut, fontSize: 11 }}>{out.meta}</div>
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: out.accent, fontSize: 16 }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ColHeader({ num, pill, title }: { num: string; pill: string; title: string }) {
  return (
    <div style={{ paddingBottom: 16, borderBottom: `1px solid ${G.bdr}` }}>
      <div style={{ color: G.grn, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{num}</div>
      <div style={{ background: G.gpb, display: 'inline-block', padding: '2px 10px', borderRadius: 10, marginBottom: 8 }}>
        <span style={{ color: G.grn, fontSize: 9, fontWeight: 600 }}>{pill}</span>
      </div>
      <div style={{ color: G.wht, fontSize: 15, fontWeight: 600 }}>{title}</div>
    </div>
  )
}
