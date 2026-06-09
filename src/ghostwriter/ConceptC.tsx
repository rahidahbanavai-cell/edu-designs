import { useState } from 'react'
import { G } from './tokens'
import { LeafIcon } from './LeafIcon'

const kFiles = [
  { name: 'content.md',              meta: 'Skill badges · MongoDB Book · Docs · SME Insights' },
  { name: 'audience-and-tactics.md', meta: 'AI Native · TOFU/MOFU/BOFU · V1/V2 readiness' },
  { name: 'campaign-brief-fy27.md',  meta: 'FY27 goals · phased rollout · core shift' },
]

const styleNotes = [
  { label: 'Failure mode opening', val: '"Your agent looked strong in demos, then production drifted…"' },
  { label: 'Pain before solution',  val: 'User trust ↓ · Output quality ↓ · Debug time ↑ · Risk ↑' },
  { label: 'Standalone value',      val: 'Rubric works with any vendor stack' },
]

type OutputTab = 'blog' | 'linkedin' | 'email'

export function ConceptC() {
  const [activeTab, setActiveTab] = useState<OutputTab>('blog')

  return (
    <div style={{
      background: G.bg, height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, sans-serif', overflow: 'hidden',
    }}>

      {/* Slim header */}
      <header style={{
        background: G.hdr, borderBottom: `1px solid ${G.bdr}`,
        display: 'flex', alignItems: 'center', padding: '0 24px', height: 56, flexShrink: 0,
      }}>
        <LeafIcon size={18} />
        <span style={{ color: G.wht, fontSize: 15, fontWeight: 600, marginLeft: 8 }}>Ghostwriter</span>
        <div style={{ flex: 1 }} />
        <div style={{ background: G.dim, padding: '5px 14px', borderRadius: 8, color: G.wht, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
          AI Native Campaign ▾
        </div>
      </header>

      {/* Panels */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT: Configure */}
        <div style={{
          width: 460, borderRight: `1px solid ${G.bdr}`, flexShrink: 0,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#060F08',
        }}>
          <div style={{ padding: '18px 24px 0' }}>
            <div style={{ color: G.wht, fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Configure</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['Knowledge', 'Templates', 'Style'].map((tab, i) => (
                <div key={tab} style={{
                  padding: '5px 12px', borderRadius: '6px 6px 0 0', fontSize: 12, cursor: 'pointer',
                  background: i === 0 ? G.crd : 'transparent',
                  color: i === 0 ? G.wht : G.mut,
                  fontWeight: i === 0 ? 600 : 400,
                  borderBottom: i === 0 ? `2px solid ${G.grn}` : '2px solid transparent',
                }}>
                  {tab}
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 1, background: G.bdr }} />

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 24px' }}>
            <div style={{ color: G.mut, fontSize: 10, fontWeight: 600, marginBottom: 10, letterSpacing: '0.3px' }}>
              KNOWLEDGE SOURCES
            </div>
            {kFiles.map(f => (
              <div key={f.name} style={{
                background: G.crd, borderRadius: 8, padding: '10px 14px',
                marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 4, background: G.gpb,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontSize: 12,
                }}>📄</div>
                <div>
                  <div style={{ color: G.wht, fontSize: 12, fontWeight: 500 }}>{f.name}</div>
                  <div style={{ color: G.mut, fontSize: 10, marginTop: 2 }}>{f.meta}</div>
                </div>
              </div>
            ))}
            <button style={{
              width: '100%', background: 'transparent', border: `1px solid ${G.bdr}`,
              borderRadius: 8, padding: '9px', color: G.mut, fontSize: 12,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: 20,
            }}>
              + Add knowledge source
            </button>

            <div style={{ height: 1, background: G.bdr, marginBottom: 14 }} />
            <div style={{ color: G.mut, fontSize: 10, fontWeight: 600, marginBottom: 10, letterSpacing: '0.3px' }}>OUTPUT TYPES</div>
            {['Blog Post', 'LinkedIn Thread', 'Email Sequence'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 4, background: G.gpb,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ color: G.grn, fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>
                </div>
                <span style={{ color: G.wht, fontSize: 13 }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: 20, borderTop: `1px solid ${G.bdr}` }}>
            <button style={{
              width: '100%', background: G.grn, border: 'none', borderRadius: 10,
              padding: '13px', color: G.bg, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
              Generate Content
            </button>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ color: G.wht, fontSize: 14, fontWeight: 600 }}>Preview</span>
              <div style={{ background: G.gpb, padding: '3px 10px', borderRadius: 11 }}>
                <span style={{ color: G.grn, fontSize: 10, fontWeight: 500 }}>Generated</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['blog', 'linkedin', 'email'] as OutputTab[]).map((tab, i) => {
                const label = ['Blog Post', 'LinkedIn', 'Email'][i]
                return (
                  <div key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: '5px 12px', borderRadius: '6px 6px 0 0', fontSize: 12, cursor: 'pointer',
                    background: activeTab === tab ? G.crd : 'transparent',
                    color: activeTab === tab ? G.wht : G.mut,
                    fontWeight: activeTab === tab ? 600 : 400,
                    borderBottom: activeTab === tab ? `2px solid ${G.grn}` : '2px solid transparent',
                  }}>
                    {label}
                  </div>
                )
              })}
            </div>
          </div>
          <div style={{ height: 1, background: G.bdr }} />

          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            <div style={{ background: G.crd2, borderRadius: 12, overflow: 'hidden', border: `1px solid ${G.bdr}` }}>
              {/* Browser chrome */}
              <div style={{
                background: '#030A04', padding: '9px 16px',
                display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${G.bdr}`,
              }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#DB4B4B' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D8A62E' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3BB547' }} />
                </div>
                <div style={{
                  flex: 1, background: G.bg, borderRadius: 6, padding: '3px 0',
                  textAlign: 'center', color: G.mut, fontSize: 10,
                }}>
                  mongodb.com/blog/memory-evaluation
                </div>
              </div>

              {/* Blog content */}
              <div style={{ padding: '24px 32px' }}>
                <div style={{ color: G.grn, fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', marginBottom: 12 }}>
                  DEVELOPER BLOG · AI NATIVE
                </div>
                <h1 style={{ color: G.wht, fontSize: 22, fontWeight: 700, margin: '0 0 14px', lineHeight: 1.3 }}>
                  How to Evaluate a Memory Solution: Precision, Recall, and Cost at Scale
                </h1>
                <div style={{ color: G.mut, fontSize: 12, marginBottom: 16 }}>
                  5 min read &nbsp;·&nbsp; AI-native engineers &nbsp;·&nbsp; May 2026
                </div>
                <div style={{ height: 1, background: G.bdr, marginBottom: 18 }} />
                <p style={{ color: G.lede, fontSize: 15, fontWeight: 600, margin: '0 0 14px', lineHeight: 1.5 }}>
                  Your agent is not broken. Your memory evaluation process is.
                </p>
                <p style={{ color: G.mut, fontSize: 13, lineHeight: 1.7, margin: '0 0 12px' }}>
                  You shipped an agent that looked strong in internal demos, then production behavior drifted. It forgets key user preferences in one flow, resurrects stale context in another, and occasionally pulls irrelevant history into critical decisions.
                </p>
                <p style={{ color: G.mut, fontSize: 13, lineHeight: 1.7, margin: '0 0 12px' }}>
                  Teams usually react by swapping vector stores, tweaking chunking, or changing prompts. Weeks later, quality is still unstable.
                </p>
                <p style={{ color: G.mut, fontSize: 13, lineHeight: 1.7, margin: '0 0 20px' }}>
                  This is the real failure mode: no shared framework for evaluating memory systems under production constraints.
                </p>

                <div style={{ borderTop: `1px solid ${G.bdr}`, paddingTop: 16, marginBottom: 0 }}>
                  <div style={{ color: G.mut, fontSize: 9, fontWeight: 600, letterSpacing: '0.5px', marginBottom: 12 }}>
                    HOW THE STYLE RULES SHOW UP
                  </div>
                  {styleNotes.map(note => (
                    <div key={note.label} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 2, background: G.grn, borderRadius: 1, flexShrink: 0 }} />
                      <div>
                        <div style={{ color: G.wht, fontSize: 11, fontWeight: 600 }}>{note.label}</div>
                        <div style={{ color: G.mut, fontSize: 10, marginTop: 2 }}>{note.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action bar */}
              <div style={{
                background: '#030A04', padding: '10px 32px',
                display: 'flex', alignItems: 'center', borderTop: `1px solid ${G.bdr}`,
              }}>
                <span style={{ color: G.mut, fontSize: 10 }}>Draft v0.1</span>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{
                    background: G.gpb, border: 'none', borderRadius: 8, padding: '6px 16px',
                    color: G.grn, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>Copy</button>
                  <button style={{
                    background: G.dim, border: 'none', borderRadius: 8, padding: '6px 16px',
                    color: G.mut, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>Edit draft</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
