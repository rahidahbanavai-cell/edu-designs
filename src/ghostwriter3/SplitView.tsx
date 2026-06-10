import { useState, useEffect } from 'react'
import { Button }    from '@leafygreen-ui/button'
import { Badge }     from '@leafygreen-ui/badge'
import { Card }      from '@leafygreen-ui/card'
import { TextInput } from '@leafygreen-ui/text-input'
import { TextArea }  from '@leafygreen-ui/text-area'
import { Tabs, Tab } from '@leafygreen-ui/tabs'
import { Label, Body, H2 } from '@leafygreen-ui/typography'
import { palette }   from '../tokens'

// ─── Types ───────────────────────────────────────────────────────────────────

interface V3Form {
  campaignName: string
  audience:     string
  outputTypes:  string[]
  tone:         string
  context:      string
}

type GenStage = 'idle' | 'generating' | 'done'
type TabId    = 'blog' | 'linkedin' | 'email'

const defaultForm: V3Form = {
  campaignName: '',
  audience:     '',
  outputTypes:  [],
  tone:         '',
  context:      '',
}

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

export function SplitView() {
  const [form, setForm]           = useState<V3Form>(defaultForm)
  const [genStage, setGenStage]   = useState<GenStage>('idle')
  const [progress, setProgress]   = useState(0)
  const [genItems, setGenItems]   = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<TabId>('blog')

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
    const first = FORMATS.find(f => form.outputTypes.includes(f.id))
    if (first) setActiveTab(first.id)
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

  const hasPreview = Boolean(form.audience || form.tone || form.campaignName)
  const titleText  = form.campaignName || 'Your Campaign'
  const tabIdx     = ALL_TABS.indexOf(activeTab)

  // ── Per-tab content renderer ──────────────────────────────────────────────

  const renderTabContent = (tabId: TabId) => {
    const fmt = FORMATS.find(f => f.id === tabId)!

    // Empty state
    if (genStage === 'idle' && !hasPreview) {
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

    // Generating animation (same across all tabs)
    if (genStage === 'generating') {
      return (
        <Card style={{ padding: '36px 40px' }}>
          <div style={{ marginBottom: 20 }}>
            <Badge variant="yellow">Generating</Badge>
          </div>
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
      )
    }

    // Partial live preview (idle + has some form data)
    if (genStage === 'idle') {
      return (
        <Card style={{ padding: '36px 40px' }}>
          <div style={{ marginBottom: 16 }}>
            <Badge variant={fmt.badge}>{fmt.label}</Badge>
          </div>
          <H2 style={{ marginBottom: 10 }}>
            {form.campaignName
              ? tabId === 'blog'     ? `Building Production RAG: ${form.campaignName}`
              : tabId === 'linkedin' ? `Thread: ${form.campaignName}`
              :                        `Email Campaign: ${form.campaignName}`
              : <span style={{ color: palette.gray.light1 }}>Campaign title will appear here…</span>
            }
          </H2>

          {(form.audience || form.tone) ? (
            <>
              <Body style={{ lineHeight: 1.8, marginBottom: 20, color: palette.gray.dark1 }}>
                {tabId === 'blog'
                  ? blogOpener(form.audience, form.tone)
                  : tabId === 'linkedin'
                  ? linkedInOpener(form.audience, form.tone)
                  : emailOpener(form.audience, form.tone, form.campaignName)
                }
              </Body>
              <SkeletonLines />
              <div style={{
                marginTop: 8, padding: '18px 20px', borderRadius: 8,
                background: palette.green.light3,
                border: `1px dashed ${palette.green.dark1}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}>
                <div>
                  <Body style={{ fontWeight: 600, color: palette.green.dark2, marginBottom: 2 }}>
                    Preview looks right?
                  </Body>
                  <Body style={{ color: palette.gray.dark1, fontSize: 12 } as React.CSSProperties}>
                    {canGenerate ? 'Generate the full draft now.' : 'Finish selecting options on the left.'}
                  </Body>
                </div>
                <Button variant="primary" disabled={!canGenerate} onClick={handleGenerate}>
                  Generate →
                </Button>
              </div>
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
      )
    }

    // Done — check if this format was generated
    const isSelected = form.outputTypes.includes(tabId)
    if (!isSelected) {
      return (
        <Card style={{ padding: '36px 40px', textAlign: 'center' }}>
          <Body style={{ color: palette.gray.dark1, marginBottom: 16 }}>
            This format wasn't included in your last generation.<br />
            Select it on the left and regenerate to include it.
          </Body>
          <Button variant="primary" onClick={handleGenerate} disabled={!canGenerate}>
            Regenerate with {fmt.label} →
          </Button>
        </Card>
      )
    }

    return (
      <Card style={{ padding: '36px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Badge variant={fmt.badge}>{fmt.label}</Badge>
          <Badge variant="green">Ready for review</Badge>
        </div>

        <H2 style={{ marginBottom: 20 }}>
          {tabId === 'blog'
            ? `Building Production RAG: ${titleText}`
            : tabId === 'linkedin'
            ? `LinkedIn Thread: ${titleText}`
            : `Email Sequence: ${titleText}`}
        </H2>

        <Body style={{
          lineHeight: 1.9, color: palette.gray.dark1,
          whiteSpace: 'pre-wrap',
        } as React.CSSProperties}>
          {tabId === 'blog'
            ? FULL_BLOG
            : tabId === 'linkedin'
            ? FULL_LINKEDIN
            : FULL_EMAIL}
        </Body>

        <div style={{
          marginTop: 32, paddingTop: 20,
          borderTop: `1px solid ${palette.gray.light2}`,
          display: 'flex', gap: 10,
        }}>
          <Button variant="default">Download draft</Button>
          <Button variant="primary">Submit for Review →</Button>
        </div>
      </Card>
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
              label="Campaign Name"
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
                    <div style={{
                      fontSize: 12, fontWeight: 600, marginBottom: 2,
                      color: on ? palette.green.dark2 : palette.black,
                    }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: palette.gray.dark1 }}>{a.desc}</div>
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
                      <span style={{ fontSize: 12, fontWeight: 600, color: palette.black }}>{f.label}</span>
                    </div>
                    <span style={{ fontSize: 11, color: palette.gray.dark1 }}>{f.meta}</span>
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
                    <div style={{
                      fontSize: 12, fontWeight: 600, marginBottom: 2,
                      color: on ? palette.green.dark2 : palette.black,
                    }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: palette.gray.dark1 }}>{t.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Context — TextArea */}
          <div style={{ marginBottom: 24 }}>
            <TextArea
              label="Additional Context"
              description="Specific angles, constraints, or examples to include."
              value={form.context}
              onChange={e => update({ context: e.target.value })}
              placeholder="e.g. Emphasize production RAG use cases. Avoid naming competitors."
            />
          </div>

        </div>

        {/* Generate footer */}
        <div style={{
          padding: '16px 24px', borderTop: `1px solid ${palette.gray.light2}`, flexShrink: 0,
        }}>
          {genStage === 'done' && (
            <div style={{ marginBottom: 8 }}>
              <Button
                variant="default"
                onClick={() => { setGenStage('idle'); setProgress(0) }}
              >
                ↺ Reset and regenerate
              </Button>
            </div>
          )}
          <Button
            variant="primary"
            disabled={!canGenerate || genStage === 'generating'}
            onClick={handleGenerate}
          >
            {genStage === 'generating'
              ? 'Generating…'
              : genStage === 'done'
              ? 'Regenerate Drafts'
              : 'Generate Drafts →'}
          </Button>
          {!canGenerate && (
            <Body style={{
              color: palette.gray.dark1, marginTop: 8,
              fontSize: 11, textAlign: 'center',
            } as React.CSSProperties}>
              Select audience, format, and tone to continue
            </Body>
          )}
        </div>
      </div>

      {/* Right panel: live preview with LG Tabs */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', background: palette.gray.light3,
      }}>
        {/* @ts-ignore */}
        <Tabs
          setSelected={(i: number) => setActiveTab(ALL_TABS[i] ?? activeTab)}
          selected={tabIdx < 0 ? 0 : tabIdx}
        >
          {FORMATS.map(f => (
            // @ts-ignore
            <Tab key={f.id} name={f.label}>
              <div style={{
                padding: '28px 32px', overflowY: 'auto',
                background: palette.gray.light3,
              }}>
                <div style={{ maxWidth: 720, margin: '0 auto' }}>
                  {renderTabContent(f.id)}
                </div>
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>

    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
