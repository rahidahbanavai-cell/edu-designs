import { useState, useEffect, useRef } from 'react'
import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import { Card } from '@leafygreen-ui/card'
import TextInput from '@leafygreen-ui/text-input'
// @ts-ignore
import { Tabs, Tab } from '@leafygreen-ui/tabs'
import { H2, H3, Body, Overline } from '@leafygreen-ui/typography'
import { palette } from '../tokens'

// ─── Config ──────────────────────────────────────────────────────────────────

type Screen = 'name' | 'sources' | 'audience' | 'formats' | 'tone' | 'generating' | 'output'
const SCREENS: Screen[] = ['name', 'sources', 'audience', 'formats', 'tone', 'generating', 'output']
const QUESTION_COUNT = 5

const SOURCES = [
  { id: 'content',  tag: 'KNOWLEDGE',       tagVariant: 'green' as const, file: 'content.md',               title: 'Curated Knowledge Base',  desc: 'Skill badges, MongoDB Book, official Docs, and SME insights.' },
  { id: 'audience', tag: 'AUDIENCE CONTEXT', tagVariant: 'blue' as const,  file: 'audience-and-tactics.md', title: 'Audience & Tactics',       desc: 'AI Native segments, ICP definitions, channel tactics by funnel stage.' },
  { id: 'brief',    tag: 'STRATEGIC FRAME',  tagVariant: 'yellow' as const, file: 'campaign-brief-fy27.md',  title: 'Campaign Brief FY27',      desc: 'Campaign goals, content themes, phased rollout, and core strategic shift.' },
]

const AUDIENCES = [
  { id: 'ai-native',  label: 'AI-Native Engineers',       desc: 'Production RAG & agent systems at scale' },
  { id: 'developer',  label: 'Developer (General)',        desc: 'MongoDB users building any app type' },
  { id: 'growth',     label: 'Growth & Revenue Marketing', desc: 'Non-technical decision makers, demand gen' },
  { id: 'social',     label: 'Social Media Audience',      desc: 'LinkedIn, Twitter/X community' },
]

const FORMATS = [
  { id: 'blog',     label: 'Blog Post',       meta: '~1,200 words · 5 min read',     color: palette.green.dark1,  badge: 'green' as const  },
  { id: 'linkedin', label: 'LinkedIn Thread', meta: '5 posts · Engineering Leads',   color: palette.blue.base,    badge: 'blue' as const   },
  { id: 'email',    label: 'Email Sequence',  meta: '2 emails · 7-day cadence',      color: '#F97316',            badge: 'yellow' as const },
]

const TONES = [
  { id: 'technical-peer', label: 'Technical peer',  desc: 'Peer-to-peer, assumes deep domain expertise' },
  { id: 'educational',    label: 'Educational',     desc: 'Builds understanding step-by-step' },
  { id: 'executive',      label: 'Executive',       desc: 'High-level, business-impact focused' },
  { id: 'social-casual',  label: 'Casual / social', desc: 'Hook-first, built for scrollers' },
]

const GEN_TASKS = ['Reading knowledge sources', 'Applying templates & tone', 'Generating draft content']

// ─── Draft content ────────────────────────────────────────────────────────────

const FULL_BLOG = `Your agent is not broken. Your memory evaluation process is.

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

This rubric works regardless of your underlying stack.

WHY EXISTING BENCHMARKS FAIL

Most published memory benchmarks measure a single isolated retrieval. They don't measure whether retrieved context belongs in a specific multi-turn response. They don't measure session-to-session preference persistence. They don't measure cost under concurrent load.

Building your own evaluation loop is the only way to get signal on what matters in your system.

WHAT TO BUILD INSTEAD

Start with a small labeled dataset: 50 conversation excerpts where a human has marked which pieces of past context should (and shouldn't) appear in the model's response. Run your retrieval pipeline against it. Measure precision and recall. Instrument cost per call.

This is not a one-time audit. It's a continuous eval loop.

The teams that ship reliable agent memory don't have better infrastructure. They have better evaluation.`

const FULL_LINKEDIN = `POST 1 — THE HOOK
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

1. Precision: Does retrieved context belong in this specific response?
2. Recall: Is the right context available when needed?
3. Cost: What does good memory cost per query at your actual scale?

High recall + low precision = your agent sounds confused.
Low recall + high precision = your agent sounds forgetful.

---

POST 4 — THE INSIGHT
The rubric that fixes this isn't proprietary.

It works with any vector store, any embedding model, any retrieval strategy.

What matters is the evaluation frame, not the stack.

---

POST 5 — THE CTA
We wrote up the full framework with worked examples.

Link in comments. No form gate.`

