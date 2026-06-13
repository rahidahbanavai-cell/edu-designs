import { useState } from 'react'
import { Button }       from '@leafygreen-ui/button'
import { Badge }        from '@leafygreen-ui/badge'
// @ts-ignore
import { Chip }         from '@leafygreen-ui/chip'
import { Card }         from '@leafygreen-ui/card'
import { Stepper, Step } from '@leafygreen-ui/stepper'
// @ts-ignore
import { Tabs, Tab } from '@leafygreen-ui/tabs'
import { H2, H3, Body, Overline, Label } from '@leafygreen-ui/typography'
import { palette } from '../tokens'

// ─── Types ────────────────────────────────────────────────────────────────────

type PkgStatus = 'approved' | 'in-review' | 'denied' | 'changes-requested'

interface ReviewComment {
  id: string
  highlight: string
  comment: string
  type: 'clarify' | 'fact-check' | 'remove'
}

interface Pkg {
  id:               string
  name:             string
  status:           PkgStatus
  formats:          string[]
  audience:         string
  tone:             string
  submittedAt:      string
  reviewedAt?:      string
  reviewerNote?:    string
  reviewerComments?: ReviewComment[]
  denialReason?:    string
}

type DraftSegment =
  | { type: 'text';              text: string }
  | { type: 'highlight';         text: string; commentIdx: number }
  | { type: 'visual-placeholder' }

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_PACKAGES: Pkg[] = [
  {
    id: 'ai-native-q2',
    name: 'AI Native Developer Campaign — Q2 2026',
    status: 'in-review',
    formats: ['Blog Post', 'LinkedIn Thread', 'Email Sequence'],
    audience: 'AI-Native Engineers',
    tone: 'Technical peer',
    submittedAt: 'Jun 10, 2026',
  },
  {
    id: 'agentic-apps',
    name: 'Agentic Apps Playbook',
    status: 'changes-requested',
    formats: ['Blog Post', 'LinkedIn Thread'],
    audience: 'AI-Native Engineers',
    tone: 'Technical peer',
    submittedAt: 'Jun 7, 2026',
    reviewedAt: 'Jun 9, 2026',
    reviewerNote: 'Good structure overall. A few sections need clarification or correction before we can approve.',
    reviewerComments: [
      {
        id: 'c1',
        highlight: 'Agents can autonomously execute multi-step workflows without human intervention',
        comment: 'This overstates autonomy. Add a qualifier — "in well-defined scenarios" or similar.',
        type: 'clarify',
      },
      {
        id: 'c2',
        highlight: 'Atlas Vector Search reduces hallucination rates by up to 73%',
        comment: 'This statistic needs a source citation. If it\'s from internal data, note that explicitly.',
        type: 'fact-check',
      },
      {
        id: 'c3',
        highlight: 'competitors still rely on legacy architectures',
        comment: 'Remove competitive comparisons per content guidelines.',
        type: 'remove',
      },
    ],
  },
  {
    id: 'atlas-search-q2',
    name: 'Atlas Search — Q2 Launch',
    status: 'approved',
    formats: ['Blog Post', 'LinkedIn Thread'],
    audience: 'Developer (General)',
    tone: 'Educational',
    submittedAt: 'Jun 3, 2026',
    reviewedAt: 'Jun 5, 2026',
    reviewerNote: 'Excellent work. Content is accurate, well-structured, and ready to publish. All product claims are properly supported by documentation.',
  },
  {
    id: 'vector-beginners',
    name: 'Vector Search for Beginners',
    status: 'denied',
    formats: ['Blog Post', 'Email Sequence'],
    audience: 'Developer (General)',
    tone: 'Educational',
    submittedAt: 'Jun 1, 2026',
    reviewedAt: 'Jun 4, 2026',
    denialReason: 'Content does not meet accuracy standards for MongoDB product claims. Several statements about vector search performance were not aligned with current documentation. This package has been closed — please start a new one with accurate, documented claims.',
  },
]

