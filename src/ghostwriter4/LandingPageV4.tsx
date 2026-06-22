import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import { Card } from '@leafygreen-ui/card'
import { H1, H2, H3, Body, Overline } from '@leafygreen-ui/typography'
import { palette } from '../tokens'

// ─── Stage data ───────────────────────────────────────────────────────────────

const STAGE_CARDS = [
  {
    id: 'draft',
    number: 1,
    label: 'Draft',
    badgeVariant: 'green' as const,
    accentColor: palette.green.dark1,
    circleColor: palette.green.dark2,   // darker for AA contrast (white text needs 4.5:1)
    circleTextColor: palette.white,
    bgColor: undefined,
    isException: false,
    involved: 'You + Ghostwriter AI',
    timeline: 'Generated instantly',
    whatHappening:
      'You configure your content brief in Ghostwriter — audience, tone, output formats, and any additional context. The AI analyzes your inputs against MongoDB\'s curated knowledge base, campaign briefs, and audience profiles to generate polished draft content for each selected output format.',
    yourAction:
      'Review the generated drafts in the preview pane. Once satisfied with the direction, submit the package for human review.',
  },
  {
    id: 'in-review',
    number: 2,
    label: 'In Review',
    badgeVariant: 'blue' as const,
    accentColor: palette.blue.dark1,
    circleColor: palette.blue.dark1,
    circleTextColor: palette.white,
    bgColor: undefined,
    isException: false,
    involved: 'MongoDB content reviewer',
    timeline: '1–2 business days',
    whatHappening:
      'A MongoDB content reviewer examines every draft for factual accuracy, brand voice alignment, and compliance with content guidelines. They verify that all technical claims are accurate, that messaging is consistent with MongoDB\'s positioning, and that the content is appropriate for the intended audience.',
    yourAction:
      'No action needed during this stage. You\'ll receive a notification when the review is complete. The reviewer will either approve the package or deny it.',
  },
  {
    id: 'denied',
    number: 3,
    label: 'Denied',
    badgeVariant: 'red' as const,
    accentColor: palette.red,
    circleColor: palette.red,
    circleTextColor: palette.white,
    bgColor: '#FFF3F1',
    isException: true,
    involved: 'MongoDB content reviewer',
    timeline: 'Package closed permanently',
    whatHappening:
      'The content cannot be approved in its current form. This typically occurs when content contains inaccurate product claims that would mislead customers, when content fundamentally violates brand standards, or when the content strategy is misaligned with campaign objectives in a way that cannot be addressed through revisions.',
    yourAction:
      'Review the denial reason provided by the reviewer. Start a new content package with a revised approach that directly addresses the core issues flagged. A denied package cannot be resubmitted — it is archived for reference.',
  },
  {
    id: 'approved',
    number: 4,
    label: 'Approved',
    badgeVariant: 'green' as const,
    accentColor: palette.green.dark2,
    circleColor: palette.green.dark2,
    circleTextColor: palette.white,
    bgColor: undefined,
    isException: false,
    involved: 'You',
    timeline: 'Immediately available',
    whatHappening:
      'The reviewer has confirmed the content is accurate, on-brand, and ready to share with your audience. All drafts in the package have passed review. The content is now cleared for distribution through your planned channels — no further steps required from the review process.',
    yourAction:
      'Download your approved drafts and distribute them through your planned channels. Keep approved packages for future reference — they provide a benchmark for content quality and messaging that the reviewer has validated.',
  },
]

// ─── LandingPageV4 ────────────────────────────────────────────────────────────

export function LandingPageV4({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <>
      <style>{`
        @keyframes bounce-arrow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
      `}</style>

      <div style={{ flex: 1, overflowY: 'auto', background: palette.white }}>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section style={{
          background: palette.black,
          padding: '48px 48px 32px',
          textAlign: 'center',
        }}>
          <Overline style={{
            display: 'block', marginBottom: 20,
            color: palette.green.dark1, letterSpacing: '2px',
          }}>
            GHOSTWRITER
          </Overline>
          <H1 style={{
            color: palette.white, lineHeight: 1.15,
            maxWidth: 640, margin: '0 auto 24px',
          }}>
            AI-powered content creation,<br />designed for scale.
          </H1>
          <Body style={{
            color: '#7FA3B3', maxWidth: 520, margin: '0 auto 32px',
            fontSize: 16, lineHeight: 1.75,
          } as React.CSSProperties}>
            Turn your campaign brief into polished, on-brand content — blog posts, email sequences, LinkedIn threads — reviewed by a human expert before it reaches your audience.
          </Body>

          {/* Hero CTA with animated scroll indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Button variant="primary" size="large" onClick={onGetStarted}>
              Start creating
            </Button>
          </div>
        </section>


        {/* ── Stage detail cards ───────────────────────────────────────────── */}
        <section style={{ padding: '48px 48px 80px', background: palette.white }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Overline style={{ display: 'block', marginBottom: 12, color: palette.green.dark2 }}>
              THE REVIEW PIPELINE
            </Overline>
            <H2 style={{ marginBottom: 16, color: palette.black }}>
              From brief to audience in four stages
            </H2>
            <Body style={{
              color: palette.gray.dark1, maxWidth: 560, margin: '0 auto', lineHeight: 1.7,
            } as React.CSSProperties}>
              Every piece of content follows a structured creation and review pipeline. Here's what happens at each stage — and what you need to do.
            </Body>
          </div>
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {STAGE_CARDS.map(stage => (
              <Card
                key={stage.id}
                style={{
                  borderLeft: `5px solid ${stage.accentColor}`,
                  background: stage.bgColor ?? palette.white,
                  padding: '28px 32px',
                }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  {/* Step number circle — no direct LG equivalent */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: stage.circleColor, color: stage.circleTextColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, fontFamily: "'Euclid Circular A', sans-serif",
                  }}>
                    {stage.number}
                  </div>
                  <H3 style={{ margin: 0, color: palette.black }}>{stage.label}</H3>
                  <Badge variant={stage.badgeVariant}>{stage.label}</Badge>
                  {stage.isException && (
                    <Badge variant="yellow">Conditional</Badge>
                  )}
                </div>

                {/* Card body */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <Overline style={{ display: 'block', marginBottom: 8 }}>
                      What's happening
                    </Overline>
                    <Body style={{ color: palette.gray.dark3, lineHeight: 1.7, fontSize: 13 } as React.CSSProperties}>
                      {stage.whatHappening}
                    </Body>
                  </div>
                  <div>
                    <Overline style={{ display: 'block', marginBottom: 8 }}>
                      Your action
                    </Overline>
                    <Body style={{ color: palette.gray.dark3, lineHeight: 1.7, fontSize: 13 } as React.CSSProperties}>
                      {stage.yourAction}
                    </Body>
                  </div>
                </div>

                {/* Card footer */}
                <div style={{
                  marginTop: 20, paddingTop: 16,
                  borderTop: `1px solid ${palette.gray.light2}`,
                  display: 'flex', gap: 32,
                }}>
                  <MetaRow label="Who's involved" value={stage.involved} />
                  <MetaRow label="Timeline" value={stage.timeline} />
                </div>
              </Card>
            ))}
          </div>
        </section>


      </div>
    </>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Overline style={{ display: 'block', marginBottom: 2 }}>{label}</Overline>
      <Body style={{ fontSize: 12, color: palette.gray.dark3 } as React.CSSProperties}>{value}</Body>
    </div>
  )
}
