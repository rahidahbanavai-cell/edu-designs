import { useState, useEffect } from 'react'
import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import { Card } from '@leafygreen-ui/card'
import { H2, Body, Overline } from '@leafygreen-ui/typography'
import { palette } from '../tokens'
import type { PackageForm } from './GhostwriterApp'
import { StepHeader } from './StepHeader'

type DraftId = 'blog' | 'linkedin' | 'email'

type DraftData = {
  accentColor: string
  badgeVariant: 'green' | 'blue' | 'yellow'
  label: string
  title: string
  preview: string
  wordCount: string
  readTime: string
}

const allDrafts: Record<DraftId, DraftData> = {
  blog: {
    accentColor: palette.green.dark1,
    badgeVariant: 'green',
    label: 'BLOG POST',
    title: 'How to Evaluate a Memory Solution: Precision, Recall, and Cost at Scale',
    preview: `Your agent is not broken. Your memory evaluation process is.

You shipped an agent that looked strong in internal demos, then production behavior drifted. It forgets key user preferences in one flow, resurrects stale context in another, and occasionally pulls irrelevant history into critical decisions.

Teams usually react by swapping vector stores, tweaking chunking strategies, or rewriting prompts. Weeks later, quality is still unstable.

This is the real failure mode: there's no shared framework for evaluating memory systems under production constraints.

THE THREE METRICS THAT ACTUALLY MATTER

1. Precision — Does retrieved context belong in this response?
   Most teams optimize for recall alone. High recall with low precision means your agent is retrieving technically relevant context that's wrong for the current moment.

2. Recall — Is the right context available when needed?
   The underrated metric. Gaps in recall don't show up in benchmarks. They surface when a user references a preference from three conversations ago and the agent draws a blank.

3. Cost per query — What does "good memory" cost at production scale?
   A rubric that ignores cost creates brittle systems. The right memory architecture for 10 users per day is usually wrong for 10,000.

This rubric works regardless of your underlying stack.`,
    wordCount: '~1,200 words',
    readTime: '5 min read',
  },
  linkedin: {
    accentColor: palette.blue.base,
    badgeVariant: 'blue',
    label: 'LINKEDIN THREAD',
    title: '5-post thread: The real failure mode in production RAG systems',
    preview: `POST 1 — THE HOOK
You shipped an agent system. It looked solid in demos.

Then production behavior drifted.

It forgets key preferences one moment. Resurrects stale context the next.

Your team blamed the vector store. Or the chunking. Or the prompt.

The root cause was none of those. 🧵

---

POST 2 — THE PROBLEM
Most teams evaluate memory systems in isolation.

They benchmark recall in a clean test set, then ship.

But production memory has three failure modes that clean benchmarks miss:
→ Retrieved context that's technically relevant but contextually wrong
→ Preference gaps that surface weeks after onboarding
→ Cost curves that break down at scale

---

POST 3 — THE FRAMEWORK
Before you change any infrastructure, answer these three questions:

1. Precision: Does retrieved context *belong* in this specific response?
2. Recall: Is the right context *available* when needed?
3. Cost: What does good memory cost per query at your actual scale?

High recall + low precision = your agent sounds confused.
Low recall + high precision = your agent sounds forgetful.

---

POST 4 — THE INSIGHT
The rubric that fixes this isn't proprietary.

It works with any vector store, any embedding model, any retrieval strategy.

What matters is the evaluation *frame*, not the stack.

---

POST 5 — THE CTA
We wrote up the full framework with worked examples.

Link in comments. No form gate.`,
    wordCount: '~620 words',
    readTime: '5 posts',
  },
  email: {
    accentColor: '#F97316',
    badgeVariant: 'yellow',
    label: 'EMAIL SEQUENCE',
    title: '2-email drip: Why your memory evaluation is backwards',
    preview: `EMAIL 1 — Day 1
Subject: Why your memory evaluation is backwards (and how to fix it)

Hi [first name],

Your agent is behaving inconsistently in production. It forgets key preferences one moment, resurrects stale context the next.

Before you swap infrastructure, check your evaluation framework.

Most teams optimize for recall alone. High recall with low precision means your agent is retrieving technically relevant context that's wrong for the current moment.

The three metrics that matter before any architectural change:
→ Precision: Does retrieved context belong in this response?
→ Recall: Is the right context available when needed?
→ Cost: What does "good memory" cost per query at scale?

We wrote up the full framework with worked examples. It's stack-agnostic — works regardless of your current infrastructure.

[Read the evaluation framework →]

---

EMAIL 2 — Day 8
Subject: The most common mistake after fixing memory recall

Hi [first name],

Last week I shared the three-metric framework for evaluating agent memory.

The most common follow-up question: "We fixed recall. Why is precision still low?"

Short answer: recall and precision have different root causes.

Recall gaps usually come from missing context at write time.
Precision problems usually come from retrieval strategy — specifically, retrieving context that's relevant to the user but wrong for the current moment.

The fix isn't a better embedding model. It's a smarter retrieval filter.

Here's how three teams solved it at production scale: [link]`,
    wordCount: '~480 words',
    readTime: '2 emails · 7 days apart',
  },
}

