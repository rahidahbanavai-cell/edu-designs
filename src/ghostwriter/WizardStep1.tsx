import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import TextInput from '@leafygreen-ui/text-input'
import { H2, Body, Label } from '@leafygreen-ui/typography'
import { palette } from '../tokens'
import type { PackageForm } from './GhostwriterApp'
import { StepHeader } from './StepHeader'

const availableSources = [
  {
    id: 'content',
    tag: 'KNOWLEDGE',
    file: 'content.md',
    title: 'Curated Knowledge Base',
    desc: 'Skill badges, MongoDB Book, official Docs, and SME insights. The primary technical foundation.',
  },
  {
    id: 'audience',
    tag: 'AUDIENCE CONTEXT',
    file: 'audience-and-tactics.md',
    title: 'Audience & Tactics',
    desc: 'AI Native segments, ICP definitions, channel tactics by funnel stage (TOFU / MOFU / BOFU).',
  },
  {
    id: 'brief',
    tag: 'STRATEGIC FRAME',
    file: 'campaign-brief-fy27.md',
    title: 'Campaign Brief FY27',
    desc: 'Campaign goals, content themes, phased rollout, and the core strategic shift.',
  },
]

const audiences = [
  { id: 'ai-native',  label: 'AI Native Founders & Engineers', desc: 'Production RAG / agent systems at scale' },
  { id: 'developer',  label: 'Developer (General)',             desc: 'MongoDB users building any app type' },
  { id: 'growth',     label: 'Growth & Revenue Marketing',      desc: 'Non-technical decision makers, demand gen' },
  { id: 'social',     label: 'Social Media Audience',           desc: 'LinkedIn, Twitter/X community following' },
]

export function WizardStep1({ form, updateForm, onNext }: {
  form: PackageForm
  updateForm: (u: Partial<PackageForm>) => void
  onNext: () => void
}) {
  const toggleSource = (id: string) => {
    updateForm({
      sources: form.sources.includes(id)
        ? form.sources.filter(s => s !== id)
        : [...form.sources, id],
    })
  }

  const canContinue = form.campaignName.trim().length > 0
    && form.sources.length > 0
    && form.audience.length > 0

  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Euclid Circular A', sans-serif",
    }}>
      <StepHeader step={1} />

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px 100px' }}>
        <div style={{ width: '100%', maxWidth: 720 }}>

          <div style={{ marginBottom: 8 }}>
            <div style={{
              color: palette.green.dark2, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.5px', marginBottom: 8,
              fontFamily: "'Euclid Circular A', sans-serif",
            }}>
              STEP 1 · INPUT
            </div>
            <H2 style={{ marginBottom: 4 }}>Define your scope</H2>
            <Body style={{ color: palette.gray.dark1, marginBottom: 32 }}>
              Tell Ghostwriter what you're working on and what knowledge it should draw from.
            </Body>
          </div>

          {/* Campaign name */}
          <div style={{ marginBottom: 32 }}>
            <TextInput
              label="Package name"
              placeholder="e.g. AI Native Developer Campaign — Q2 2026"
              value={form.campaignName}
              onChange={e => updateForm({ campaignName: e.target.value })}
            />
          </div>

          {/* Knowledge sources */}
          <div style={{ marginBottom: 32 }}>
            <Label style={{ display: 'block', marginBottom: 4 }}>Knowledge sources</Label>
            <Body style={{ color: palette.gray.dark1, marginBottom: 14, fontSize: 12 }}>
              Select the files that ground this package in real campaign signal. More sources = richer output.
            </Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {availableSources.map(src => {
                const selected = form.sources.includes(src.id)
                return (
                  <button
                    key={src.id}
                    onClick={() => toggleSource(src.id)}
                    style={{
                      background: selected ? palette.green.light3 : palette.white,
                      borderRadius: 8, display: 'flex', overflow: 'hidden',
                      border: `1px solid ${selected ? palette.green.dark1 : palette.gray.light2}`,
                      borderLeft: `4px solid ${selected ? palette.green.dark1 : palette.gray.light2}`,
                      cursor: 'pointer', textAlign: 'left' as const,
                      fontFamily: "'Euclid Circular A', sans-serif",
                      padding: 0,
                    }}
                  >
                    <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'stretch', flex: 1, gap: 20 }}>
                      <div style={{ minWidth: 150 }}>
                        <div style={{ marginBottom: 6 }}>
                          <Badge variant={selected ? 'green' : 'lightgray'}>{src.tag}</Badge>
                        </div>
                        <div style={{ color: palette.gray.dark1, fontSize: 11 }}>{src.file}</div>
                      </div>
                      <div style={{ width: 1, background: palette.gray.light2, flexShrink: 0 }} />
                      <div style={{ paddingLeft: 8 }}>
                        <div style={{
                          color: selected ? palette.black : palette.gray.dark1,
                          fontSize: 13, fontWeight: 600, marginBottom: 4,
                          fontFamily: "'Euclid Circular A', sans-serif",
                        }}>
                          {src.title}
                        </div>
                        <div style={{ color: palette.gray.dark1, fontSize: 12, lineHeight: 1.5 }}>{src.desc}</div>
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: selected ? palette.green.dark1 : 'transparent',
                        border: `2px solid ${selected ? palette.green.dark1 : palette.gray.light1}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {selected && (
                          <span style={{ color: palette.white, fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Audience */}
          <div style={{ marginBottom: 32 }}>
            <Label style={{ display: 'block', marginBottom: 4 }}>Target audience</Label>
            <Body style={{ color: palette.gray.dark1, marginBottom: 14, fontSize: 12 }}>
              Who will this content reach?
            </Body>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {audiences.map(aud => {
                const selected = form.audience === aud.id
                return (
                  <button
                    key={aud.id}
                    onClick={() => updateForm({ audience: aud.id })}
                    style={{
                      background: selected ? palette.green.light3 : palette.white,
                      border: `1px solid ${selected ? palette.green.dark1 : palette.gray.light2}`,
                      borderRadius: 8, padding: '14px 16px',
                      cursor: 'pointer', textAlign: 'left' as const,
                      fontFamily: "'Euclid Circular A', sans-serif",
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{
                        color: selected ? palette.black : palette.gray.dark1,
                        fontSize: 13, fontWeight: 600,
                        fontFamily: "'Euclid Circular A', sans-serif",
                      }}>
                        {aud.label}
                      </div>
                      {selected && (
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', background: palette.green.dark1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <span style={{ color: palette.white, fontSize: 10, fontWeight: 700 }}>✓</span>
                        </div>
                      )}
                    </div>
                    <div style={{ color: palette.gray.dark1, fontSize: 12, lineHeight: 1.4 }}>{aud.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </main>

      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: palette.white, borderTop: `1px solid ${palette.gray.light2}`,
        display: 'flex', alignItems: 'center', padding: '0 48px', height: 64,
      }}>
        <span style={{ color: palette.gray.dark1, fontSize: 12 }}>Step 1 of 3 — Define your sources</span>
        <div style={{ flex: 1 }} />
        <Button
          variant="primary"
          disabled={!canContinue}
          onClick={onNext}
        >
          Continue →
        </Button>
      </footer>
    </div>
  )
}
