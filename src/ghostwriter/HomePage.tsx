import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import { Card } from '@leafygreen-ui/card'
import { H2, Body, Overline } from '@leafygreen-ui/typography'
import { palette } from '../tokens'

const examples = [
  {
    type: 'Blog Post',
    accentColor: palette.green.dark1,
    badgeVariant: 'green' as const,
    title: 'How to Evaluate a Memory Solution: Precision, Recall, and Cost at Scale',
    snippet: 'Your agent is not broken. Your memory evaluation process is. You shipped an agent that looked strong in demos, then production behavior drifted — it forgets key preferences one moment, resurrects stale context the next.',
    tags: ['AI Native', 'Developer Blog', '5 min read'],
  },
  {
    type: 'LinkedIn Thread',
    accentColor: palette.blue.base,
    badgeVariant: 'blue' as const,
    title: '5-post thread: The real failure mode in RAG systems',
    snippet: 'You shipped an agent system. It looked solid in demos. Then production behavior drifted. Your team blames the vector store. Or the chunking strategy. But the root cause is usually simpler.',
    tags: ['Engineering Leads', 'MOFU', '5 posts'],
  },
  {
    type: 'Email Sequence',
    accentColor: '#F97316',
    badgeVariant: 'yellow' as const,
    title: 'Why your memory evaluation is backwards (and how to fix it)',
    snippet: 'Your agent is behaving inconsistently in production. It forgets key preferences one moment, resurrects stale context the next. Before you swap infrastructure, check your evaluation framework.',
    tags: ['Engineering Leads', '2 emails', '7 days apart'],
  },
]

const howItWorks = [
  {
    num: '01',
    pill: 'INPUT',
    title: 'Curate your knowledge',
    desc: 'Select content sources — skill badges, docs, campaign briefs — and define your target audience and context.',
  },
  {
    num: '02',
    pill: 'PROCESS',
    title: 'Define your assets',
    desc: 'Choose output formats, apply the right style guide, and set tone. All configurable per campaign.',
  },
  {
    num: '03',
    pill: 'OUTPUT',
    title: 'Review and publish',
    desc: 'Receive draft content for every selected format. All assets go through human review before sharing.',
  },
]

export function HomePage({ onStart, onDashboard }: { onStart: () => void; onDashboard: () => void }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', fontFamily: "'Euclid Circular A', sans-serif" }}>

      {/* Hero */}
      <div style={{
        padding: '80px 48px 72px', textAlign: 'center',
        borderBottom: `1px solid ${palette.gray.light2}`,
        background: palette.gray.light3,
      }}>
        <div style={{
          background: palette.green.light3,
          display: 'inline-block',
          padding: '4px 14px', borderRadius: 20, marginBottom: 24,
          border: `1px solid ${palette.green.dark1}`,
        }}>
          <span style={{
            color: palette.green.dark2, fontSize: 11, fontWeight: 600,
            fontFamily: "'Euclid Circular A', sans-serif",
          }}>
            MongoDB Education · Content Platform
          </span>
        </div>
        <h1 style={{
          color: palette.black, fontSize: 48, fontWeight: 700,
          margin: '0 0 20px', lineHeight: 1.15,
          maxWidth: 680, marginLeft: 'auto', marginRight: 'auto',
          fontFamily: "'Euclid Circular A', sans-serif",
        }}>
          Your content knowledge,{' '}
          <span style={{ color: palette.green.dark2 }}>in every format.</span>
        </h1>
        <p style={{
          color: palette.gray.dark1, fontSize: 16, maxWidth: 560,
          margin: '0 auto 36px', lineHeight: 1.7,
        }}>
          Ghostwriter turns MongoDB's existing content into technically credible, on-brand assets — blogs, emails, LinkedIn posts — curated by you, reviewed by a human.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="primary" size="large" onClick={onStart}>
            Create New Package
          </Button>
          <Button variant="default" size="large" onClick={onDashboard}>
            View Dashboard
          </Button>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '64px 48px 0', maxWidth: 1100, margin: '0 auto' }}>
        <Overline style={{ display: 'block', textAlign: 'center', marginBottom: 12 }}>
          HOW IT WORKS
        </Overline>
        <H2 style={{ textAlign: 'center', marginBottom: 48 }}>
          Three steps from knowledge to asset
        </H2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
          {howItWorks.map((s, i) => (
            <div key={s.num} style={{
              padding: '32px 36px',
              borderRight: i < 2 ? `1px solid ${palette.gray.light2}` : 'none',
            }}>
              <div style={{
                color: palette.green.dark1, fontSize: 42, fontWeight: 700,
                marginBottom: 16, lineHeight: 1,
                fontFamily: "'Euclid Circular A', sans-serif",
              }}>
                {s.num}
              </div>
              <div style={{ marginBottom: 12 }}>
                <Badge variant="green">{s.pill}</Badge>
              </div>
              <div style={{
                color: palette.black, fontSize: 15, fontWeight: 600,
                marginBottom: 8, fontFamily: "'Euclid Circular A', sans-serif",
              }}>
                {s.title}
              </div>
              <Body style={{ color: palette.gray.dark1 }}>{s.desc}</Body>
            </div>
          ))}
        </div>
      </div>

      {/* Human review callout */}
      <div style={{ padding: '32px 48px 0', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          background: palette.gray.light3,
          border: `1px solid ${palette.gray.light2}`,
          borderLeft: `4px solid #F97316`,
          borderRadius: 8, padding: '16px 20px',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 16, lineHeight: '22px' }}>⏱</span>
          <div>
            <span style={{
              color: palette.black, fontSize: 13, fontWeight: 600,
              fontFamily: "'Euclid Circular A', sans-serif",
            }}>
              Human review required —{' '}
            </span>
            <span style={{ color: palette.gray.dark1, fontSize: 13 }}>
              All generated content is reviewed before it can be shared with customers. Review typically takes 1–2 business days. This is a feature, not a constraint.
            </span>
          </div>
        </div>
      </div>

      {/* Example outputs */}
      <div style={{ padding: '48px 48px 72px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ borderTop: `1px solid ${palette.gray.light2}`, paddingTop: 48 }}>
          <Overline style={{ display: 'block', marginBottom: 12 }}>EXAMPLE OUTPUTS</Overline>
          <H2 style={{ marginBottom: 24 }}>What Ghostwriter generates</H2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {examples.map(ex => (
              <Card key={ex.type} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: 4, background: ex.accentColor }} />
                <div style={{ padding: 20 }}>
                  <div style={{ marginBottom: 12 }}>
                    <Badge variant={ex.badgeVariant}>{ex.type}</Badge>
                  </div>
                  <div style={{
                    color: palette.black, fontSize: 13, fontWeight: 600,
                    marginBottom: 8, lineHeight: 1.4,
                    fontFamily: "'Euclid Circular A', sans-serif",
                  }}>
                    {ex.title}
                  </div>
                  <Body style={{ color: palette.gray.dark1, fontSize: 12, marginBottom: 16 }}>
                    {ex.snippet}
                  </Body>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                    {ex.tags.map(tag => (
                      <Badge key={tag} variant="lightgray">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
