import { useState, useEffect, useRef } from 'react'
import { Button } from '@leafygreen-ui/button'
import { Card } from '@leafygreen-ui/card'
import TextInput from '@leafygreen-ui/text-input'
// @ts-ignore
import { Tabs, Tab } from '@leafygreen-ui/tabs'
import { H2, H3, Body, Overline } from '@leafygreen-ui/typography'
// @ts-ignore
import { Stepper, Step } from '@leafygreen-ui/stepper'
import Checkbox from '@leafygreen-ui/checkbox'
import Banner from '@leafygreen-ui/banner'
import { palette } from '../tokens'

// ─── Config ──────────────────────────────────────────────────────────────────

const AUDIENCES = [
  { id: 'ai-native',  label: 'AI-Native Engineers',       desc: 'Production RAG & agent systems at scale' },
  { id: 'developer',  label: 'Developer (General)',        desc: 'MongoDB users building any app type' },
  { id: 'growth',     label: 'Growth & Revenue Marketing', desc: 'Non-technical decision makers, demand gen' },
  { id: 'social',     label: 'Social Media Audience',      desc: 'LinkedIn, Twitter/X community' },
]

const FORMATS = [
  { id: 'blog',     label: 'Blog Post',       meta: '~1,200 words · 5 min read',     color: palette.green.dark1,  badge: 'green'  as const },
  { id: 'linkedin', label: 'LinkedIn Thread', meta: '5 posts · Engineering Leads',   color: palette.blue.base,    badge: 'blue'   as const },
  { id: 'email',    label: 'Email Sequence',  meta: '2 emails · 7-day cadence',      color: '#F97316',            badge: 'yellow' as const },
]

const TONES = [
  { id: 'technical-peer', label: 'Technical peer',  desc: 'Peer-to-peer, assumes deep domain expertise' },
  { id: 'educational',    label: 'Educational',     desc: 'Builds understanding step-by-step' },
  { id: 'executive',      label: 'Executive',       desc: 'High-level, business-impact focused' },
  { id: 'social-casual',  label: 'Casual / social', desc: 'Hook-first, built for scrollers' },
]

const GEN_TASKS = ['Reading knowledge sources', 'Applying templates & tone', 'Generating draft content']

const VISUAL_PLACEMENTS = [
  { id: 'middle'     as const, label: 'In the middle',  desc: 'Inserted between paragraphs at the midpoint of the content' },
  { id: 'below-text' as const, label: 'Below the text', desc: 'Appears after all written content' },
  { id: 'top-right'  as const, label: 'Top right',      desc: 'Floated to the right alongside the opening section' },
]

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
  audience: string
  formats: string[]
  tone: string
  includeVisual: boolean | null
  visualPlacement: '' | 'middle' | 'below-text' | 'top-right'
  contextFiles: File[]
}

const defaultForm: V4Form = { name: '', audience: '', formats: [], tone: '', includeVisual: null, visualPlacement: '', contextFiles: [] }

const FORM_STEPS = [
  { id: 'name'     as const, title: 'Name your package' },
  { id: 'audience' as const, title: 'Target audience' },
  { id: 'formats'  as const, title: 'Output formats' },
  { id: 'tone'     as const, title: 'Tone & voice' },
  { id: 'visual'   as const, title: 'Visual design' },
  { id: 'context'  as const, title: 'Additional context (optional)' },
]

type StepId = typeof FORM_STEPS[number]['id']

function stepIsValid(id: StepId, form: V4Form): boolean {
  if (id === 'name')     return form.name.trim().length > 0
  if (id === 'audience') return form.audience !== ''
  if (id === 'formats')  return form.formats.length > 0
  if (id === 'tone')     return form.tone !== ''
  if (id === 'visual') {
    if (form.includeVisual === null) return false
    if (!form.includeVisual) return true
    return form.visualPlacement !== ''
  }
  return true
}

