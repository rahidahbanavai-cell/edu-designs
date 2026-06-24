import { useState, useEffect, useRef } from 'react'
import { Button }    from '@leafygreen-ui/button'
import { Badge }     from '@leafygreen-ui/badge'
// @ts-ignore
import { Chip }      from '@leafygreen-ui/chip'
import { Card }      from '@leafygreen-ui/card'
import { TextInput } from '@leafygreen-ui/text-input'
import { TextArea }  from '@leafygreen-ui/text-area'
import { Banner } from '@leafygreen-ui/banner'
import Icon from '@leafygreen-ui/icon'
import { ParagraphSkeleton } from '@leafygreen-ui/skeleton-loader'
import { Stepper, Step } from '@leafygreen-ui/stepper'
import { Label, Body, H2, Overline } from '@leafygreen-ui/typography'
import { palette }   from '../tokens'

// ─── Types ───────────────────────────────────────────────────────────────────

interface V5Form {
  campaignName: string
  prompt:       string
  contextFiles: File[]
}

type GenStage = 'idle' | 'generating' | 'done'
type TabId    = 'blog' | 'linkedin' | 'email'

const defaultForm: V5Form = {
  campaignName: '',
  prompt:       '',
  contextFiles: [],
}

// ─── Constants (same as GW3) ─────────────────────────────────────────────────

const AUDIENCES = [
  { id: 'ai-native',   label: 'AI-Native Engineers',  desc: 'Production AI/ML teams' },
  { id: 'dev-general', label: 'Developer (General)',   desc: 'Full-stack & backend devs' },
  { id: 'exec',        label: 'Tech Executives',       desc: 'CTOs, VPs of Engineering' },
  { id: 'social',      label: 'Social Media',          desc: 'LinkedIn & Twitter audience' },
]