const progressStages = ['Reading sources', 'Applying templates', 'Generating drafts']

export function WizardStep3({ form, onBack, onDone }: {
  form: PackageForm
  onBack: () => void
  onDone: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [generating, setGenerating] = useState(true)
  const [expanded, setExpanded] = useState<DraftId | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setGenerating(false), 500)
          return 100
        }
        return prev + 6
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const selectedDrafts = (Object.entries(allDrafts) as [DraftId, DraftData][]).filter(
    ([id]) => form.outputTypes.length === 0 || form.outputTypes.includes(id)
  )

  if (generating) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Euclid Circular A', sans-serif",
      }}>
        <StepHeader step={3} />
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 36, padding: '48px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <Overline style={{ display: 'block', marginBottom: 14 }}>GENERATING</Overline>
            <H2 style={{ marginBottom: 10 }}>Creating your content drafts…</H2>
            <Body style={{ color: palette.gray.dark1 }}>
              Applying templates, style guides, and campaign knowledge
            </Body>
          </div>

          {/* Progress bar */}
          <div style={{ width: 440 }}>
            <div style={{
              background: palette.gray.light2, borderRadius: 4, height: 8,
              overflow: 'hidden', marginBottom: 16,
            }}>
              <div style={{
                height: '100%', background: palette.green.dark1, borderRadius: 4,
                width: `${progress}%`, transition: 'width 0.1s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {progressStages.map((label, i) => (
                <span key={label} style={{
                  color: progress > i * 34 ? palette.green.dark2 : palette.gray.base,
                  fontSize: 11, fontWeight: progress > i * 34 ? 600 : 400,
                  fontFamily: "'Euclid Circular A', sans-serif",
                }}>
                  {progress > i * 34 ? '✓ ' : ''}{label}
                </span>
              ))}
            </div>
          </div>

          {/* Draft type indicators */}
          <div style={{ display: 'flex', gap: 10 }}>
            {selectedDrafts.map(([id, draft]) => (
              <div key={id} style={{
                background: palette.white, borderRadius: 8, padding: '10px 16px',
                border: `1px solid ${palette.gray.light2}`,
                display: 'flex', alignItems: 'center', gap: 8,
                opacity: 0.8,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: draft.accentColor }} />
                <span style={{ color: palette.gray.dark1, fontSize: 12, fontFamily: "'Euclid Circular A', sans-serif" }}>
                  {draft.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Euclid Circular A', sans-serif",
    }}>
      <StepHeader step={3} />

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px 100px' }}>
        <div style={{ width: '100%', maxWidth: 720 }}>

          <div style={{ marginBottom: 8 }}>
            <div style={{
              color: palette.green.dark2, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.5px', marginBottom: 8,
              fontFamily: "'Euclid Circular A', sans-serif",
            }}>
              STEP 3 · OUTPUT
            </div>
            <H2 style={{ marginBottom: 4 }}>Your content drafts</H2>
            <Body style={{ color: palette.gray.dark1, marginBottom: 20 }}>
              {selectedDrafts.length} draft{selectedDrafts.length !== 1 ? 's' : ''} generated for{' '}
              <strong>{form.campaignName || 'your campaign'}</strong>
            </Body>
          </div>

          {/* Review notice */}
          <div style={{
            background: '#FFFBF5',
            border: `1px solid #F9A649`,
            borderLeft: `4px solid #F97316`,
            borderRadius: 8, padding: '14px 18px',
            display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24,
          }}>
            <span style={{ fontSize: 16, lineHeight: '22px' }}>⏱</span>
            <div>
              <span style={{
                color: palette.black, fontSize: 13, fontWeight: 600,
                fontFamily: "'Euclid Circular A', sans-serif",
              }}>
                Pending human review —{' '}
              </span>
              <span style={{ color: palette.gray.dark1, fontSize: 13 }}>
                These drafts require review before sharing with customers. Typical turnaround: 1–2 business days.
              </span>
            </div>
          </div>

          {/* Draft cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {selectedDrafts.map(([id, draft]) => (
              <DraftCard
                key={id}
                id={id}
                draft={draft}
                isExpanded={expanded === id}
                onToggle={() => setExpanded(expanded === id ? null : id)}
              />
            ))}
          </div>

          {/* Submit confirmation */}
          {submitted && (
            <div style={{
              marginTop: 24,
              background: palette.green.light3,
              border: `1px solid ${palette.green.dark1}`,
              borderRadius: 8, padding: '16px 20px',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ color: palette.green.dark2, fontSize: 18 }}>✓</span>
              <div>
                <div style={{
                  color: palette.black, fontSize: 13, fontWeight: 600, marginBottom: 4,
                  fontFamily: "'Euclid Circular A', sans-serif",
                }}>
                  Submitted for review
                </div>
                <div style={{ color: palette.gray.dark1, fontSize: 12, lineHeight: 1.5 }}>
                  Your reviewer will be in touch within 1–2 business days. You'll receive a notification when drafts are approved and ready to share.
                </div>
                <div style={{ marginTop: 12 }}>
                  <Button variant="default" onClick={onDone}>
                    Go to Dashboard →
                  </Button>
                </div>
              </div>
            </div>
          )}

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
        <div style={{ flex: 1 }} />
        {!submitted ? (
          <Button variant="primary" onClick={() => setSubmitted(true)}>
            Submit for Review →
          </Button>
        ) : (
          <span style={{
            color: palette.green.dark2, fontSize: 13, fontWeight: 600,
            fontFamily: "'Euclid Circular A', sans-serif",
          }}>
            ✓ Submitted for review
          </span>
        )}
      </footer>
    </div>
  )
}