function getStepSummary(id: StepId, form: V4Form): string {
  if (id === 'name')     return form.name || '—'
  if (id === 'audience') return AUDIENCES.find(a => a.id === form.audience)?.label ?? '—'
  if (id === 'formats') {
    const labels = FORMATS.filter(f => form.formats.includes(f.id)).map(f => f.label)
    return labels.length ? labels.join(', ') : '—'
  }
  if (id === 'tone') return TONES.find(t => t.id === form.tone)?.label ?? '—'
  if (id === 'visual') {
    if (form.includeVisual === null) return '—'
    if (!form.includeVisual) return 'No visual design'
    const labels: Record<string, string> = { 'middle': 'Middle', 'below-text': 'Below text', 'top-right': 'Top right' }
    return `Yes — ${labels[form.visualPlacement] ?? '—'}`
  }
  return form.contextFiles.length > 0 ? `${form.contextFiles.length} file${form.contextFiles.length !== 1 ? 's' : ''} uploaded` : 'Not provided'
}

// ─── FocusFlow ────────────────────────────────────────────────────────────────

export function FocusFlow({ onViewHistory }: { onViewHistory?: () => void } = {}) {
  const [phase, setPhase]                   = useState<'form' | 'generating' | 'output'>('form')
  const [activeStep, setActiveStep]         = useState(0)
  const [highestReached, setHighestReached] = useState(0)
  const [form, setForm]                     = useState<V4Form>(defaultForm)
  const [genProgress, setGenProgress]       = useState(0)
  const [submitted, setSubmitted]           = useState(false)
  const [activeTab, setActiveTab]           = useState(0)
  const [driveState, setDriveState]         = useState<'idle' | 'exporting' | 'done'>('idle')
  const stepRefs                            = useRef<(HTMLDivElement | null)[]>([])

  const update = (patch: Partial<V4Form>) => setForm(prev => ({ ...prev, ...patch }))

  const canGenerate = Boolean(form.name.trim() && form.audience && form.formats.length && form.tone)

  const advanceTo = (step: number) => {
    setActiveStep(step)
    setHighestReached(prev => Math.max(prev, step))
  }

  const handleContinue = () => advanceTo(activeStep + 1)

  const toggleFormat = (id: string) =>
    update({ formats: form.formats.includes(id) ? form.formats.filter(f => f !== id) : [...form.formats, id] })

  // Scroll active step into view
  useEffect(() => {
    if (phase !== 'form') return
    const el = stepRefs.current[activeStep]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [activeStep, phase])

  // Generation progress
  useEffect(() => {
    if (phase !== 'generating') return
    let p = 0
    setGenProgress(0)
    const id = setInterval(() => {
      p += 4 + Math.random() * 5
      if (p >= 100) {
        clearInterval(id)
        setGenProgress(100)
        setTimeout(() => setPhase('output'), 700)
      } else {
        setGenProgress(p)
      }
    }, 120)
    return () => clearInterval(id)
  }, [phase])

  // ─── Step content ─────────────────────────────────────────────────────────

  const renderStepContent = (id: StepId) => {
    if (id === 'name') {
      return (
        <TextInput
          aria-label="Package name"
          placeholder="e.g. AI Native Developer Campaign — Q2 2026"
          value={form.name}
          onChange={e => update({ name: e.target.value })}
          onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' && form.name.trim()) handleContinue() }}
        />
      )
    }

    if (id === 'audience') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {AUDIENCES.map(aud => {
            const on = form.audience === aud.id
            return (
              <ToggleCard key={aud.id} selected={on} onClick={() => update({ audience: aud.id })}>
                <div style={{ flex: 1 }}>
                  <Body style={{ fontWeight: 600, color: on ? palette.black : palette.gray.dark1, margin: '0 0 4px' } as React.CSSProperties}>
                    {aud.label}
                  </Body>
                  <Body style={{ fontSize: 12, color: palette.gray.dark1, lineHeight: 1.4, margin: 0 } as React.CSSProperties}>
                    {aud.desc}
                  </Body>
                </div>
              </ToggleCard>
            )
          })}
        </div>
      )
    }

    if (id === 'formats') {
      return (
        <div style={{ display: 'flex', gap: 10 }}>
          {FORMATS.map(fmt => {
            const on = form.formats.includes(fmt.id)
            return (
              <ToggleCard key={fmt.id} selected={on} onClick={() => toggleFormat(fmt.id)} vertical minHeight={120} flex>
                <Body style={{ fontWeight: 600, color: on ? palette.black : palette.gray.dark1, margin: '0 0 4px' } as React.CSSProperties}>
                  {fmt.label}
                </Body>
                <Body style={{ fontSize: 11, color: palette.gray.dark1, lineHeight: 1.4, marginBottom: 'auto', marginTop: 0, marginLeft: 0, marginRight: 0 } as React.CSSProperties}>
                  {fmt.meta}
                </Body>
                <div style={{ marginTop: 12, pointerEvents: 'none' }}>
                  <Checkbox checked={on} onChange={() => {}} label="" aria-label={fmt.label} />
                </div>
              </ToggleCard>
            )
          })}
        </div>
      )
    }

    if (id === 'tone') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {TONES.map(t => {
            const on = form.tone === t.id
            return (
              <ToggleCard key={t.id} selected={on} onClick={() => update({ tone: t.id })}>
                <div style={{ flex: 1 }}>
                  <Body style={{ fontWeight: 600, color: on ? palette.black : palette.gray.dark1, margin: '0 0 4px' } as React.CSSProperties}>
                    {t.label}
                  </Body>
                  <Body style={{ fontSize: 12, color: palette.gray.dark1, lineHeight: 1.4, margin: 0 } as React.CSSProperties}>
                    {t.desc}
                  </Body>
                </div>
              </ToggleCard>
            )
          })}
        </div>
      )
    }

    if (id === 'visual') {
      return (
        <div>
          <Body style={{ color: palette.gray.dark1, marginBottom: 12 } as React.CSSProperties}>
            Would you like to include a visual design element in your package?
          </Body>
          <div style={{ display: 'flex', gap: 10, marginBottom: form.includeVisual ? 24 : 0 }}>
            <ToggleCard selected={form.includeVisual === true} onClick={() => update({ includeVisual: true, visualPlacement: form.visualPlacement || 'middle' })}>
              <Body style={{ fontWeight: 600, color: form.includeVisual === true ? palette.black : palette.gray.dark1, margin: 0 } as React.CSSProperties}>Yes</Body>
            </ToggleCard>
            <ToggleCard selected={form.includeVisual === false} onClick={() => update({ includeVisual: false, visualPlacement: '' })}>
              <Body style={{ fontWeight: 600, color: form.includeVisual === false ? palette.black : palette.gray.dark1, margin: 0 } as React.CSSProperties}>No</Body>
            </ToggleCard>
          </div>

          {form.includeVisual && (
            <div>
              <Body style={{ color: palette.gray.dark1, marginBottom: 12 } as React.CSSProperties}>
                Where should the visual be placed?
              </Body>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {VISUAL_PLACEMENTS.map(p => {
                  const on = form.visualPlacement === p.id
                  return (
                    <ToggleCard key={p.id} selected={on} onClick={() => update({ visualPlacement: p.id })}>
                      <div style={{ flex: 1 }}>
                        <Body style={{ fontWeight: 600, color: on ? palette.black : palette.gray.dark1, margin: '0 0 4px' } as React.CSSProperties}>{p.label}</Body>
                        <Body style={{ fontSize: 12, color: palette.gray.dark1, lineHeight: 1.4, margin: 0 } as React.CSSProperties}>{p.desc}</Body>
                      </div>
                      <PlacementDiagram id={p.id} />
                    </ToggleCard>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )
    }

    if (id === 'context') {
      return (
        <div>
          <input
            id="gw4-context-file-input"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.md"
            style={{ display: 'none' }}
            onChange={e => {
              const newFiles = Array.from(e.target.files ?? [])
              if (newFiles.length) update({ contextFiles: [...form.contextFiles, ...newFiles] })
              e.target.value = ''
            }}
          />
          <div
            onClick={() => document.getElementById('gw4-context-file-input')?.click()}
            onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.background = '#F9FAFA' }}
            onDragLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
            onDrop={e => {
              e.preventDefault();
              (e.currentTarget as HTMLDivElement).style.background = 'transparent'
              const dropped = Array.from(e.dataTransfer.files)
              if (dropped.length) update({ contextFiles: [...form.contextFiles, ...dropped] })
            }}
            style={{
              border: `1.5px dashed ${palette.gray.light1}`,
              borderRadius: 8,
              padding: '28px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'transparent',
              transition: 'background 0.15s',
            }}
          >
            <Body style={{ color: palette.gray.dark1, fontSize: 14 } as React.CSSProperties}>
              Drop files here or <span style={{ color: palette.blue.base, textDecoration: 'underline' }}>browse</span>
            </Body>
            <Body style={{ color: palette.gray.base, fontSize: 12, marginTop: 6 } as React.CSSProperties}>
              PDF, DOCX, TXT, MD
            </Body>
          </div>
          {form.contextFiles.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {form.contextFiles.map((file, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: 6,
                  background: palette.gray.light3,
                  border: `1px solid ${palette.gray.light2}`,
                }}>
                  <Body style={{ fontSize: 13, color: palette.black } as React.CSSProperties}>
                    {file.name}
                  </Body>
                  <button
                    onClick={e => { e.stopPropagation(); update({ contextFiles: form.contextFiles.filter((_, j) => j !== i) }) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: palette.gray.dark1, fontSize: 16, lineHeight: 1, padding: '0 4px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  // ─── Generating phase ─────────────────────────────────────────────────────

  if (phase === 'generating') {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 32px',
      }}>
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
      </div>
    )
  }

  // ─── Tab content renderer (with optional visual placeholder) ─────────────

  const preStyle: React.CSSProperties = {
    color: palette.black, fontSize: 13, lineHeight: 1.85,
    fontFamily: "'Euclid Circular A', sans-serif",
    whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
  }

  const VisualBlock = () => (
    <div style={{
      background: palette.gray.light3, border: `2px dashed ${palette.gray.light1}`,
      borderRadius: 8, padding: '28px 16px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      margin: '16px 0',
    }}>
      <div style={{ fontSize: 24 }}>🖼</div>
      <Body style={{ color: palette.gray.dark1, fontWeight: 600, fontSize: 13 } as React.CSSProperties}>
        Visual Design Placeholder
      </Body>
      <Body style={{ color: palette.gray.base, fontSize: 11 } as React.CSSProperties}>
        Placement: {form.visualPlacement === 'middle' ? 'Middle' : form.visualPlacement === 'below-text' ? 'Below text' : 'Top right'} · Final asset delivered after approval
      </Body>
    </div>
  )

  const renderTabContent = (content: string) => {
    if (!form.includeVisual) return <pre style={preStyle}>{content}</pre>

    if (form.visualPlacement === 'below-text') {
      return <><pre style={preStyle}>{content}</pre><VisualBlock /></>
    }

    if (form.visualPlacement === 'top-right') {
      return (
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <pre style={{ ...preStyle, flex: 1 }}>{content}</pre>
          <div style={{ width: 190, flexShrink: 0 }}><VisualBlock /></div>
        </div>
      )
    }

    // middle: split at a paragraph boundary near 40%
    const mid = Math.floor(content.length * 0.4)
    const splitIdx = content.indexOf('\n\n', mid)
    const first  = splitIdx > 0 ? content.slice(0, splitIdx) : content.slice(0, mid)
    const second = splitIdx > 0 ? content.slice(splitIdx + 2) : content.slice(mid)
    return <><pre style={preStyle}>{first}</pre><VisualBlock /><pre style={preStyle}>{second}</pre></>
  }

  // ─── Output phase ─────────────────────────────────────────────────────────

  if (phase === 'output') {
    const selectedFormats = FORMATS.filter(f => form.formats.length === 0 || form.formats.includes(f.id))
    const audience = AUDIENCES.find(a => a.id === form.audience)
    const tone     = TONES.find(t => t.id === form.tone)
    const tabContents: Record<string, string> = { blog: FULL_BLOG, linkedin: FULL_LINKEDIN, email: FULL_EMAIL }

    // ── Confirmation page ──────────────────────────────────────────────────
    if (submitted) {
      return (
        <div style={{ flex: 1, overflowY: 'auto', background: palette.gray.light3 }}>
          <div style={{ padding: '48px 32px' }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>

              {/* Success mark */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36, textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: palette.green.dark1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <span style={{ color: palette.white, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>✓</span>
                </div>
                <H2 style={{ marginBottom: 6 }}>Marked for Review</H2>
                <Body style={{ color: palette.gray.dark1 } as React.CSSProperties}>
                  Submit your downloaded PDF to your reviewer. Once you receive their decision, return here to record it in Package History.
                </Body>
              </div>

              {/* Package summary */}
              <Card style={{ padding: '20px 24px', marginBottom: 20 }}>
                <Body style={{ fontWeight: 600, color: palette.black, marginBottom: 14 }}>Package summary</Body>
                {[
                  { label: 'Package',  value: form.name || 'Untitled package' },
                  ...(audience ? [{ label: 'Audience', value: audience.label }] : []),
                  { label: 'Formats',  value: selectedFormats.map(f => f.label).join(', ') },
                  ...(tone ? [{ label: 'Tone', value: tone.label }] : []),
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: palette.gray.dark1, width: 72, flexShrink: 0, fontFamily: "'Euclid Circular A', sans-serif" }}>
                      {row.label}
                    </span>
                    <Body style={{ fontSize: 13 } as React.CSSProperties}>{row.value}</Body>
                  </div>
                ))}
              </Card>

              {/* What happens next */}
              <Card style={{ padding: '20px 24px', marginBottom: 28 }}>
                <Body style={{ fontWeight: 600, color: palette.black, marginBottom: 18 }}>What happens next</Body>
                {/* @ts-ignore */}
                <Stepper currentStep={1}>
                  {/* @ts-ignore */}
                  <Step>Marked for review</Step>
                  {/* @ts-ignore */}
                  <Step>Submit to reviewer</Step>
                  {/* @ts-ignore */}
                  <Step>Await decision</Step>
                  {/* @ts-ignore */}
                  <Step>Record outcome</Step>
                </Stepper>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Marked for review',  detail: 'Package is logged and your PDF is ready to send.',                         done: true  },
                    { label: 'Submit to reviewer', detail: 'Share the downloaded PDF with your content reviewer outside Ghostwriter.',  done: false },
                    { label: 'Await decision',     detail: 'Your reviewer will approve or deny the package.',                          done: false },
                    { label: 'Record outcome',     detail: 'Return to Package History and mark the decision you received.',             done: false },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                      <Body style={{ fontSize: 12, fontWeight: 600, color: s.done ? palette.black : palette.gray.dark1, whiteSpace: 'nowrap' as const } as React.CSSProperties}>
                        {s.label}:
                      </Body>
                      <Body style={{ fontSize: 12, color: palette.gray.dark1 } as React.CSSProperties}>
                        {s.detail}
                      </Body>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                {onViewHistory && (
                  <Button variant="primary" onClick={onViewHistory}>
                    Go to Package History
                  </Button>
                )}
                <Button variant="default" onClick={() => setSubmitted(false)}>
                  Edit Draft
                </Button>
              </div>

            </div>
          </div>
        </div>
      )
    }

    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '80px 32px 48px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 16, left: 32 }}>
          <Button variant="default" onClick={() => {
            setPhase('form')
            setActiveStep(0)
            setHighestReached(0)
            setForm(defaultForm)
            setSubmitted(false)
            setActiveTab(0)
            setDriveState('idle')
          }}>
            ← Start over
          </Button>
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Live preview banner */}
          <Banner variant="info" style={{ marginBottom: 24 }}>
            <strong>This is a live preview</strong> — not the final product. Your approved drafts, including any visual design, will be delivered once they pass the human review process.
          </Banner>

          {/* Summary */}
          <div style={{
            background: palette.gray.light3, borderRadius: 8, padding: '14px 20px',
            display: 'flex', flexWrap: 'wrap' as const, gap: 0, alignItems: 'stretch', justifyContent: 'center', marginBottom: 28,
          }}>
            {[
              { label: 'Package', value: form.name || 'Untitled package' },
              ...(audience ? [{ label: 'Audience', value: audience.label }] : []),
              { label: 'Formats', value: selectedFormats.map(f => f.label).join(', ') },
              ...(tone ? [{ label: 'Tone', value: tone.label }] : []),
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', flexDirection: 'column' as const, gap: 3,
                paddingRight: i < arr.length - 1 ? 20 : 0,
                marginRight: i < arr.length - 1 ? 20 : 0,
                borderRight: i < arr.length - 1 ? `1px solid ${palette.gray.light1}` : 'none',
              }}>
                <Overline style={{ display: 'block', color: palette.gray.dark1, fontWeight: 700 } as React.CSSProperties}>{item.label}</Overline>
                <Body style={{ color: palette.black, fontWeight: 500, margin: 0 } as React.CSSProperties}>{item.value}</Body>
              </div>
            ))}
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <H3 style={{ margin: 0 }}>Your content drafts</H3>
            {submitted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: palette.green.dark1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ color: palette.white, fontSize: 10, fontWeight: 700 }}>✓</span>
                </div>
                <Body style={{ color: palette.green.dark2, fontWeight: 600, margin: 0 } as React.CSSProperties}>
                  Submitted for review
                </Body>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {/* @ts-ignore */}
            <Tabs selected={activeTab} setSelected={setActiveTab} style={{ padding: '0 24px' }}>
              {selectedFormats.map(fmt => (
                // @ts-ignore
                <Tab key={fmt.id} name={fmt.label}>
                  <div style={{ padding: '24px 24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 16 }}>
                      <Overline style={{ color: palette.gray.dark2 }}>{fmt.meta}</Overline>
                    </div>
                    {renderTabContent(tabContents[fmt.id])}
                  </div>
                </Tab>
              ))}
            </Tabs>
          </Card>

          {/* Drive success banner */}
          {driveState === 'done' && (
            <div style={{ marginTop: 20 }}>
              {/* @ts-ignore */}
              <Banner variant="success">
                Successfully exported to Google Drive. Check your Drive for the file.
              </Banner>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button variant="default">Download for Review</Button>
            <Button
              variant="default"
              disabled={driveState !== 'idle'}
              onClick={() => {
                setDriveState('exporting')
                setTimeout(() => setDriveState('done'), 1800)
              }}
            >
              {driveState === 'exporting' ? 'Exporting…' : driveState === 'done' ? 'Exported ✓' : 'Export to Google Drive'}
            </Button>
            {!submitted && (
              <Button variant="primary" onClick={() => setSubmitted(true)}>Submit for Review →</Button>
            )}
          </div>

        </div>
      </div>
    )
  }

  // ─── Form phase ───────────────────────────────────────────────────────────

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: palette.white, position: 'relative' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '72px 24px 64px' }}>

        <div style={{ marginBottom: 32 }}>
          <H2 style={{ margin: '0 0 8px' }}>Create a content package</H2>
          <Body style={{ color: palette.gray.dark1 } as React.CSSProperties}>
            Complete each step to configure your package. You can go back and edit any step at any time.
          </Body>
        </div>

        {FORM_STEPS.map((step, i) => {
          const isActive    = i === activeStep
          const isCompleted = i <= highestReached && i !== activeStep
          const isLocked    = i > highestReached
          const isLastStep  = i === FORM_STEPS.length - 1

          return (
            <div key={step.id} ref={el => { stepRefs.current[i] = el }}>
              <StepCard
                stepNumber={i + 1}
                title={step.title}
                isActive={isActive}
                isCompleted={isCompleted}
                isLocked={isLocked}
                summary={getStepSummary(step.id, form)}
                onEdit={() => setActiveStep(i)}
              >
                {renderStepContent(step.id)}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                  <Button
                    variant="primary"
                    disabled={!stepIsValid(step.id, form)}
                    onClick={handleContinue}
                  >
                    {isLastStep ? 'All done →' : 'Continue →'}
                  </Button>
                </div>
              </StepCard>
            </div>
          )
        })}

        {/* Generate */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${palette.gray.light2}` }}>
          {!canGenerate && (
            <Body style={{ fontSize: 12, color: palette.gray.base, marginBottom: 12 } as React.CSSProperties}>
              Complete name, audience, formats, and tone to generate drafts.
            </Body>
          )}
          <Button
            variant="primary"
            disabled={!canGenerate}
            onClick={() => setPhase('generating')}
          >
            Generate Drafts →
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StepCard({ stepNumber, title, isActive, isCompleted, isLocked, summary, onEdit, children }: {
  stepNumber: number
  title: string
  isActive: boolean
  isCompleted: boolean
  isLocked: boolean
  summary?: string
  onEdit: () => void
  children?: React.ReactNode
}) {
  if (isLocked) {
    return (
      <div style={{
        marginBottom: 10, padding: '16px 20px', borderRadius: 10,
        border: `1px solid ${palette.gray.light2}`, background: palette.gray.light3,
        display: 'flex', alignItems: 'center', gap: 14, opacity: 0.55,
      }}>
        <StepCircle num={stepNumber} state="locked" />
        <Body style={{ color: palette.gray.dark1 } as React.CSSProperties}>{title}</Body>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div style={{
        marginBottom: 10, padding: '14px 20px', borderRadius: 10,
        border: `1px solid ${palette.green.dark1}`, background: palette.green.light3,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <StepCircle num={stepNumber} state="completed" />
        <div style={{ flex: 1 }}>
          <Overline style={{ display: 'block', color: palette.green.dark2, marginBottom: 2 }}>
            {title}
          </Overline>
          {summary && (
            <Body style={{ color: palette.black, margin: 0, fontSize: 13 } as React.CSSProperties}>
              {summary}
            </Body>
          )}
        </div>
        <Button variant="default" size="small" onClick={onEdit}>Edit</Button>
      </div>
    )
  }

  return (
    <Card style={{
      marginBottom: 10, borderRadius: 10, padding: 0,
      border: `1px solid ${palette.green.dark1}`,
      borderLeft: `4px solid ${palette.green.dark1}`,
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    }}>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <StepCircle num={stepNumber} state="active" />
        <Body style={{ fontWeight: 600, color: palette.black, margin: 0 } as React.CSSProperties}>{title}</Body>
      </div>
      <div style={{ padding: '0 24px 24px' }}>
        {children}
      </div>
    </Card>
  )
}

function StepCircle({ num, state }: { num: number; state: 'active' | 'completed' | 'locked' }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
      background: state === 'locked' ? palette.gray.light2 : palette.green.dark1,
      color: state === 'locked' ? palette.gray.dark1 : palette.white,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700, fontFamily: "'Euclid Circular A', sans-serif",
    }}>
      {state === 'completed' ? '✓' : num}
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

function PlacementDiagram({ id }: { id: 'middle' | 'below-text' | 'top-right' }) {
  const textLine = (width = '100%') => (
    <div style={{ height: 4, borderRadius: 2, background: '#C1C7C6', marginBottom: 3, width }} />
  )
  const imgBlock = (style?: React.CSSProperties) => (
    <div style={{
      borderRadius: 3, background: '#E8EDEB',
      border: '1px dashed #889397',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, color: '#5C6C75',
      ...style,
    }}>🖼</div>
  )

  const containerStyle: React.CSSProperties = {
    width: 72, height: 60, flexShrink: 0,
    background: '#F9FBFA', borderRadius: 6,
    border: '1px solid #E8EDEB',
    padding: 6, boxSizing: 'border-box',
  }

  if (id === 'middle') return (
    <div style={containerStyle}>
      {textLine()}{textLine('80%')}
      {imgBlock({ height: 18, marginBottom: 3 })}
      {textLine()}{textLine('70%')}
    </div>
  )

  if (id === 'below-text') return (
    <div style={containerStyle}>
      {textLine()}{textLine('80%')}{textLine()}{textLine('60%')}
      {imgBlock({ height: 16 })}
    </div>
  )

  // top-right
  return (
    <div style={{ ...containerStyle, display: 'flex', gap: 4 }}>
      <div style={{ flex: 1 }}>
        {textLine()}{textLine()}{textLine()}{textLine('80%')}
      </div>
      {imgBlock({ width: 24, height: '100%', flexShrink: 0 })}
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
        borderRadius: 10, padding: '14px 16px', cursor: 'pointer',
        textAlign: 'left' as const, fontFamily: "'Euclid Circular A', sans-serif",
        transition: 'all 0.14s', display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: vertical ? 'flex-start' : 'center',
        gap: 12, minHeight: minHeight ?? undefined,
        flex: flex ? '1' : undefined,
        boxShadow: selected ? `0 0 0 1px ${palette.green.dark1}` : 'none',
      }}
    >
      {children}
    </button>
  )
}
