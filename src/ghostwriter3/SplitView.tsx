import { useState, useEffect, useRef } from 'react'
import { Button }    from '@leafygreen-ui/button'
import { Badge }     from '@leafygreen-ui/badge'
import { Chip }      from '@leafygreen-ui/chip'
import { Card }      from '@leafygreen-ui/card'
import { TextInput } from '@leafygreen-ui/text-input'
import { Tabs, Tab } from '@leafygreen-ui/tabs'
import { Stepper, Step } from '@leafygreen-ui/stepper'
import { Banner } from '@leafygreen-ui/banner'
import { ParagraphSkeleton } from '@leafygreen-ui/skeleton-loader'
import { Label, Body, H2, Overline } from '@leafygreen-ui/typography'
import { palette }   from '../tokens'

// ─── Types ───────────────────────────────────────────────────────────────────

interface V3Form {
  campaignName:         string
  audience:             string
  outputTypes:          string[]
  tone:                 string
  contextFiles:         File[]
  includeVisual:        boolean
  visualPlacement:      'middle' | 'below-text' | 'top-right'
}

type GenStage = 'idle' | 'generating' | 'done'
type TabId    = 'blog' | 'linkedin' | 'email'

const defaultForm: V3Form = {
  campaignName:    '',
  audience:        '',
  outputTypes:     [],
  tone:            '',
  contextFiles:    [],
  includeVisual:   false,
  visualPlacement: 'middle',
}

const VISUAL_PLACEMENTS: { id: V3Form['visualPlacement']; label: string; desc: string }[] = [
  { id: 'top-right',  label: 'Top right',   desc: 'Below the title, floated right'  },
  { id: 'middle',     label: 'Middle',       desc: 'Centred between paragraphs'       },
  { id: 'below-text', label: 'Below text',   desc: 'After the body copy'              },
]

const ALL_TABS: TabId[] = ['blog', 'linkedin', 'email']

// ─── Config ──────────────────────────────────────────────────────────────────

const AUDIENCES = [
  { id: 'ai-native',   label: 'AI-Native Engineers',  desc: 'Production AI/ML teams' },
  { id: 'dev-general', label: 'Developer (General)',   desc: 'Full-stack & backend devs' },
  { id: 'exec',        label: 'Tech Executives',       desc: 'CTOs, VPs of Engineering' },
  { id: 'social',      label: 'Social Media',          desc: 'LinkedIn & Twitter audience' },
]

const FORMATS: {
  id: TabId; label: string; meta: string
  badge: 'green' | 'blue' | 'yellow'; accent: string
}[] = [
  { id: 'blog',     label: 'Blog Post',       meta: '~1,200 words', badge: 'green',  accent: palette.green.dark1 },
  { id: 'linkedin', label: 'LinkedIn Thread', meta: '5 posts',      badge: 'blue',   accent: palette.blue.base   },
  { id: 'email',    label: 'Email Sequence',  meta: '2 emails',     badge: 'yellow', accent: '#F97316'           },
]

const TONES = [
  { id: 'technical-peer', label: 'Technical peer',  desc: 'Peer-to-peer, assumes depth' },
  { id: 'educational',    label: 'Educational',     desc: 'Builds understanding step-by-step' },
  { id: 'executive',      label: 'Executive',       desc: 'Impact-focused, minimal jargon' },
  { id: 'social-casual',  label: 'Casual / social', desc: 'Hook-first, built for scrollers' },
]

// ─── Content helpers ──────────────────────────────────────────────────────────

function blogOpener(audience: string, tone: string): string {
  const m: Record<string, string> = {
    'ai-native|technical-peer':   'When we started building our RAG pipeline at scale, the first thing we broke was our own assumption about what "vector search" actually means in production. The index strategy that works in a demo is rarely the one that survives 10 million embeddings and three rounds of model retraining.',
    'ai-native|educational':      'Building a production RAG application? Here\'s everything you need to know — from index configuration to query optimization — before you hit scale. We\'ll start with the pieces most tutorials skip.',
    'ai-native|executive':        'AI-native teams are converging on a common architectural pattern: operational and vector workloads on a single platform. The teams moving fastest are the ones who stopped treating their vector database as a separate infrastructure concern.',
    'ai-native|social-casual':    'Okay real talk — if your vector database and your app database are on two separate invoices, you\'re doing more work than you need to. 👋 Here\'s how we collapsed them into one without losing anything.',
    'dev-general|technical-peer': 'Adding production-ready semantic search to your stack used to mean maintaining a separate vector database. With Atlas Vector Search, that operational cost disappears — your vectors live next to your documents, in the same cluster you\'re already running.',
    'dev-general|educational':    'Vector search sounds complex, but the core concept is straightforward: instead of matching keywords, you\'re matching meaning. Here\'s how to add it to your application in an afternoon — no new infrastructure required.',
    'dev-general|executive':      'For development teams looking to add AI capabilities without expanding infrastructure footprint, MongoDB Atlas Vector Search offers a clear path: same cluster, same SDK, same operational model.',
    'dev-general|social-casual':  'Hot take: your semantic search and your production database shouldn\'t be two separate services. One bill. One connection string. One less thing to scale independently. 🔥',
    'exec|technical-peer':        'Organizations deploying AI-native applications face a consistent infrastructure challenge: the tooling required for semantic retrieval at scale is operationally expensive when treated as a separate system.',
    'exec|executive':             'MongoDB Atlas unifies operational and AI workloads on a single platform — reducing the total cost of AI infrastructure while accelerating the developer velocity your teams need to ship.',
    'social|social-casual':       'Not gonna lie — I spent three weeks managing a separate vector database before I realized Atlas does this natively. Sharing the full setup so you don\'t repeat my mistake. 🫡',
  }
  return m[`${audience}|${tone}`] ?? 'Building modern AI applications requires a data platform that can evolve with your stack. MongoDB Atlas delivers the capabilities your team needs, without the operational overhead of managing separate systems.'
}