const AGENTIC_LINKEDIN_DRAFT_BEFORE = `🧵 The shift toward agentic AI is real — and MongoDB Atlas is built for it.

1/ Agentic systems don't just respond. They plan, execute, and iterate across multi-step workflows. That changes what your database needs to do.

2/ Most teams hit the same wall: vector data lives in one place, operational data lives in another. Two pipelines. Two monitoring dashboards. Two sources of drift.

3/ Atlas Vector Search keeps your embeddings co-located with your documents — same cluster, same queries, same operational model. No sync jobs. No extra infra.`

const AGENTIC_LINKEDIN_DRAFT_AFTER = `4/ The result? Faster retrieval, lower latency, and agents that produce more accurate outputs because context is always current.

5/ We put together a full Agentic Apps Playbook — architecture patterns, Atlas setup, and real production examples.

🔗 Read the full guide → [link]`

const AGENTIC_DRAFT_SEGMENTS: DraftSegment[] = [
  { type: 'text',      text: 'Building Agentic Applications with MongoDB Atlas\n\nThe shift toward agentic AI architectures is accelerating. Modern AI systems don\'t just respond to prompts — they plan, execute, and iterate. ' },
  { type: 'highlight', text: 'Agents can autonomously execute multi-step workflows without human intervention', commentIdx: 0 },
  { type: 'text',              text: ', making them uniquely suited for complex enterprise automation.\n\nMongoDB Atlas provides the operational backbone for these systems. Atlas Vector Search gives your agents instant access to semantic retrieval at scale. Your operational data and your AI context live in one place — reducing latency, cost, and architectural complexity.\n\n' },
  { type: 'visual-placeholder' },
  { type: 'highlight', text: 'Atlas Vector Search reduces hallucination rates by up to 73%', commentIdx: 1 },
  { type: 'text',      text: ' in production RAG systems. When retrieval is grounded in fresh operational data rather than a stale vector snapshot, agents produce more accurate outputs.\n\nBuilding your first agentic app with Atlas takes about 30 minutes. The quickstart covers index creation and basic retrieval. Most teams then layer in LangChain or LlamaIndex for orchestration.\n\nOne thing to consider: ' },
  { type: 'highlight', text: 'competitors still rely on legacy architectures', commentIdx: 2 },
  { type: 'text',      text: ' that require separate vector and operational stores — two sync pipelines, two monitoring dashboards, two places for production incidents. MongoDB Atlas eliminates all of that.' },
]

// ─── Status config ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PkgStatus, {
  label: string
  badge: 'green' | 'yellow' | 'red' | 'blue'
  headerBg: string
  headerBorder: string
  headerColor: string
  icon: string
}> = {
  'approved':          { label: 'Approved',           badge: 'green',  headerBg: palette.white, headerBorder: palette.green.dark1, headerColor: palette.green.dark2, icon: '✓' },
  'in-review':         { label: 'In Review',           badge: 'yellow', headerBg: palette.white, headerBorder: '#F59E0B',          headerColor: '#92400E',           icon: '○' },
  'denied':            { label: 'Denied',              badge: 'red',    headerBg: palette.white, headerBorder: '#EF4444',          headerColor: '#991B1B',           icon: '✕' },
  'changes-requested': { label: 'Changes Requested',  badge: 'blue',   headerBg: palette.white, headerBorder: palette.blue.base,  headerColor: palette.blue.dark1,  icon: '↩' },
}

const COMMENT_TYPE_CONFIG: Record<ReviewComment['type'], { label: string; color: string }> = {
  'clarify':    { label: 'Clarify',    color: '#001E2B' },
  'fact-check': { label: 'Fact-check', color: '#001E2B' },
  'remove':     { label: 'Remove',     color: '#001E2B' },
}

// ─── PackageHistory ───────────────────────────────────────────────────────────

