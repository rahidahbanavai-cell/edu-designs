import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import { H2, Body, Label } from '@leafygreen-ui/typography'
import { palette } from '../tokens'
import type { PackageForm } from './GhostwriterApp'
import { StepHeader } from './StepHeader'

const outputFormats = [
  {
    id: 'blog',
    label: 'Blog Post',
    accentColor: palette.green.dark1,
    badgeVariant: 'green' as const,
    desc: 'Technical how-to post for a developer audience. ~1,200 words, 5-min read. Failure-mode opening, pain before solution.',
    tags: ['~1,200 words', '5 min read', 'Developer Blog'],
  },
  {
    id: 'linkedin',
    label: 'LinkedIn Thread',
    accentColor: palette.blue.base,
    badgeVariant: 'blue' as const,
    desc: '5-post thread for Engineering Leads. Hook → problem → resolution structure. MOFU positioning.',
    tags: ['5 posts', 'Engineering Leads', 'MOFU'],
  },
  {
    id: 'email',
    label: 'Email Sequence',
    accentColor: '#F97316',
    badgeVariant: 'yellow' as const,
    desc: 'Two-email drip, 7 days apart. Subject-line driven. Pain → proof → CTA structure for technical buyers.',
    tags: ['2 emails', '7 days apart', 'Engineering Leads'],
  },
]

const tones = [
  { id: 'technical-peer', label: 'Technical peer',  desc: 'Peer-to-peer, engineering-level language. Assumes deep expertise in the domain.' },
  { id: 'educational',    label: 'Educational',     desc: 'Clear explanations. Builds understanding step-by-step. Great for developer onboarding.' },
  { id: 'executive',      label: 'Executive',       desc: 'High-level, business-impact focused. Minimal technical jargon.' },
  { id: 'social',         label: 'Social / casual', desc: 'Conversational, shareable. Hook-first. Built for scrollers, not readers.' },
]