function linkedInOpener(audience: string, tone: string): string {
  const m: Record<string, string> = {
    'ai-native|technical-peer':   '🧵 Most RAG implementations I review are one ops incident away from a bad time. Here\'s the Atlas Vector Search setup that actually holds up in production — covering index strategy, embedding pipeline, and query tuning. (1/5)',
    'ai-native|social-casual':    '🧵 Real talk: if you\'re managing a separate vector DB for your AI app, you\'re paying the wrong tax. Here\'s what we switched to — and what we wish we\'d done sooner. Thread 👇',
    'dev-general|technical-peer': '🧵 Hot take: your vector search and your application database should be the same service. Here\'s why — and how Atlas makes it work in a real production setup.',
    'dev-general|educational':    '🧵 New to vector search? Here\'s a 5-post breakdown: from "what is an embedding" to a working RAG setup in MongoDB Atlas. No separate infrastructure required. (1/5)',
    'exec|executive':             '🧵 The AI infrastructure question every CTO is asking: should vector search be a separate system or part of your core data platform? Our answer, after 18 months: it should be core.',
    'social|social-casual':       '🧵 I asked 50 developers how they handle vector search in production. The answers were something. Here\'s what the fastest-moving teams do differently.',
  }
  return m[`${audience}|${tone}`] ?? '🧵 AI-native development is changing how we build software. Here\'s what MongoDB Atlas Vector Search makes possible — and how teams are shipping faster because of it.'
}

function emailOpener(audience: string, tone: string, name: string): string {
  const m: Record<string, string> = {
    'ai-native|technical-peer':   'Subject: The RAG architecture decision you\'ll regret later\n\nMost teams hit the same wall three months into their RAG pipeline: embedding drift, index rebuilds at 3am, and a vector database that scales on a completely different curve than everything else.',
    'ai-native|educational':      'Subject: Your first production RAG setup (the one that actually works)\n\nWe put together a step-by-step guide for going from "RAG demo" to "RAG in production" using Atlas Vector Search — no separate vector DB required.',
    'dev-general|technical-peer': 'Subject: Why your vector search is probably slower than it needs to be\n\nHere\'s something counterintuitive: popular standalone vector databases often add latency compared to running search co-located with your operational data.',
    'dev-general|educational':    'Subject: Add semantic search to your app this weekend\n\nVector search doesn\'t require a new database, a new team, or a new budget line. Here\'s the three-step Atlas setup that has your first query running in under an hour.',
    'exec|executive':             'Subject: One platform for your operational and AI workloads\n\nThe overhead of maintaining separate databases — one for your application, one for your AI features — compounds quickly as you scale.',
    'social|social-casual':       'Subject: The vector search setup I wish someone had sent me\n\nHonestly? I spent weeks spinning up a separate cluster before a coworker showed me Atlas handles this natively.',
  }
  return m[`${audience}|${tone}`] ?? `Subject: What ${name || 'AI-native development'} looks like at scale\n\nWe've been talking to development teams building AI-native applications, and the same infrastructure challenge keeps surfacing.`
}

// ─── Full generated content ───────────────────────────────────────────────────

const FULL_BLOG = `## Building Production RAG: What We Got Wrong (And How to Fix It)

When we started building our RAG pipeline at scale, the first thing we broke was our own assumption about what "vector search" actually means in production. The index strategy that works in a demo is rarely the one that survives 10 million embeddings and three rounds of model retraining.

This post covers the three decisions that will define your Atlas Vector Search deployment — and the failure mode that comes with getting each one wrong.

### 1. Index granularity isn't about performance, it's about accuracy

Most teams create one vector index per collection. That works until your documents are long enough that a single embedding loses the nuance at paragraph level. The fix is chunking — but chunking strategy is a product decision as much as an engineering one.

What we got wrong: We chunked at fixed character counts, which split sentences mid-thought. Semantic chunking by paragraph or logical section dramatically improved retrieval precision.

### 2. The embedding model you start with isn't the one you'll finish with

Model upgrades are a fact of life. Atlas lets you run multiple vector indexes on the same collection, which means you can test a new model in parallel before committing.

What we got wrong: We didn't design for model versioning. The migration cost us two weeks of engineering time.

### 3. Hybrid search beats pure vector search for most real-world queries

Pure vector search excels at semantic similarity. Full-text search excels at exact matches, named entities, and recent content. Atlas Search supports $vectorSearch combined with traditional query operators — and that combination is usually the right answer.

The result: Precision improved by 31% when we added a full-text filter to our vector queries for product-specific terms.

---

Ready to implement? The MongoDB Atlas Vector Search quickstart covers the index setup in under 20 minutes.`