const FULL_EMAIL = `EMAIL 1 — Day 1
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

Here's how three teams solved it at production scale: [link]`

// ─── Types ────────────────────────────────────────────────────────────────────

interface V4Form {
  name: string
  sources: string[]
  audience: string
  formats: string[]
  tone: string
}

// ─── FocusFlow ────────────────────────────────────────────────────────────────

export function FocusFlow() {
  const [screenIdx, setScreenIdx] = useState(0)
  const [animKey, setAnimKey]     = useState(0)
  const [form, setForm]           = useState<V4Form>({ name: '', sources: [], audience: '', formats: [], tone: '' })
  const [genProgress, setGenProgress] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const screen = SCREENS[screenIdx]
  const update = (patch: Partial<V4Form>) => setForm(prev => ({ ...prev, ...patch }))

  const advance = () => {
    setAnimKey(k => k + 1)
    setScreenIdx(i => i + 1)
  }

  const back = () => {
    setAnimKey(k => k + 1)
    setScreenIdx(i => Math.max(0, i - 1))
  }

  // Auto-focus name input
  useEffect(() => {
    if (screen === 'name') setTimeout(() => inputRef.current?.focus(), 80)
  }, [screen])

  // Run generation progress
  useEffect(() => {
    if (screen !== 'generating') return
    let p = 0
    setGenProgress(0)
    const id = setInterval(() => {
      p += 4 + Math.random() * 5
      if (p >= 100) {
        clearInterval(id)
        setGenProgress(100)
        setTimeout(() => advance(), 700)
      } else {
        setGenProgress(p)
      }
    }, 120)
    return () => clearInterval(id)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAudienceSelect = (id: string) => {
    update({ audience: id })
    setTimeout(() => advance(), 500)
  }

  const handleToneSelect = (id: string) => {
    update({ tone: id })
    setTimeout(() => advance(), 500)
  }

  const toggleSource = (id: string) => {
    update({ sources: form.sources.includes(id) ? form.sources.filter(s => s !== id) : [...form.sources, id] })
  }

  const toggleFormat = (id: string) => {
    update({ formats: form.formats.includes(id) ? form.formats.filter(f => f !== id) : [...form.formats, id] })
  }

  // Progress bar: 0–100 across screens 0–4
  const progressPct = screen === 'generating' || screen === 'output'
    ? 100
    : (screenIdx / (QUESTION_COUNT - 1)) * 100

  const stepLabel = screenIdx < QUESTION_COUNT
    ? `STEP ${screenIdx + 1} OF ${QUESTION_COUNT}`
    : null

  const isQuestionScreen = screenIdx < QUESTION_COUNT

  // ─── Render current screen ────────────────────────────────────────────────

  const renderScreen = () => {
    if (screen === 'name') {
      return (
        <ScreenWrap animKey={animKey}>
          {stepLabel && <StepLabel label={stepLabel} />}
          <H2 style={{ marginBottom: 10, textAlign: 'center' }}>
            What should we call this package?
          </H2>
          <Body style={{ color: palette.gray.dark1, marginBottom: 40, textAlign: 'center' } as React.CSSProperties}>
            Give your content package a name to get started.
          </Body>
          <div style={{ width: '100%', maxWidth: 480, marginBottom: 32 }}>
            <TextInput
              ref={inputRef}
              aria-label="Campaign name"
              placeholder="e.g. AI Native Developer Campaign — Q2 2026"
              value={form.name}
              onChange={e => update({ name: e.target.value })}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' && form.name.trim()) advance() }}
            />
          </div>
          <Button variant="primary" disabled={!form.name.trim()} onClick={advance}>
            Continue →
          </Button>
        </ScreenWrap>
      )
    }

    if (screen === 'sources') {
      return (
        <ScreenWrap animKey={animKey}>
          {stepLabel && <StepLabel label={stepLabel} />}
          <H2 style={{ marginBottom: 10, textAlign: 'center' }}>
            Which sources should Ghostwriter draw from?
          </H2>
          <Body style={{ color: palette.gray.dark1, marginBottom: 40, textAlign: 'center' } as React.CSSProperties}>
            Select all that apply. More sources produce richer, more grounded output.
          </Body>
          <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
            {SOURCES.map(src => {
              const on = form.sources.includes(src.id)
              return (
                <ToggleCard key={src.id} selected={on} onClick={() => toggleSource(src.id)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1 }}>
                    <div style={{ minWidth: 140 }}>
                      <Badge variant={on ? 'green' : 'lightgray'} style={{ marginBottom: 6, display: 'block' }}>
                        {src.tag}
                      </Badge>
                      <span style={{ fontSize: 11, color: palette.gray.dark1, fontFamily: 'inherit' }}>{src.file}</span>
                    </div>
                    <div style={{ width: 1, background: palette.gray.light2, alignSelf: 'stretch', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: on ? palette.black : palette.gray.dark1, marginBottom: 4, fontFamily: 'inherit' }}>
                        {src.title}
                      </div>
                      <div style={{ fontSize: 12, color: palette.gray.dark1, lineHeight: 1.5 }}>{src.desc}</div>
                    </div>
                  </div>
                  <CheckCircle checked={on} />
                </ToggleCard>
              )
            })}
          </div>
          <NavRow onBack={back} onContinue={advance} continueDisabled={!form.sources.length} />
        </ScreenWrap>
      )
    }

    if (screen === 'audience') {
      return (
        <ScreenWrap animKey={animKey}>
          {stepLabel && <StepLabel label={stepLabel} />}
          <H2 style={{ marginBottom: 10, textAlign: 'center' }}>Who are you writing for?</H2>
          <Body style={{ color: palette.gray.dark1, marginBottom: 40, textAlign: 'center' } as React.CSSProperties}>
            Select one — your choice shapes tone, depth, and channel.
          </Body>
          <div style={{ width: '100%', maxWidth: 520, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36 }}>
            {AUDIENCES.map(aud => {
              const on = form.audience === aud.id
              return (
                <ToggleCard key={aud.id} selected={on} onClick={() => handleAudienceSelect(aud.id)} minHeight={100}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: on ? palette.black : palette.gray.dark1, marginBottom: 6, fontFamily: 'inherit' }}>
                      {aud.label}
                    </div>
                    <div style={{ fontSize: 12, color: palette.gray.dark1, lineHeight: 1.4 }}>{aud.desc}</div>
                  </div>
                  <CheckCircle checked={on} />
                </ToggleCard>
              )
            })}
          </div>
          <NavRow onBack={back} onContinue={advance} continueDisabled={!form.audience} />
        </ScreenWrap>
      )
    }

    if (screen === 'formats') {
      return (
        <ScreenWrap animKey={animKey}>
          {stepLabel && <StepLabel label={stepLabel} />}
          <H2 style={{ marginBottom: 10, textAlign: 'center' }}>What do you need?</H2>
          <Body style={{ color: palette.gray.dark1, marginBottom: 40, textAlign: 'center' } as React.CSSProperties}>
            Select all that apply. Each format gets its own tailored draft.
          </Body>
          <div style={{ width: '100%', maxWidth: 560, display: 'flex', gap: 12, marginBottom: 36 }}>
            {FORMATS.map(fmt => {
              const on = form.formats.includes(fmt.id)
              return (
                <ToggleCard key={fmt.id} selected={on} onClick={() => toggleFormat(fmt.id)} vertical minHeight={130} flex>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', background: fmt.color,
                    marginBottom: 10, flexShrink: 0,
                  }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: on ? palette.black : palette.gray.dark1, marginBottom: 6, fontFamily: 'inherit' }}>
                    {fmt.label}
                  </div>
                  <div style={{ fontSize: 11, color: palette.gray.dark1, lineHeight: 1.4, marginBottom: 'auto' }}>{fmt.meta}</div>
                  <CheckCircle checked={on} style={{ marginTop: 12 }} />
                </ToggleCard>
              )
            })}
          </div>
          <NavRow onBack={back} onContinue={advance} continueDisabled={!form.formats.length} />
        </ScreenWrap>
      )
    }

    if (screen === 'tone') {
      return (
        <ScreenWrap animKey={animKey}>
          {stepLabel && <StepLabel label={stepLabel} />}
          <H2 style={{ marginBottom: 10, textAlign: 'center' }}>How should it sound?</H2>
          <Body style={{ color: palette.gray.dark1, marginBottom: 40, textAlign: 'center' } as React.CSSProperties}>
            Select one tone for all your drafts.
          </Body>
          <div style={{ width: '100%', maxWidth: 520, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36 }}>
            {TONES.map(t => {
              const on = form.tone === t.id
              return (
                <ToggleCard key={t.id} selected={on} onClick={() => handleToneSelect(t.id)} minHeight={90}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: on ? palette.black : palette.gray.dark1, marginBottom: 6, fontFamily: 'inherit' }}>
                      {t.label}
                    </div>
                    <div style={{ fontSize: 12, color: palette.gray.dark1, lineHeight: 1.4 }}>{t.desc}</div>
                  </div>
                  <CheckCircle checked={on} />
                </ToggleCard>
              )
            })}
          </div>
          <NavRow onBack={back} onContinue={advance} continueDisabled={!form.tone} />
        </ScreenWrap>
      )
    }

    if (screen === 'generating') {
      return (
        <ScreenWrap animKey={animKey}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Overline style={{ display: 'block', marginBottom: 14, color: palette.green.dark2 }}>GENERATING</Overline>
            <H2 style={{ marginBottom: 10 }}>Creating your package…</H2>
            <Body style={{ color: palette.gray.dark1 } as React.CSSProperties}>
              Grounding in sources · applying templates · writing drafts
            </Body>
          </div>

          <div style={{ width: '100%', maxWidth: 420 }}>
            <div style={{ height: 6, borderRadius: 3, background: palette.gray.light2, overflow: 'hidden', marginBottom: 28 }}>
              <div style={{
                height: '100%', borderRadius: 3, background: palette.green.dark1,
                width: `${genProgress}%`, transition: 'width 0.12s ease-out',
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {GEN_TASKS.map((task, i) => {
                const done = genProgress > (i + 1) * (100 / GEN_TASKS.length) - 2
                return (
                  <div key={task} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: done ? palette.green.dark1 : palette.gray.light2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.3s',
                    }}>
                      {done && <span style={{ color: palette.white, fontSize: 10, fontWeight: 700 }}>✓</span>}
                    </div>
                    <Body style={{
                      color: done ? palette.black : palette.gray.dark1,
                      transition: 'color 0.3s', fontWeight: done ? 500 : 400,
                    } as React.CSSProperties}>
                      {task}
                    </Body>
                  </div>
                )
              })}
            </div>
          </div>
        </ScreenWrap>
      )
    }

    if (screen === 'output') {
      const selectedFormats = FORMATS.filter(f =>
        form.formats.length === 0 || form.formats.includes(f.id)
      )
      const audience = AUDIENCES.find(a => a.id === form.audience)
      const tone = TONES.find(t => t.id === form.tone)
      const tabContents: Record<string, string> = { blog: FULL_BLOG, linkedin: FULL_LINKEDIN, email: FULL_EMAIL }

      return (
        <div style={{ width: '100%', maxWidth: 760, animation: 'gw4-in 0.35s ease-out forwards' }} key={animKey}>
          {/* Summary bar */}
          <div style={{
            background: palette.gray.light3, borderRadius: 8, padding: '12px 18px',
            display: 'flex', flexWrap: 'wrap' as const, gap: 8, alignItems: 'center', marginBottom: 28,
          }}>
            <Badge variant="green">{form.name || 'Untitled package'}</Badge>
            {audience && <Badge variant="blue">{audience.label}</Badge>}
            {selectedFormats.map(f => <Badge key={f.id} variant={f.badge}>{f.label}</Badge>)}
            {tone && <Badge variant="lightgray">{tone.label}</Badge>}
          </div>

          {/* Drafts */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <H3 style={{ margin: 0 }}>Your content drafts</H3>
              {!submitted && (
                <Button variant="primary" onClick={() => setSubmitted(true)}>
                  Submit for Review →
                </Button>
              )}
              {submitted && (
                <Badge variant="green">✓ Submitted for review</Badge>
              )}
            </div>

            {/* Review notice */}
            <div style={{
              background: '#FFFBF5', border: `1px solid #F9A649`,
              borderLeft: `4px solid #F97316`, borderRadius: 8,
              padding: '12px 16px', marginBottom: 20,
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 14, lineHeight: '20px' }}>⏱</span>
              <Body style={{ fontSize: 13, color: palette.gray.dark1 } as React.CSSProperties}>
                <strong style={{ color: palette.black }}>Pending human review — </strong>
                these drafts require review before sharing with customers. Typical turnaround: 1–2 business days.
              </Body>
            </div>

            {/* Tab content */}
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              {/* @ts-ignore */}
              <Tabs
                selected={activeTab}
                setSelected={setActiveTab}
                style={{ padding: '0 24px' }}
              >
                {selectedFormats.map((fmt, i) => (
                  // @ts-ignore
                  <Tab key={fmt.id} name={fmt.label}>
                    <div style={{ padding: '24px 24px 28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: fmt.color, flexShrink: 0 }} />
                        <Badge variant={fmt.badge}>{fmt.meta}</Badge>
                        <Badge variant="yellow">Pending Review</Badge>
                      </div>
                      <pre style={{
                        color: palette.black, fontSize: 13, lineHeight: 1.85,
                        fontFamily: "'Euclid Circular A', sans-serif",
                        whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word' as const,
                        margin: 0,
                      }}>
                        {tabContents[fmt.id]}
                      </pre>
                      <div style={{
                        marginTop: 20, padding: '10px 14px',
                        background: palette.gray.light3, borderRadius: 6,
                        border: `1px solid ${palette.gray.light2}`,
                      }}>
                        <Body style={{ fontSize: 12, color: palette.gray.dark1 } as React.CSSProperties}>
                          💡 This is a preview excerpt. The full reviewed draft will be available within 1–2 business days.
                        </Body>
                      </div>
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </Card>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', gap: 12, paddingBottom: 48 }}>
            <Button variant="default" onClick={() => {
              setAnimKey(k => k + 1)
              setScreenIdx(0)
              setForm({ name: '', sources: [], audience: '', formats: [], tone: '' })
              setSubmitted(false)
              setActiveTab(0)
            }}>
              ← Start over
            </Button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <>
      <style>{`
        @keyframes gw4-in {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Progress bar */}
      {isQuestionScreen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 4, zIndex: 30,
          background: palette.gray.light2,
        }}>
          <div style={{
            height: '100%', background: palette.green.dark1,
            width: `${progressPct}%`, transition: 'width 0.4s ease',
          }} />
        </div>
      )}

      {/* Centered content area */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: isQuestionScreen ? 'center' : 'flex-start',
        padding: isQuestionScreen ? '80px 32px 32px' : '96px 32px 32px',
        overflowY: 'auto',
      }}>
        {renderScreen()}
      </div>
    </>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ScreenWrap({ animKey, children }: { animKey: number; children: React.ReactNode }) {
  return (
    <div
      key={animKey}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: '100%', animation: 'gw4-in 0.35s ease-out forwards',
      }}
    >
      {children}
    </div>
  )
}

function StepLabel({ label }: { label: string }) {
  return (
    <Overline style={{
      display: 'block', marginBottom: 16, color: palette.green.dark2,
      letterSpacing: '0.8px',
    }}>
      {label}
    </Overline>
  )
}

function NavRow({ onBack, onContinue, continueDisabled }: {
  onBack: () => void
  onContinue: () => void
  continueDisabled?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button variant="default" onClick={onBack}>← Back</Button>
      <Button variant="primary" disabled={continueDisabled} onClick={onContinue}>Continue →</Button>
    </div>
  )
}

function CheckCircle({ checked, style }: { checked: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      background: checked ? palette.green.dark1 : 'transparent',
      border: `2px solid ${checked ? palette.green.dark1 : palette.gray.light1}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s', ...style,
    }}>
      {checked && <span style={{ color: palette.white, fontSize: 10, fontWeight: 700 }}>✓</span>}
    </div>
  )
}

function ToggleCard({ selected, onClick, children, minHeight, vertical, flex }: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  minHeight?: number
  vertical?: boolean
  flex?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? palette.green.light3 : palette.white,
        border: `1.5px solid ${selected ? palette.green.dark1 : palette.gray.light2}`,
        borderRadius: 10,
        padding: '14px 16px',
        cursor: 'pointer',
        textAlign: 'left' as const,
        fontFamily: "'Euclid Circular A', sans-serif",
        transition: 'all 0.14s',
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: vertical ? 'flex-start' : 'center',
        gap: 12,
        minHeight: minHeight ?? undefined,
        flex: flex ? '1' : undefined,
        boxShadow: selected ? `0 0 0 1px ${palette.green.dark1}` : 'none',
      }}
    >
      {children}
    </button>
  )
}