export function PackageHistory({ onBack }: { onBack: () => void }) {
  const [packages, setPackages]     = useState<Pkg[]>(INITIAL_PACKAGES)
  const [selectedId, setSelectedId] = useState<string>('agentic-apps')
  const [submitting, setSubmitting] = useState(false)
  const [resubmittedId, setResubmittedId] = useState<string | null>(null)

  const selected = packages.find(p => p.id === selectedId) ?? null

  const handleResubmit = () => {
    if (!selected) return
    setSubmitting(true)
    setTimeout(() => {
      setPackages(prev =>
        prev.map(p => p.id === selected.id
          ? { ...p, status: 'approved', reviewedAt: 'Jun 11, 2026' }
          : p
        )
      )
      setSubmitting(false)
      setResubmittedId(selected.id)
    }, 1200)
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* ── Left: package list ─────────────────────────────────────────── */}
      <div style={{
        width: 380, borderRight: `1px solid ${palette.gray.light2}`,
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        background: palette.gray.light3,
      }}>
        <div style={{
          padding: '20px 20px 14px', borderBottom: `1px solid ${palette.gray.light2}`,
          flexShrink: 0, background: palette.white,
        }}>
          <Overline style={{ display: 'block', marginBottom: 4, color: palette.green.dark2 }}>
            PACKAGE HISTORY
          </Overline>
          <Body style={{ fontSize: 13, color: palette.gray.dark1 } as React.CSSProperties}>
            {packages.length} packages
          </Body>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
          {packages.map(pkg => {
            const cfg     = STATUS_CONFIG[pkg.status]
            const isSelected = pkg.id === selectedId
            return (
              <div
                key={pkg.id}
                onClick={() => { setSelectedId(pkg.id); setResubmittedId(null) }}
                style={{
                  padding: '14px 16px', borderRadius: 10, marginBottom: 8,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: isSelected ? palette.white : palette.white,
                  border: `1.5px solid ${isSelected ? palette.green.dark1 : palette.gray.light2}`,
                  boxShadow: isSelected ? `0 0 0 2px ${palette.green.light3}` : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                  <Body style={{ fontWeight: 600, fontSize: 13, color: palette.black, lineHeight: 1.4, flex: 1 } as React.CSSProperties}>
                    {pkg.name}
                  </Body>
                  <Badge variant={cfg.badge} style={{ flexShrink: 0 }}>{cfg.label}</Badge>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const, marginBottom: 8 }}>
                  {pkg.formats.map(f => (
                    <span key={f} style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4,
                      background: palette.gray.light2, color: palette.gray.dark1,
                      fontFamily: "'Euclid Circular A', sans-serif",
                    }}>{f}</span>
                  ))}
                </div>
                <Body style={{ fontSize: 11, color: palette.gray.dark1 } as React.CSSProperties}>
                  Submitted {pkg.submittedAt}
                  {pkg.reviewedAt ? ` · Reviewed ${pkg.reviewedAt}` : ''}
                </Body>
              </div>
            )
          })}
        </div>

        <div style={{ padding: '14px 12px', borderTop: `1px solid ${palette.gray.light2}`, flexShrink: 0 }}>
          <Button variant="primary" onClick={onBack}>
            + New Package
          </Button>
        </div>
      </div>

      {/* ── Right: detail panel ────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', background: palette.gray.light3, padding: '32px 40px' }}>
        {selected ? (
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {selected.status === 'approved'          && <DetailApproved pkg={selected} />}
            {selected.status === 'in-review'         && <DetailInReview pkg={selected} />}
            {selected.status === 'denied'            && <DetailDenied   pkg={selected} onNewPackage={onBack} />}
            {selected.status === 'changes-requested' && (
              resubmittedId === selected.id
                ? <DetailResubmitted pkg={selected} onViewList={() => setResubmittedId(null)} />
                : <DetailChanges pkg={selected} submitting={submitting} onResubmit={handleResubmit} />
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Body style={{ color: palette.gray.dark1 }}>Select a package to view details.</Body>
          </div>
        )}
      </div>

    </div>
  )
}

// ─── Detail: Approved ─────────────────────────────────────────────────────────

function DetailApproved({ pkg }: { pkg: Pkg }) {
  const cfg = STATUS_CONFIG['approved']
  return (
    <>
      <StatusHeader cfg={cfg} pkg={pkg} />
      {pkg.reviewerNote && (
        <Card style={{ padding: '20px 24px', marginBottom: 20 }}>
          <Overline style={{ display: 'block', marginBottom: 8, color: palette.gray.dark1 }}>REVIEWER NOTE</Overline>
          <Body style={{ color: palette.black, lineHeight: 1.7 }}>{pkg.reviewerNote}</Body>
        </Card>
      )}
      <Card style={{ padding: '20px 24px' }}>
        <Overline style={{ display: 'block', marginBottom: 12, color: palette.gray.dark1 }}>APPROVED FORMATS</Overline>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 16 }}>
          {pkg.formats.map(f => (
            // @ts-ignore
            <Chip key={f} label={f} variant="green" />
          ))}
        </div>
        <Body style={{ fontSize: 12, color: palette.gray.dark1, lineHeight: 1.6 } as React.CSSProperties}>
          Your approved content is ready to share. Download your drafts and distribute them to your audience.
        </Body>
        <div style={{ marginTop: 16 }}>
          <Button variant="primary">Download approved drafts</Button>
        </div>
      </Card>
    </>
  )
}

// ─── Detail: In Review ────────────────────────────────────────────────────────

function DetailInReview({ pkg }: { pkg: Pkg }) {
  const cfg = STATUS_CONFIG['in-review']
  return (
    <>
      <StatusHeader cfg={cfg} pkg={pkg} />
      <Card style={{ padding: '20px 24px' }}>
        <Overline style={{ display: 'block', marginBottom: 14, color: palette.gray.dark1 }}>REVIEW PROGRESS</Overline>
        {/* steps 0+1 complete, step 2 (Review in progress) is current */}
        <TimelineSteps currentStep={2} />
      </Card>
    </>
  )
}