const FORMATS: { id: TabId; label: string; meta: string; badge: 'green' | 'blue' | 'yellow'; accent: string }[] = [
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

Fixed-size chunking is fast to implement. Semantic chunking — splitting at paragraph or logical section boundaries — takes more work upfront and meaningfully improves precision.

---

Post 3 / 5
The embedding model you start with isn't the one you'll finish with.

Model upgrades happen. Atlas lets you maintain multiple vector indexes on the same collection. Test a new model without touching production. Commit when you're confident.

---

Post 4 / 5
Hybrid search > pure vector search for most real-world queries.

$vectorSearch + standard query operators in the same aggregation pipeline. One query. Both signal types. Measurably better results.

---

Post 5 / 5
The Atlas approach: $vectorSearch combined with standard query operators in the same aggregation pipeline. One query. Both signal types. Measurably better results.`

const FULL_EMAIL = `Email 1 of 2

Subject: The RAG architecture decision you'll regret later

Most teams hit the same wall three months into their RAG pipeline: embedding drift, index rebuilds at 3am, and a vector database that scales on a completely different curve than everything else.

The teams we see shipping the fastest have made one architectural decision differently: they're running Atlas Vector Search co-located with their operational data. Same cluster. Same SDK. One connection string.

Here's what that looks like in practice — and why it matters more than you'd think at your current scale.

[Read the full technical guide →]

---

Email 2 of 2

Subject: Quick follow-up: three things worth knowing about Atlas Vector Search

If you read our last email, here's the short version of what the fastest-moving teams are actually doing:

1. Semantic chunking at ingestion time, not fixed-size splits
2. Multiple vector indexes per collection for model versioning
3. Hybrid queries that combine $vectorSearch with standard operators

We've packaged these patterns into a quickstart. It covers the index setup, embedding pipeline, and your first hybrid query — in under 20 minutes.

[Start the quickstart →]`

// ─── Disabled section wrapper ─────────────────────────────────────────────────

function LockedSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Label style={{ display: 'block', marginBottom: 8, color: palette.gray.dark1 }}>{label}</Label>
      <div style={{ pointerEvents: 'none', opacity: 0.4, userSelect: 'none' }}>
        {children}
      </div>
    </div>
  )
}

// ─── SplitViewV5 ──────────────────────────────────────────────────────────────

export function SplitViewV5({ onViewHistory, onGenStageChange, onSubmittedChange, onStartNew }: {
  onViewHistory?: () => void
  onGenStageChange?: (stage: GenStage) => void
  onSubmittedChange?: (submitted: boolean) => void
  onStartNew?: () => void
}) {
  const [form, setForm]           = useState<V5Form>(defaultForm)
  const [genStage, setGenStage]     = useState<GenStage>('idle')
  const [progress, setProgress]     = useState(0)
  const [driveState, setDriveState] = useState<'idle' | 'exporting' | 'done'>('idle')
  const [submitted, setSubmitted]   = useState(false)

  const doneCardRef = useRef<HTMLDivElement | null>(null)

  const setSubmittedAndNotify = (val: boolean) => {
    setSubmitted(val)
    onSubmittedChange?.(val)
  }

  useEffect(() => { onGenStageChange?.(genStage) }, [genStage]) // eslint-disable-line react-hooks/exhaustive-deps

  const update = (patch: Partial<V5Form>) => setForm(prev => ({ ...prev, ...patch }))

  const canGenerate = Boolean(form.campaignName.trim())

  const handleGenerate = () => {
    if (!canGenerate) return
    setGenStage('generating')
    setProgress(0)
    setDriveState('idle')
    setSubmittedAndNotify(false)
  }

  const handleReset = () => {
    setForm(defaultForm)
    setGenStage('idle')
    setProgress(0)
    setDriveState('idle')
    setSubmittedAndNotify(false)
  }

  useEffect(() => {
    if (genStage !== 'generating') return
    let p = 0
    const id = setInterval(() => {
      p += 6 + Math.random() * 10
      setProgress(Math.min(p, 99))
      if (p >= 100) {
        clearInterval(id)
        setProgress(100)
        setTimeout(() => setGenStage('done'), 300)
      }
    }, 160)
    return () => clearInterval(id)
  }, [genStage]) // eslint-disable-line react-hooks/exhaustive-deps

  const titleText = form.campaignName || 'Your Package'

  // ── Download to PDF ─────────────────────────────────────────────────────────

  const handleDownloadPdf = async () => {
    const node = doneCardRef.current
    if (!node) return
    const [html2canvas, { jsPDF }] = await Promise.all([
      import('html2canvas').then(m => m.default),
      import('jspdf'),
    ])
    const canvas = await html2canvas(node, { scale: 2, useCORS: true })
    const w = canvas.width, h = canvas.height
    const overlay = document.createElement('canvas')
    overlay.width = w; overlay.height = h
    const ctx = overlay.getContext('2d')!
    ctx.drawImage(canvas, 0, 0)
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
    const imgData = overlay.toDataURL('image/png')
    const pxToMm = 0.2645833333
    const margin = 20
    const contentW = w * pxToMm, contentH = h * pxToMm
    const pageW = contentW + margin * 2, pageH = contentH + margin * 2
    const pdf = new jsPDF({ orientation: pageW > pageH ? 'landscape' : 'portrait', unit: 'mm', format: [pageW, pageH] })
    pdf.addImage(imgData, 'PNG', margin, margin, contentW, contentH)
    pdf.save('draft.pdf')
  }

  // ── Export to Google Drive ───────────────────────────────────────────────────

  const handleExportDrive = () => {
    setDriveState('exporting')
    setTimeout(() => setDriveState('done'), 1800)
  }

  // ── Generating phase ─────────────────────────────────────────────────────────

  if (genStage === 'generating') {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: palette.gray.light3 }}>
        <div style={{ maxWidth: 480, width: '100%', padding: '0 24px' }}>
          <Card style={{ padding: '40px 36px' }}>
            <div style={{ marginBottom: 28 }}>
              <Overline style={{ display: 'block', marginBottom: 8, color: palette.green.dark2 }}>GENERATING</Overline>
              <Body style={{ fontWeight: 600, color: palette.black, marginBottom: 6 }}>Creating your content drafts…</Body>
              <Body style={{ color: palette.gray.dark1, fontSize: 13 } as React.CSSProperties}>
                {titleText}
              </Body>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: palette.gray.light2, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ height: '100%', borderRadius: 3, background: palette.green.dark1, width: `${progress}%`, transition: 'width 0.2s ease' }} />
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (genStage === 'done' && submitted) {
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
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <Body style={{ fontSize: 12, color: palette.gray.dark1, width: 72, flexShrink: 0, margin: 0 } as React.CSSProperties}>
                  Package
                </Body>
                <Body style={{ fontSize: 13 } as React.CSSProperties}>
                  {form.campaignName || <span style={{ color: palette.gray.dark1, fontStyle: 'italic' }}>Untitled</span>}
                </Body>
              </div>
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
                  { label: 'Marked for review',  detail: 'Package is logged and your PDF is ready to send.',                          done: true  },
                  { label: 'Submit to reviewer', detail: 'Share the downloaded PDF with your content reviewer outside Ghostwriter.',   done: false },
                  { label: 'Await decision',     detail: 'Your reviewer will approve or deny the package.',                           done: false },
                  { label: 'Record outcome',     detail: 'Return to Package History and mark the decision you received.',              done: false },
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
              <Button variant="default" onClick={() => { setGenStage('idle'); setSubmittedAndNotify(false) }}>
                Edit Draft
              </Button>
              {onStartNew && (
                <Button variant="default" onClick={onStartNew}>
                  Start New Package
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>
    )
  }

  if (genStage === 'done') {
    return (
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', background: palette.gray.light3, padding: '32px 40px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* @ts-ignore */}
            <Banner variant="info" style={{ marginBottom: 24 }}>
              <strong>This is a draft — not the final product.</strong> Your approved content will be delivered once it passes the human review process.
            </Banner>

            <div ref={doneCardRef} style={{ marginBottom: 24 }}>
              <Card style={{ padding: '36px 40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  {/* @ts-ignore */}
                  <Chip label="AI Generated" variant="gray" />
                </div>
                <H2 style={{ marginBottom: 20 }}>{titleText}</H2>
                <Body style={{ lineHeight: 1.9, color: palette.gray.dark1, whiteSpace: 'pre-wrap' } as React.CSSProperties}>
                  {FULL_BLOG}
                </Body>
              </Card>
            </div>

            {driveState === 'done' && (
              <div style={{ marginBottom: 16 }}>
                {/* @ts-ignore */}
                <Banner variant="success">
                  Successfully exported to Google Drive. Check your Drive for the file.
                </Banner>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
              <Button variant="default" onClick={handleDownloadPdf}>
                Download for Review
              </Button>
              <Button
                variant="default"
                onClick={handleExportDrive}
                disabled={driveState === 'exporting' || driveState === 'done'}
              >
                {driveState === 'exporting' ? 'Exporting…' : driveState === 'done' ? 'Exported to Drive ✓' : 'Export to Google Drive'}
              </Button>

            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Idle / form view ─────────────────────────────────────────────────────────

  const hasPreview = Boolean(form.campaignName)

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* Left panel: form */}
      <div style={{
        width: 360, borderRight: `1px solid ${palette.gray.light2}`,
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 0' }}>

          {/* Package Name */}
          <div style={{ marginBottom: 20 }}>
            <TextInput
              label="Package Name"
              value={form.campaignName}
              onChange={e => update({ campaignName: e.target.value })}
              placeholder="e.g. AI Native Developer Campaign — Q2 2026"
            />
          </div>

          {/* Prompt + Additional Context — combined */}
          <div style={{ marginBottom: 24 }}>
            <TextArea
              label="Prompt"
              description="Describe what to create and optionally attach supporting files."
              value={form.prompt}
              onChange={e => update({ prompt: e.target.value })}
              placeholder="e.g. Write a blog post about production RAG pipelines using Atlas Vector Search, emphasizing operational simplicity…"
              rows={4}
            />

            {/* Attached files list */}
            {form.contextFiles.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {form.contextFiles.map((file, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 10px', borderRadius: 6,
                    background: palette.gray.light3, border: `1px solid ${palette.gray.light2}`,
                  }}>
                    <Body style={{ fontSize: 12, color: palette.black } as React.CSSProperties}>
                      {file.name}
                    </Body>
                    <Button
                      variant="default"
                      size="xsmall"
                      onClick={() => update({ contextFiles: form.contextFiles.filter((_, j) => j !== i) })}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden file input + LG attach button */}
            <input
              id="gw5-context-file-input"
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
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button
                variant="default"
                leftGlyph={<Icon glyph="AddFile" />}
                onClick={() => document.getElementById('gw5-context-file-input')?.click()}
              >
                Attach files
              </Button>
              <Body style={{ fontSize: 11, color: palette.gray.base } as React.CSSProperties}>
                PDF, DOCX, TXT, MD
              </Body>
            </div>
          </div>

          {/* ── Locked: Target Audience ─────────────────────────────────── */}
          <LockedSection label="Target Audience">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {AUDIENCES.map(a => (
                <div key={a.id} style={{
                  padding: '10px 12px', borderRadius: 8, cursor: 'default',
                  border: `1.5px solid ${palette.gray.light2}`,
                  background: palette.white,
                }}>
                  <Body style={{ fontWeight: 600, fontSize: 12, color: palette.black } as React.CSSProperties}>
                    {a.label}
                  </Body>
                  <Body style={{ fontSize: 11, color: palette.gray.dark1 } as React.CSSProperties}>{a.desc}</Body>
                </div>
              ))}
            </div>
          </LockedSection>

          {/* ── Locked: Output Formats ──────────────────────────────────── */}
          <LockedSection label="Output Formats">
            <Body style={{ color: palette.gray.dark1, marginBottom: 10, fontSize: 12 } as React.CSSProperties}>
              Select all that apply.
            </Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {FORMATS.map(f => (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 8,
                  border: `1px solid ${palette.gray.light2}`,
                  borderLeft: `3px solid ${palette.gray.light2}`,
                  background: palette.white,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    border: `2px solid ${palette.gray.light1}`,
                    background: 'transparent',
                  }} />
                  <div style={{ flex: 1 }}>
                    <Body style={{ fontSize: 12, fontWeight: 600, color: palette.black, margin: 0 } as React.CSSProperties}>{f.label}</Body>
                  </div>
                  <Body style={{ fontSize: 11, color: palette.gray.dark1, margin: 0 } as React.CSSProperties}>{f.meta}</Body>
                </div>
              ))}
            </div>
          </LockedSection>

          {/* ── Locked: Tone & Voice ────────────────────────────────────── */}
          <LockedSection label="Tone & Voice">
            <Body style={{ color: palette.gray.dark1, marginBottom: 10, fontSize: 12 } as React.CSSProperties}>
              How should Ghostwriter write for your audience?
            </Body>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TONES.map(t => (
                <div key={t.id} style={{
                  padding: '10px 12px', borderRadius: 8,
                  border: `1px solid ${palette.gray.light2}`,
                  background: palette.white,
                  textAlign: 'left',
                }}>
                  <Body style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, color: palette.black, marginTop: 0 } as React.CSSProperties}>{t.label}</Body>
                  <Body style={{ fontSize: 11, color: palette.gray.dark1, margin: 0 } as React.CSSProperties}>{t.desc}</Body>
                </div>
              ))}
            </div>
          </LockedSection>

          {/* ── Locked: Visual Design ───────────────────────────────────── */}
          <LockedSection label="Visual Design">
            <div style={{ display: 'flex', gap: 8 }}>
              {['Yes', 'No'].map(opt => (
                <div key={opt} style={{
                  flex: 1, padding: '10px 14px', borderRadius: 8, textAlign: 'center', cursor: 'default',
                  border: `1.5px solid ${palette.gray.light2}`,
                  background: palette.white,
                }}>
                  <Body style={{ fontWeight: 600, fontSize: 13, color: palette.black } as React.CSSProperties}>
                    {opt}
                  </Body>
                </div>
              ))}
            </div>
          </LockedSection>

        </div>

        {/* Generate footer */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${palette.gray.light2}`, flexShrink: 0 }}>
          <Button
            variant="primary"
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            Generate Drafts →
          </Button>
          {!canGenerate && (
            <Body style={{ color: palette.gray.dark1, marginTop: 8, fontSize: 11, textAlign: 'center' } as React.CSSProperties}>
              Enter a package name to continue
            </Body>
          )}
        </div>
      </div>

      {/* Right panel: live preview */}
      <div style={{ flex: 1, overflowY: 'auto', background: palette.gray.light3, padding: '32px 40px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <>
            <div style={{ marginBottom: 16 }}>
              {/* @ts-ignore */}
              <Banner variant="info">
                <strong>This is a draft — not the final product.</strong> Once the human review is done you will know whether your content is approved or not.
              </Banner>
            </div>
            <Card style={{ padding: '36px 40px' }}>
              <H2 style={{ marginBottom: 20 }}>
                {form.campaignName || <span style={{ color: palette.gray.light1 }}>Package Name will appear here…</span>}
              </H2>
              <ParagraphSkeleton />
              <div style={{ marginTop: 16 }}>
                <ParagraphSkeleton />
              </div>
            </Card>
          </>
        </div>
      </div>
    </div>
  )
}