export function WizardStep2({ form, updateForm, onBack, onNext }: {
  form: PackageForm
  updateForm: (u: Partial<PackageForm>) => void
  onBack: () => void
  onNext: () => void
}) {
  const toggleOutput = (id: string) => {
    updateForm({
      outputTypes: form.outputTypes.includes(id)
        ? form.outputTypes.filter(t => t !== id)
        : [...form.outputTypes, id],
    })
  }

  const canContinue = form.outputTypes.length > 0 && form.tone.length > 0

  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Euclid Circular A', sans-serif",
    }}>
      <StepHeader step={2} />

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px 100px' }}>
        <div style={{ width: '100%', maxWidth: 720 }}>

          <div style={{ marginBottom: 8 }}>
            <div style={{
              color: palette.green.dark2, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.5px', marginBottom: 8,
              fontFamily: "'Euclid Circular A', sans-serif",
            }}>
              STEP 2 · PROCESS
            </div>
            <H2 style={{ marginBottom: 4 }}>Choose your assets</H2>
            <Body style={{ color: palette.gray.dark1, marginBottom: 32 }}>
              Select the format and voice for your content. Each output type uses a dedicated template.
            </Body>
          </div>

          {/* Output format selection */}
          <div style={{ marginBottom: 32 }}>
            <Label style={{ display: 'block', marginBottom: 4 }}>Output formats</Label>
            <Body style={{ color: palette.gray.dark1, marginBottom: 14, fontSize: 12 }}>
              Select one or more. Each format gets its own draft.
            </Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {outputFormats.map(ot => {
                const selected = form.outputTypes.includes(ot.id)
                return (
                  <button
                    key={ot.id}
                    onClick={() => toggleOutput(ot.id)}
                    style={{
                      background: selected ? '#F9FAFB' : palette.white,
                      border: `1px solid ${selected ? ot.accentColor : palette.gray.light2}`,
                      borderLeft: `4px solid ${selected ? ot.accentColor : palette.gray.light2}`,
                      borderRadius: 8, padding: '16px 20px',
                      display: 'flex', alignItems: 'center', gap: 16,
                      cursor: 'pointer', textAlign: 'left' as const,
                      fontFamily: "'Euclid Circular A', sans-serif",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Badge variant={ot.badgeVariant}>{ot.label}</Badge>
                        {selected && (
                          <Badge variant="green">SELECTED</Badge>
                        )}
                      </div>
                      <div style={{ color: palette.gray.dark1, fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>
                        {ot.desc}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                        {ot.tags.map(tag => (
                          <Badge key={tag} variant="lightgray">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: selected ? ot.accentColor : 'transparent',
                      border: `2px solid ${selected ? ot.accentColor : palette.gray.light1}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {selected && (
                        <span style={{ color: palette.white, fontSize: 12, fontWeight: 700 }}>✓</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tone */}
          <div style={{ marginBottom: 32 }}>
            <Label style={{ display: 'block', marginBottom: 4 }}>Tone & voice</Label>
            <Body style={{ color: palette.gray.dark1, marginBottom: 14, fontSize: 12 }}>
              How should Ghostwriter communicate with your audience?
            </Body>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {tones.map(t => {
                const selected = form.tone === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => updateForm({ tone: t.id })}
                    style={{
                      background: selected ? palette.green.light3 : palette.white,
                      border: `1px solid ${selected ? palette.green.dark1 : palette.gray.light2}`,
                      borderRadius: 8, padding: '14px 16px',
                      cursor: 'pointer', textAlign: 'left' as const,
                      fontFamily: "'Euclid Circular A', sans-serif",
                    }}
                  >
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', marginBottom: 4,
                    }}>
                      <span style={{
                        color: selected ? palette.black : palette.gray.dark1,
                        fontSize: 13, fontWeight: 600,
                        fontFamily: "'Euclid Circular A', sans-serif",
                      }}>
                        {t.label}
                      </span>
                      {selected && (
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', background: palette.green.dark1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <span style={{ color: palette.white, fontSize: 10, fontWeight: 700 }}>✓</span>
                        </div>
                      )}
                    </div>
                    <div style={{ color: palette.gray.dark1, fontSize: 12, lineHeight: 1.5 }}>{t.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Additional context */}
          <div style={{ marginBottom: 32 }}>
            <Label style={{ display: 'block', marginBottom: 4 }}>
              Additional context{' '}
              <span style={{ color: palette.gray.dark1, fontWeight: 400, fontSize: 12 }}>(optional)</span>
            </Label>
            <Body style={{ color: palette.gray.dark1, marginBottom: 12, fontSize: 12 }}>
              Specific angles, constraints, or focus areas for this package.
            </Body>
            <textarea
              value={form.additionalContext}
              onChange={e => updateForm({ additionalContext: e.target.value })}
              placeholder="e.g. Emphasize production RAG use cases. Avoid naming competitors. Target engineers who already understand vector search."
              rows={4}
              style={{
                width: '100%',
                background: palette.white,
                border: `1px solid ${palette.gray.light2}`,
                borderRadius: 6, padding: '12px 16px',
                color: palette.black, fontSize: 13,
                fontFamily: "'Euclid Circular A', sans-serif",
                outline: 'none', resize: 'vertical' as const,
                lineHeight: 1.6, boxSizing: 'border-box' as const,
              }}
            />
          </div>

        </div>
      </main>

      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: palette.white, borderTop: `1px solid ${palette.gray.light2}`,
        display: 'flex', alignItems: 'center', padding: '0 48px', height: 64, gap: 12,
      }}>
        <Button variant="default" onClick={onBack}>
          ← Back
        </Button>
        <Body style={{ color: palette.gray.dark1 }}>Step 2 of 3 — Choose your assets</Body>
        <div style={{ flex: 1 }} />
        <Button
          variant="primary"
          disabled={!canContinue}
          onClick={onNext}
        >
          Generate Drafts →
        </Button>
      </footer>
    </div>
  )
}