const FULL_LINKEDIN = `Post 1 / 5
🧵 Most RAG implementations I review are one ops incident away from a bad time.

Here's the Atlas Vector Search setup that actually holds up in production — covering index strategy, embedding pipeline, and query tuning. Five posts. Real lessons.

---

Post 2 / 5
Chunking strategy is a product decision, not just an engineering one.

Fixed-size chunking is fast to implement. It's also the fastest way to get retrieval that feels "almost right" but never quite clicks for users.

Semantic chunking — splitting at paragraph or logical section boundaries — takes more work upfront and meaningfully improves precision. Do it before you have 10M embeddings to rebuild.

---

Post 3 / 5
The embedding model you start with isn't the one you'll finish with.

Model upgrades happen. Atlas lets you maintain multiple vector indexes on the same collection. Test a new model without touching production. Commit when you're confident.

This sounds minor — it saved us two weeks during our last model migration.

---

Post 4 / 5
Hybrid search > pure vector search for most real-world queries.

Vector search is excellent at semantic similarity. Full-text search is excellent at exact terms, named entities, and recent content.

Most production queries need both. $vectorSearch + traditional query operators in the same pipeline. Our precision improved 31% when we stopped treating these as competing approaches.

---

Post 5 / 5
The operational argument for keeping vectors and documents in the same cluster:

→ No sync lag between your document store and vector store
→ One connection string, one SDK, one monitoring dashboard
→ Transactional consistency on document + embedding updates

Two systems means two places for drift. MongoDB Atlas Vector Search.`

const FULL_EMAIL = `Email 1 of 2

Subject: The RAG architecture decision you'll regret later
Preview text: Most teams hit this wall at month three.

---

Most teams get three months into their RAG pipeline before they hit the wall: embedding drift, index rebuilds at 3am, and a vector database that scales on a completely different curve than everything else in the stack.

The teams who avoid this made one architectural decision early: they kept their vectors and their operational data in the same database.

Here's why that matters — and how Atlas Vector Search makes it practical.

The core problem with separate vector databases

When your embedding model updates (and it will), you need to rebuild your index. If your vectors live in a separate system from your documents, that rebuild requires coordinating two pipelines, two monitoring setups, and two places where things can go wrong.

With Atlas Vector Search, your vectors are indexes on your existing collections. Model update? Rebuild the index, not the architecture.

---

Email 2 of 2  (sent 7 days later)

Subject: The hybrid search pattern that improved our precision by 31%
Preview text: Pure vector search isn't always the right answer.

---

Last week I covered the operational case for keeping vectors and documents together. Today: the query pattern that took our retrieval from "pretty good" to "actually useful."

Pure vector search excels at semantic similarity. Full-text search excels at exact terms, brand names, and recent content. Most production RAG queries need both.

The Atlas approach: $vectorSearch combined with standard query operators in the same aggregation pipeline. One query. Both signal types. Measurably better results.`

// ─── Main component ───────────────────────────────────────────────────────────