function DraftCard({ id, draft, isExpanded, onToggle }: {
  id: string
  draft: DraftData
  isExpanded: boolean
  onToggle: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(draft.preview).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 4, background: draft.accentColor, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          {/* Card header */}
          <button
            onClick={onToggle}
            style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
              textAlign: 'left' as const,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Badge variant={draft.badgeVariant}>{draft.label}</Badge>
                <Badge variant="yellow">Pending Review</Badge>
              </div>
              <div style={{
                color: palette.black, fontSize: 13, fontWeight: 600, lineHeight: 1.4,
                fontFamily: "'Euclid Circular A', sans-serif",
                marginBottom: 4,
              }}>
                {draft.title}
              </div>
              <div style={{ color: palette.gray.dark1, fontSize: 11 }}>
                {draft.wordCount} · {draft.readTime}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? palette.green.light3 : palette.gray.light3,
                  border: 'none', borderRadius: 6,
                  padding: '6px 12px',
                  color: copied ? palette.green.dark2 : palette.gray.dark1,
                  fontSize: 11, fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: "'Euclid Circular A', sans-serif",
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <span style={{ color: palette.gray.base, fontSize: 14 }}>{isExpanded ? '▲' : '▼'}</span>
            </div>
          </button>

          {/* Expanded content */}
          {isExpanded && (
            <div style={{
              borderTop: `1px solid ${palette.gray.light2}`,
              background: palette.gray.light3, padding: '20px 24px',
            }}>
              <pre style={{
                color: palette.black, fontSize: 13, lineHeight: 1.75,
                fontFamily: "'Euclid Circular A', sans-serif", margin: 0,
                whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word' as const,
              }}>
                {draft.preview}
              </pre>
              <div style={{
                marginTop: 16, padding: '10px 14px', background: palette.white,
                borderRadius: 6, border: `1px solid ${palette.gray.light2}`,
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <span style={{ fontSize: 13 }}>💡</span>
                <span style={{ color: palette.gray.dark1, fontSize: 12, lineHeight: 1.5 }}>
                  This is a preview excerpt. The full draft (including all sections) is available after review is complete.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