// ─── Detail: Denied ───────────────────────────────────────────────────────────

function DetailDenied({ pkg, onNewPackage }: { pkg: Pkg; onNewPackage: () => void }) {
  const cfg = STATUS_CONFIG['denied']
  return (
    <>
      <StatusHeader cfg={cfg} pkg={pkg} />
      <Card style={{ padding: '20px 24px', marginBottom: 20 }}>
        <Overline style={{ display: 'block', marginBottom: 8, color: palette.gray.dark1 }}>REASON FOR DENIAL</Overline>
        <Body style={{ color: palette.black, lineHeight: 1.7 }}>{pkg.denialReason}</Body>
      </Card>
      <div>
        <Button variant="primary" onClick={onNewPackage}>Start a new package →</Button>
      </div>
    </>
  )
}

// ─── Detail: Changes Requested ───────────────────────────────────────────────

function DetailChanges({ pkg, submitting, onResubmit }: { pkg: Pkg; submitting: boolean; onResubmit: () => void }) {
  const cfg = STATUS_CONFIG['changes-requested']
  const comments = pkg.reviewerComments ?? []

  return (
    <>
      <StatusHeader cfg={cfg} pkg={pkg} />

      {pkg.reviewerNote && (
        <Card style={{ padding: '20px 24px', marginBottom: 20 }}>
          <Overline style={{ display: 'block', marginBottom: 8, color: palette.gray.dark1 }}>REVIEWER NOTE</Overline>
          <Body style={{ color: palette.black, lineHeight: 1.7 }}>{pkg.reviewerNote}</Body>
        </Card>
      )}

      {/* Draft tabs — one per selected format, reviewer comments inside each tab */}
      {/* @ts-ignore */}
      <Tabs>
        {pkg.formats.map((fmt, fi) => (
          // @ts-ignore
          <Tab key={fmt} name={fmt}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 4 }}>

              {/* Draft card */}
              <Card style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Overline style={{ color: palette.gray.dark1 }}>DRAFT — {fmt}</Overline>
                  {fi === 0 && <Badge variant="blue">{comments.length} comment{comments.length !== 1 ? 's' : ''}</Badge>}
                </div>

                {fi === 0 ? (
                  <div style={{ lineHeight: 1.9, color: palette.gray.dark1, fontSize: 13, fontFamily: "'Euclid Circular A', sans-serif" }}>
                    {AGENTIC_DRAFT_SEGMENTS.map((seg, i) => {
                      if (seg.type === 'text') {
                        return <span key={i} style={{ whiteSpace: 'pre-wrap' as const }}>{seg.text}</span>
                      }
                      if (seg.type === 'visual-placeholder') {
                        return (
                          <div key={i} style={{
                            margin: '20px 0',
                            border: `1.5px dashed ${palette.gray.light1}`,
                            borderRadius: 10, background: palette.gray.light3,
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', gap: 8, padding: '28px 24px',
                          }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 8,
                              border: `1.5px dashed ${palette.gray.base}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 18, color: palette.gray.base,
                            }}>
                              🖼
                            </div>
                            <span style={{ fontSize: 12, color: palette.gray.dark1 }}>Visual design placeholder</span>
                            <span style={{ fontSize: 11, color: palette.gray.base }}>Final visual asset placed here after approval</span>
                          </div>
                        )
                      }
                      return (
                        <mark key={i} style={{
                          background: '#FEF3C7', borderRadius: 3, padding: '1px 2px',
                          borderBottom: '2px solid #F59E0B',
                        }}>
                          {seg.text}
                        </mark>
                      )
                    })}
                  </div>
                ) : (
                  <>
                    <Body style={{ lineHeight: 1.9, color: palette.gray.dark1, fontSize: 13, whiteSpace: 'pre-wrap' } as React.CSSProperties}>
                      {AGENTIC_LINKEDIN_DRAFT_BEFORE}
                    </Body>
                    <div style={{
                      margin: '20px 0',
                      border: `1.5px dashed ${palette.gray.light1}`,
                      borderRadius: 10, background: palette.gray.light3,
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: 8, padding: '28px 24px',
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 8,
                        border: `1.5px dashed ${palette.gray.base}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, color: palette.gray.base,
                      }}>
                        🖼
                      </div>
                      <span style={{ fontSize: 12, color: palette.gray.dark1 }}>Visual design placeholder</span>
                      <span style={{ fontSize: 11, color: palette.gray.base }}>Final visual asset placed here after approval</span>
                    </div>
                    <Body style={{ lineHeight: 1.9, color: palette.gray.dark1, fontSize: 13, whiteSpace: 'pre-wrap' } as React.CSSProperties}>
                      {AGENTIC_LINKEDIN_DRAFT_AFTER}
                    </Body>
                  </>
                )}
              </Card>

              {/* Reviewer comments — scoped to this tab */}
              <Card style={{ padding: '20px 24px', marginBottom: 4 }}>
                <Overline style={{ display: 'block', marginBottom: 14, color: palette.gray.dark1 }}>REVIEWER COMMENTS</Overline>
                {fi === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {comments.map((c, i) => {
                      const typeCfg = COMMENT_TYPE_CONFIG[c.type]
                      return (
                        <div key={c.id} style={{
                          paddingBottom: i < comments.length - 1 ? 14 : 0,
                          borderBottom: i < comments.length - 1 ? `1px solid ${palette.gray.light2}` : 'none',
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: 6 }}>
                              <Label style={{ color: typeCfg.color }}>{i + 1}. {typeCfg.label}</Label>
                            </div>
                            <Body style={{
                              fontStyle: 'italic', color: palette.gray.dark1,
                              fontSize: 12, marginBottom: 6, lineHeight: 1.5,
                              background: '#FEF9C3', padding: '4px 8px', borderRadius: 4,
                              display: 'block',
                            } as React.CSSProperties}>
                              "{c.highlight}"
                            </Body>
                            <Body style={{ fontSize: 12, color: palette.black, lineHeight: 1.6 } as React.CSSProperties}>
                              {c.comment}
                            </Body>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <Body style={{ fontSize: 13, color: palette.gray.dark1 } as React.CSSProperties}>
                    No reviewer comments for this format.
                  </Body>
                )}
              </Card>

            </div>
          </Tab>
        ))}
      </Tabs>

      {/* Resubmit action */}
      <div style={{
        marginTop: 24, padding: '20px 24px', borderRadius: 10,
        background: palette.blue.light3, border: `1px solid ${palette.blue.light2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <Body style={{ fontWeight: 600, color: palette.blue.dark1, marginBottom: 4 } as React.CSSProperties}>
            Ready to resubmit?
          </Body>
          <Body style={{ fontSize: 12, color: palette.gray.dark1 } as React.CSSProperties}>
            Address the reviewer's comments above, then resubmit for another round of review.
          </Body>
        </div>
        <Button
          variant="primary"
          disabled={submitting}
          onClick={onResubmit}
        >
          {submitting ? 'Submitting…' : 'Accept & Resubmit →'}
        </Button>
      </div>
    </>
  )
}

// ─── Detail: Resubmitted success ─────────────────────────────────────────────

function DetailResubmitted({ pkg, onViewList }: { pkg: Pkg; onViewList: () => void }) {
  const cfg = STATUS_CONFIG['in-review']

  return (
    <>
      {/* Success header */}
      <div style={{
        padding: '28px 32px', borderRadius: 12, marginBottom: 20,
        background: palette.green.light3, border: `1px solid ${palette.green.dark1}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: palette.green.dark1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <span style={{ color: palette.white, fontSize: 24, fontWeight: 700 }}>✓</span>
        </div>
        <H2 style={{ marginBottom: 8 }}>Resubmitted for review</H2>
        <Body style={{ color: palette.gray.dark1, maxWidth: 400 } as React.CSSProperties}>
          <strong>{pkg.name}</strong> has been resubmitted. The status in your package list has been updated to <strong>In Review</strong>.
        </Body>
      </div>

      {/* Updated status card */}
      <Card style={{ padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Badge variant={cfg.badge}>In Review</Badge>
          <Body style={{ fontSize: 12, color: palette.gray.dark1 } as React.CSSProperties}>Status updated just now</Body>
        </div>
        {/* step 0 complete (just received), step 1 (Reviewer assigned) is current */}
        <TimelineSteps currentStep={1} />
      </Card>

      <Button variant="default" onClick={onViewList}>← Back to package list</Button>
    </>
  )
}

// ─── Shared: Status header ────────────────────────────────────────────────────

function StatusHeader({ cfg, pkg }: {
  cfg: (typeof STATUS_CONFIG)[PkgStatus]
  pkg: Pkg
}) {
  return (
    <div style={{
      padding: '20px 24px', borderRadius: 12, marginBottom: 20,
      background: cfg.headerBg, border: `1px solid ${cfg.headerBorder}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <H3 style={{ color: palette.black, marginBottom: 4 }}>{pkg.name}</H3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 10 }}>
            {pkg.formats.map(f => (
              // @ts-ignore
              <Chip key={f} label={f} variant="gray" />
            ))}
          </div>
          <Body style={{ fontSize: 12, color: cfg.headerColor } as React.CSSProperties}>
            Submitted {pkg.submittedAt}
            {pkg.reviewedAt ? ` · Reviewed ${pkg.reviewedAt}` : ''}
          </Body>
        </div>
        <Badge variant={cfg.badge}>{cfg.label}</Badge>
      </div>
    </div>
  )
}

// ─── Shared: Timeline steps ───────────────────────────────────────────────────

const REVIEW_STEPS = [
  { label: 'Package received',   detail: 'Your drafts are queued for review.'                                },
  { label: 'Reviewer assigned',  detail: 'A content reviewer will be confirmed within 1 business day.'       },
  { label: 'Review in progress', detail: 'Typical turnaround: 1–2 business days.'                           },
  { label: 'Ready to share',     detail: "You'll be notified by email when your drafts are approved."        },
]

function TimelineSteps({ currentStep }: { currentStep: number }) {
  return (
    <>
      {/* @ts-ignore */}
      <Stepper currentStep={currentStep}>
        {REVIEW_STEPS.map(s => (
          // @ts-ignore
          <Step key={s.label}>{s.label}</Step>
        ))}
      </Stepper>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {REVIEW_STEPS.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <Body style={{
              fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' as const,
              color: i < currentStep ? palette.black : palette.gray.dark1,
            } as React.CSSProperties}>
              {s.label}:
            </Body>
            <Body style={{ fontSize: 12, color: palette.gray.dark1 } as React.CSSProperties}>
              {s.detail}
            </Body>
          </div>
        ))}
      </div>
    </>
  )
}