export function SplitView({ onViewHistory, onSubmittedChange, onGenStageChange }: { onViewHistory?: () => void; onSubmittedChange?: (submitted: boolean) => void; onGenStageChange?: (stage: GenStage) => void }) {
  const [form, setForm]               = useState<V3Form>(defaultForm)
  const [genStage, setGenStage]       = useState<GenStage>('idle')
  const [progress, setProgress]       = useState(0)
  const [genItems, setGenItems]       = useState<string[]>([])
  const [activeTab, setActiveTab]     = useState<TabId>('blog')
  const [submitted, setSubmitted]     = useState(false)
  const [driveState, setDriveState]   = useState<'idle' | 'exporting' | 'done'>('idle')

  const setSubmittedAndNotify = (val: boolean) => {
    setSubmitted(val)
    onSubmittedChange?.(val)
  }

  useEffect(() => { onGenStageChange?.(genStage) }, [genStage]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleExportDrive = () => {
    setDriveState('exporting')
    setTimeout(() => setDriveState('done'), 1800)
  }

  const update = (patch: Partial<V3Form>) => setForm(prev => ({ ...prev, ...patch }))

  const toggleFormat = (id: TabId) => {
    update({
      outputTypes: form.outputTypes.includes(id)
        ? form.outputTypes.filter(t => t !== id)
        : [...form.outputTypes, id],
    })
  }

  const canGenerate = Boolean(form.audience && form.outputTypes.length && form.tone)

  const handleGenerate = () => {
    if (!canGenerate) return
    setGenStage('generating')
    setProgress(0)
    setGenItems([])
    setSubmittedAndNotify(false)
    setDriveState('idle')
    const first = FORMATS.find(f => form.outputTypes.includes(f.id))
    if (first) setActiveTab(first.id)
  }

  const handleReset = () => {
    setForm(defaultForm)
    setGenStage('idle')
    setProgress(0)
    setGenItems([])
    setSubmittedAndNotify(false)
    setDriveState('idle')
  }

  useEffect(() => {
    if (genStage !== 'generating') return
    const selectedLabels = FORMATS
      .filter(f => form.outputTypes.includes(f.id))
      .map(f => f.label)
    let p = 0
    const id = setInterval(() => {
      p += 6 + Math.random() * 10
      const done = Math.floor((Math.min(p, 99) / 100) * selectedLabels.length)
      setGenItems(selectedLabels.slice(0, done))
      setProgress(Math.min(p, 99))
      if (p >= 100) {
        clearInterval(id)
        setProgress(100)
        setGenItems(selectedLabels)
        setTimeout(() => setGenStage('done'), 300)
      }
    }, 160)
    return () => clearInterval(id)
  }, [genStage]) // eslint-disable-line react-hooks/exhaustive-deps

  const hasPreview     = Boolean(form.audience || form.tone || form.campaignName)
  const titleText      = form.campaignName || 'Your Campaign'
  // For the live preview, show the first selected format; fall back to blog
  const previewFmt     = FORMATS.find(f => form.outputTypes.includes(f.id)) ?? FORMATS[0]
  // For done tabs: only selected formats, with correct index
  const selectedFmts   = FORMATS.filter(f => form.outputTypes.includes(f.id))
  const missingFmts    = FORMATS.filter(f => !form.outputTypes.includes(f.id))
  const selectedTabIdx = Math.max(0, selectedFmts.findIndex(f => f.id === activeTab))

  // ── Idle live preview (no tabs) ───────────────────────────────────────────

  const renderIdlePreview = () => {
    const tabId = previewFmt.id

    if (!hasPreview) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 0', gap: 16, textAlign: 'center',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: palette.gray.light2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>
            ✦
          </div>
          <div>
            <Body style={{ fontWeight: 600, color: palette.black, marginBottom: 4 }}>
              Live preview
            </Body>
            <Body style={{ color: palette.gray.dark1 }}>
              Fill in the form on the left to see your content<br />preview update in real time.
            </Body>
          </div>
        </div>
      )
    }


    const visualPlaceholder = (
      <div style={{
        border: `1.5px dashed ${palette.gray.light1}`,
        borderRadius: 10, background: palette.gray.light3,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '28px 24px', marginBottom: 20,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          border: `1.5px dashed ${palette.gray.base}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: palette.gray.base, fontSize: 18,
        }}>
          🖼
        </div>
        <Body style={{ fontSize: 12, color: palette.gray.dark1, textAlign: 'center' } as React.CSSProperties}>
          Visual design placeholder
        </Body>
        <Body style={{ fontSize: 11, color: palette.gray.base, textAlign: 'center' } as React.CSSProperties}>
          Your final visual asset will be placed here after approval
        </Body>
      </div>
    )

    return (
      <>
        {/* Disclaimer banner */}
        <div style={{ marginBottom: 16 }}>
          {/* @ts-ignore */}
          <Banner variant="info">
            <strong>This is a live preview — not the final product.</strong>{' '}
            Your approved drafts, including any visual design, will be delivered once they pass the human review process.
          </Banner>
        </div>

        <Card style={{ padding: '36px 40px' }}>
          {/* Title row — top-right visual sits beside the title */}
          {form.includeVisual && form.visualPlacement === 'top-right' ? (
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
              <H2 style={{ flex: 1, marginBottom: 0 }}>
                {form.campaignName
                  ? tabId === 'blog'     ? `Building Production RAG: ${form.campaignName}`
                  : tabId === 'linkedin' ? `Thread: ${form.campaignName}`
                  :                        `Email Campaign: ${form.campaignName}`
                  : <span style={{ color: palette.gray.light1 }}>Package Name will appear here…</span>
                }
              </H2>
              <div style={{
                width: 140, flexShrink: 0,
                border: `1.5px dashed ${palette.gray.light1}`,
                borderRadius: 10, background: palette.gray.light3,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 6, padding: '16px 12px',
              }}>
                <span style={{ fontSize: 18, color: palette.gray.base }}>🖼</span>
                <Body style={{ fontSize: 10, color: palette.gray.dark1, textAlign: 'center' } as React.CSSProperties}>
                  Visual placeholder
                </Body>
              </div>
            </div>
          ) : (
            <H2 style={{ marginBottom: 10 }}>
              {form.campaignName
                ? tabId === 'blog'     ? `Building Production RAG: ${form.campaignName}`
                : tabId === 'linkedin' ? `Thread: ${form.campaignName}`
                :                        `Email Campaign: ${form.campaignName}`
                : <span style={{ color: palette.gray.light1 }}>Package Name will appear here…</span>
              }
            </H2>
          )}

          {(form.audience || form.tone) ? (
            <>
              <ParagraphSkeleton />

              {form.includeVisual && form.visualPlacement === 'middle' && visualPlaceholder}

              <div style={{ marginTop: 16 }}>
                <ParagraphSkeleton />
              </div>

              {form.includeVisual && form.visualPlacement === 'below-text' && visualPlaceholder}

            </>
          ) : (
            <>
              <Body style={{ color: palette.gray.light1, marginBottom: 20 }}>
                Select an audience and tone to preview your opening…
              </Body>
              <SkeletonLines dim />
            </>
          )}
        </Card>
      </>
    )
  }

  // ── Generating panel (no tabs) ────────────────────────────────────────────

  const renderGenerating = () => (
    <>
      <Overline style={{ display: 'block', marginBottom: 16, color: palette.gray.dark1 }}>
        Generating…
      </Overline>
      <Card style={{ padding: '36px 40px' }}>
      <H2 style={{ marginBottom: 24 }}>{titleText}</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {FORMATS.filter(f => form.outputTypes.includes(f.id)).map(f => {
          const done = genItems.includes(f.label)
          return (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                background: done ? palette.green.dark1 : palette.gray.light2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.3s',
              }}>
                {done && <span style={{ color: palette.white, fontSize: 9, fontWeight: 700 }}>✓</span>}
              </div>
              <Body style={{ color: done ? palette.black : palette.gray.dark1, transition: 'color 0.3s' }}>
                {f.label}
              </Body>
            </div>
          )
        })}
      </div>
      <div style={{ height: 4, borderRadius: 2, background: palette.gray.light2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2, background: palette.green.dark1,
          width: `${progress}%`, transition: 'width 0.16s ease-out',
        }} />
      </div>
    </Card>
    </>
  )

  // ── Done content per tab ──────────────────────────────────────────────────

  const doneCardRefs = useRef<Record<TabId, HTMLDivElement | null>>({ blog: null, linkedin: null, email: null })

  const handleDownloadPng = async (tabId: TabId) => {
    const node = doneCardRefs.current[tabId]
    if (!node) return
    const [html2canvas, { jsPDF }] = await Promise.all([
      import('html2canvas').then(m => m.default),
      import('jspdf'),
    ])

    const canvas = await html2canvas(node, { scale: 2, useCORS: true })

    // Draw DRAFT watermark on a fresh overlay canvas, then composite onto the original
    const w = canvas.width
    const h = canvas.height
    const overlay = document.createElement('canvas')
    overlay.width = w
    overlay.height = h
    const ctx = overlay.getContext('2d')!

    // Copy the html2canvas render
    ctx.drawImage(canvas, 0, 0)

    // Watermark
    const fontSize = Math.round(Math.min(w, h) * 0.18)
    ctx.save()
    ctx.translate(w / 2, h / 2)
    ctx.rotate(-Math.PI / 6)
    ctx.font = `bold ${fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.globalAlpha = 0.25
    ctx.strokeStyle = '#001E2B'
    ctx.lineWidth = fontSize * 0.04
    ctx.strokeText('DRAFT', 0, 0)
    ctx.fillStyle = '#001E2B'
    ctx.fillText('DRAFT', 0, 0)
    ctx.restore()

    // Export as PDF with margins so content doesn't touch the edges
    const imgData = overlay.toDataURL('image/png')
    const pxToMm = 0.2645833333
    const margin = 20 // mm
    const contentW = w * pxToMm
    const contentH = h * pxToMm
    const pageW = contentW + margin * 2
    const pageH = contentH + margin * 2
    const pdf = new jsPDF({ orientation: pageW > pageH ? 'landscape' : 'portrait', unit: 'mm', format: [pageW, pageH] })
    pdf.addImage(imgData, 'PNG', margin, margin, contentW, contentH)
    pdf.save(`${tabId}-draft-for-review.pdf`)
  }

  const renderDoneContent = (tabId: TabId) => {
    const fmt     = FORMATS.find(f => f.id === tabId)!
    const title   = tabId === 'blog'
      ? `Building Production RAG: ${titleText}`
      : tabId === 'linkedin'
      ? `LinkedIn Thread: ${titleText}`
      : `Email Sequence: ${titleText}`
    const fullText = tabId === 'blog' ? FULL_BLOG : tabId === 'linkedin' ? FULL_LINKEDIN : FULL_EMAIL

    // Split content at mid-paragraph for 'middle' placement
    const paragraphs  = fullText.split('\n\n')
    const mid         = Math.ceil(paragraphs.length / 2)
    const beforeText  = form.includeVisual && form.visualPlacement === 'middle'
      ? paragraphs.slice(0, mid).join('\n\n')
      : fullText
    const afterText   = form.includeVisual && form.visualPlacement === 'middle'
      ? paragraphs.slice(mid).join('\n\n')
      : null

    const visualBlock = (
      <div style={{
        border: `1.5px dashed ${palette.gray.light1}`,
        borderRadius: 10, background: palette.gray.light3,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 8, padding: '28px 24px', margin: '20px 0',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          border: `1.5px dashed ${palette.gray.base}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: palette.gray.base,
        }}>🖼</div>
        <Body style={{ fontSize: 12, color: palette.gray.dark1, textAlign: 'center' } as React.CSSProperties}>
          Visual design placeholder
        </Body>
        <Body style={{ fontSize: 11, color: palette.gray.base, textAlign: 'center' } as React.CSSProperties}>
          Final visual asset placed here after approval
        </Body>
      </div>
    )

    return (
      <>
        {/* Disclaimer banner */}
        <div style={{ marginBottom: 16 }}>
          {/* @ts-ignore */}
          <Banner variant="info">
            <strong>This is a draft — not the final product.</strong>{' '}
            Your approved content, including any visual design, will be delivered once it passes the human review process.
          </Banner>
        </div>

        <Card style={{ padding: '36px 40px' }}>
          <div ref={el => { doneCardRefs.current[tabId] = el }} style={{ background: palette.white }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              {/* @ts-ignore */}
              <Chip label={fmt.label} variant={fmt.badge} />
            </div>

            {/* Title — top-right visual sits beside title */}
            {form.includeVisual && form.visualPlacement === 'top-right' ? (
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
                <H2 style={{ flex: 1, marginBottom: 0 }}>{title}</H2>
                <div style={{
                  width: 140, flexShrink: 0,
                  border: `1.5px dashed ${palette.gray.light1}`,
                  borderRadius: 10, background: palette.gray.light3,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 6, padding: '16px 12px',
                }}>
                  <span style={{ fontSize: 18, color: palette.gray.base }}>🖼</span>
                  <Body style={{ fontSize: 10, color: palette.gray.dark1, textAlign: 'center' } as React.CSSProperties}>
                    Visual placeholder
                  </Body>
                </div>
              </div>
            ) : (
              <H2 style={{ marginBottom: 20 }}>{title}</H2>
            )}

            <Body style={{ lineHeight: 1.9, color: palette.gray.dark1, whiteSpace: 'pre-wrap' } as React.CSSProperties}>
              {beforeText}
            </Body>

            {form.includeVisual && form.visualPlacement === 'middle' && visualBlock}

            {afterText && (
              <Body style={{ lineHeight: 1.9, color: palette.gray.dark1, whiteSpace: 'pre-wrap' } as React.CSSProperties}>
                {afterText}
              </Body>
            )}

            {form.includeVisual && form.visualPlacement === 'below-text' && visualBlock}
          </div>
          {driveState === 'done' && (
            <div style={{ marginTop: 20 }}>
              {/* @ts-ignore */}
              <Banner variant="success">
                Successfully exported to Google Drive. Check your Drive for the file.
              </Banner>
            </div>
          )}
          <div style={{
            marginTop: 20, paddingTop: 20,
            borderTop: `1px solid ${palette.gray.light2}`,
            display: 'flex', gap: 10,
          }}>
            <Button variant="default" onClick={() => handleDownloadPng(tabId)}>
              Download for Review
            </Button>
            <Button
              variant="default"
              onClick={handleExportDrive}
              disabled={driveState === 'exporting' || driveState === 'done'}
            >
              {driveState === 'exporting' ? 'Exporting…' : driveState === 'done' ? 'Exported to Drive ✓' : 'Export to Google Drive'}
            </Button>
            <Button variant="primary" onClick={() => setSubmittedAndNotify(true)}>Mark for Review</Button>
          </div>
        </Card>
      </>
    )
  }

  // ── Post-submit confirmation panel ───────────────────────────────────────

  const renderSubmitted = () => {
    const audience = AUDIENCES.find(a => a.id === form.audience)
    const tone     = TONES.find(t => t.id === form.tone)


    return (
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <SummaryRow label="Package">
                <Body style={{ fontSize: 13 } as React.CSSProperties}>
                  {form.campaignName || <span style={{ color: palette.gray.dark1, fontStyle: 'italic' }}>Untitled</span>}
                </Body>
              </SummaryRow>
              <SummaryRow label="Formats">
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                  {/* @ts-ignore */}
                  {selectedFmts.map(f => <Chip key={f.id} label={f.label} variant={f.badge} />)}
                </div>
              </SummaryRow>
              {audience && (
                <SummaryRow label="Audience">
                  <Body style={{ fontSize: 13 } as React.CSSProperties}>{audience.label}</Body>
                </SummaryRow>
              )}
              {tone && (
                <SummaryRow label="Tone">
                  <Body style={{ fontSize: 13 } as React.CSSProperties}>{tone.label}</Body>
                </SummaryRow>
              )}
            </div>
          </Card>

          {/* Review timeline */}
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
                { label: 'Marked for review',  detail: 'Package is logged and your PDF is ready to send.', done: true  },
                { label: 'Submit to reviewer', detail: 'Share the downloaded PDF with your content reviewer outside Ghostwriter.', done: false },
                { label: 'Await decision',     detail: 'Your reviewer will approve, deny, or request changes.',                    done: false },
                { label: 'Record outcome',     detail: 'Return to Package History and mark the decision you received.',            done: false },
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
            <Button variant="default" onClick={() => { setGenStage('idle'); setSubmittedAndNotify(false) }}>
              Edit Draft
            </Button>
            <Button variant="default" onClick={handleReset}>
              Start New Package
            </Button>
          </div>

        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* Left panel: form */}
      <div style={{
        width: 360, borderRight: `1px solid ${palette.gray.light2}`,
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 0' }}>

          {/* Campaign name — TextInput */}
          <div style={{ marginBottom: 20 }}>
            <TextInput
              label="Package Name"
              value={form.campaignName}
              onChange={e => update({ campaignName: e.target.value })}
              placeholder="e.g. AI Native Developer Campaign — Q2 2026"
            />
          </div>

          {/* Audience */}
          <div style={{ marginBottom: 20 }}>
            <Label style={{ display: 'block', marginBottom: 4 }}>Target Audience</Label>
            <Body style={{ color: palette.gray.dark1, marginBottom: 10, fontSize: 12 } as React.CSSProperties}>
              Who is the primary audience?
            </Body>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {AUDIENCES.map(a => {
                const on = form.audience === a.id
                return (
                  <button key={a.id} onClick={() => update({ audience: on ? '' : a.id })} style={{
                    padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${on ? palette.green.dark1 : palette.gray.light2}`,
                    background: on ? palette.green.light3 : palette.white,
                    textAlign: 'left', fontFamily: "'Euclid Circular A', sans-serif",
                    transition: 'all 0.1s',
                  }}>
                    <Body style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, marginTop: 0, color: on ? palette.green.dark2 : palette.black } as React.CSSProperties}>{a.label}</Body>
                    <Body style={{ fontSize: 11, color: palette.gray.dark1, margin: 0 } as React.CSSProperties}>{a.desc}</Body>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Output formats */}
          <div style={{ marginBottom: 20 }}>
            <Label style={{ display: 'block', marginBottom: 4 }}>Output Formats</Label>
            <Body style={{ color: palette.gray.dark1, marginBottom: 10, fontSize: 12 } as React.CSSProperties}>
              Select all that apply.
            </Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {FORMATS.map(f => {
                const on = form.outputTypes.includes(f.id)
                return (
                  <button key={f.id} onClick={() => toggleFormat(f.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${on ? f.accent : palette.gray.light2}`,
                    borderLeft: `3px solid ${on ? f.accent : palette.gray.light2}`,
                    background: palette.white, textAlign: 'left',
                    fontFamily: "'Euclid Circular A', sans-serif", transition: 'all 0.1s',
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${on ? f.accent : palette.gray.light1}`,
                      background: on ? f.accent : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {on && <span style={{ color: palette.white, fontSize: 9, fontWeight: 700 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Body style={{ fontSize: 12, fontWeight: 600, color: palette.black, margin: 0 } as React.CSSProperties}>{f.label}</Body>
                    </div>
                    <Body style={{ fontSize: 11, color: palette.gray.dark1, margin: 0 } as React.CSSProperties}>{f.meta}</Body>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tone */}
          <div style={{ marginBottom: 20 }}>
            <Label style={{ display: 'block', marginBottom: 4 }}>Tone & Voice</Label>
            <Body style={{ color: palette.gray.dark1, marginBottom: 10, fontSize: 12 } as React.CSSProperties}>
              How should Ghostwriter write for your audience?
            </Body>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TONES.map(t => {
                const on = form.tone === t.id
                return (
                  <button key={t.id} onClick={() => update({ tone: on ? '' : t.id })} style={{
                    padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${on ? palette.green.dark1 : palette.gray.light2}`,
                    background: on ? palette.green.light3 : palette.white,
                    textAlign: 'left', fontFamily: "'Euclid Circular A', sans-serif",
                    transition: 'all 0.1s',
                  }}>
                    <Body style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, marginTop: 0, color: on ? palette.green.dark2 : palette.black } as React.CSSProperties}>{t.label}</Body>
                    <Body style={{ fontSize: 11, color: palette.gray.dark1, margin: 0 } as React.CSSProperties}>{t.desc}</Body>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Visual Design */}
          <div style={{ marginBottom: 20 }}>
            <Label style={{ display: 'block', marginBottom: 4 }}>Visual Design</Label>
            <Body style={{ color: palette.gray.dark1, marginBottom: 10, fontSize: 12 } as React.CSSProperties}>
              Include a visual asset in your content?
            </Body>
            <div style={{ display: 'flex', gap: 8, marginBottom: form.includeVisual ? 12 : 0 }}>
              {(['Yes', 'No'] as const).map(opt => {
                const on = opt === 'Yes' ? form.includeVisual : !form.includeVisual
                return (
                  <button
                    key={opt}
                    onClick={() => update({ includeVisual: opt === 'Yes' })}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${on ? palette.green.dark1 : palette.gray.light2}`,
                      background: on ? palette.green.light3 : palette.white,
                      fontSize: 12, fontWeight: 600,
                      color: on ? palette.green.dark2 : palette.gray.dark1,
                      fontFamily: "'Euclid Circular A', sans-serif", transition: 'all 0.1s',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {form.includeVisual && (
              <div>
                <Body style={{ color: palette.gray.dark1, marginBottom: 8, fontSize: 12 } as React.CSSProperties}>
                  Where should the visual appear?
                </Body>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {VISUAL_PLACEMENTS.map(p => {
                    const on = form.visualPlacement === p.id
                    return (
                      <button key={p.id} onClick={() => update({ visualPlacement: p.id })} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                        border: `1px solid ${on ? palette.green.dark1 : palette.gray.light2}`,
                        background: on ? palette.green.light3 : palette.white,
                        textAlign: 'left', fontFamily: "'Euclid Circular A', sans-serif",
                        transition: 'all 0.1s',
                      }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${on ? palette.green.dark1 : palette.gray.light1}`,
                          background: on ? palette.green.dark1 : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {on && <div style={{ width: 6, height: 6, borderRadius: '50%', background: palette.white }} />}
                        </div>
                        <div>
                          <Body style={{ fontSize: 12, fontWeight: 600, color: on ? palette.green.dark2 : palette.black, margin: 0 } as React.CSSProperties}>{p.label}</Body>
                          <Body style={{ fontSize: 11, color: palette.gray.dark1, margin: 0 } as React.CSSProperties}>{p.desc}</Body>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Additional Context — File Upload */}
          <div style={{ marginBottom: 24 }}>
            <Label style={{ display: 'block', marginBottom: 4 }}>Additional Context</Label>
            <Body style={{ color: palette.gray.dark1, marginBottom: 8, fontSize: 12 } as React.CSSProperties}>
              Upload files with angles, constraints, or examples to include.
            </Body>
            <input
              id="context-file-input"
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
              onClick={() => document.getElementById('context-file-input')?.click()}
              onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.background = palette.gray.light3 }}
              onDragLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              onDrop={e => {
                e.preventDefault();
                (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                const dropped = Array.from(e.dataTransfer.files)
                if (dropped.length) update({ contextFiles: [...form.contextFiles, ...dropped] })
              }}
              style={{
                border: `1.5px dashed ${palette.gray.light1}`,
                borderRadius: 6,
                padding: '20px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <Body style={{ color: palette.gray.dark1, fontSize: 13 } as React.CSSProperties}>
                Drop files here or <span style={{ color: palette.blue.base, textDecoration: 'underline' }}>browse</span>
              </Body>
              <Body style={{ color: palette.gray.base, fontSize: 11, marginTop: 4 } as React.CSSProperties}>
                PDF, DOCX, TXT, MD
              </Body>
            </div>
            {form.contextFiles.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {form.contextFiles.map((file, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 10px', borderRadius: 4,
                    background: palette.gray.light3,
                  }}>
                    <Body style={{ fontSize: 12, color: palette.black } as React.CSSProperties}>
                      {file.name}
                    </Body>
                    <Button
                      variant="default"
                      size="xsmall"
                      onClick={() => update({ contextFiles: form.contextFiles.filter((_, j) => j !== i) })}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Generate footer */}
        <div style={{
          padding: '16px 24px', borderTop: `1px solid ${palette.gray.light2}`, flexShrink: 0,
        }}>
          {submitted ? null : genStage !== 'done' ? (
            <>
              <Button
                variant="primary"
                disabled={!canGenerate || genStage === 'generating'}
                onClick={handleGenerate}
              >
                {genStage === 'generating' ? 'Generating…' : 'Generate Drafts →'}
              </Button>
              {!canGenerate && (
                <Body style={{
                  color: palette.gray.dark1, marginTop: 8,
                  fontSize: 11, textAlign: 'center',
                } as React.CSSProperties}>
                  Select audience, format, tone, and visual design to continue
                </Body>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, overflowY: 'auto', background: palette.gray.light3,
      }}>

        {/* Submitted confirmation */}
        {submitted && renderSubmitted()}

        {/* Idle: live preview, no tabs */}
        {!submitted && genStage === 'idle' && (
          <div style={{ padding: '28px 32px' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              {renderIdlePreview()}
            </div>
          </div>
        )}

        {/* Generating: progress panel, no tabs */}
        {!submitted && genStage === 'generating' && (
          <div style={{ padding: '28px 32px' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              {renderGenerating()}
            </div>
          </div>
        )}

        {/* Done: tabs filtered to selected formats only */}
        {!submitted && genStage === 'done' && (
          <>
            {missingFmts.length > 0 && (
              <div style={{
                padding: '10px 24px',
                background: palette.blue.light3,
                borderBottom: `1px solid ${palette.blue.light2}`,
                display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const,
              }}>
                <Body style={{ fontSize: 12, color: palette.blue.dark1 } as React.CSSProperties}>
                  Showing {selectedFmts.length} of 3 formats.
                </Body>
                <Body style={{ fontSize: 12, color: palette.gray.dark1 } as React.CSSProperties}>
                  To add {missingFmts.map(f => f.label).join(' or ')}, update your selections on the left.
                </Body>
              </div>
            )}
            {/* @ts-ignore */}
            <Tabs
              setSelected={(i: number) => setActiveTab(selectedFmts[i]?.id ?? activeTab)}
              selected={selectedTabIdx}
            >
              {selectedFmts.map(f => (
                // @ts-ignore
                <Tab key={f.id} name={f.label}>
                  <div style={{ padding: '28px 32px', background: palette.gray.light3 }}>
                    <div style={{ maxWidth: 720, margin: '0 auto' }}>
                      {renderDoneContent(f.id)}
                    </div>
                  </div>
                </Tab>
              ))}
            </Tabs>
          </>
        )}

      </div>

    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <Body style={{ fontSize: 12, color: palette.gray.dark1, width: 72, flexShrink: 0, paddingTop: 2, margin: 0 } as React.CSSProperties}>
        {label}
      </Body>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function SkeletonLines({ dim = false }: { dim?: boolean }) {
  const widths = ['92%', '78%', '88%', '65%', '82%', '55%']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
      {widths.map((w, i) => (
        <div key={i} style={{
          height: 12, borderRadius: 6,
          background: palette.gray.light2,
          width: w, opacity: dim ? 0.4 : 1,
        }} />
      ))}
    </div>
  )
}
