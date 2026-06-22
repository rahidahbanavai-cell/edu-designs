import { useState } from 'react'
import { Button }       from '@leafygreen-ui/button'
import { Badge }        from '@leafygreen-ui/badge'
// @ts-ignore
import { Chip }         from '@leafygreen-ui/chip'
import { Card }         from '@leafygreen-ui/card'
import { Stepper, Step } from '@leafygreen-ui/stepper'
import { H3, Body, Overline } from '@leafygreen-ui/typography'
import { palette } from '../tokens'

// ─── Types ────────────────────────────────────────────────────────────────────

type PkgStatus = 'approved' | 'in-review' | 'denied'

interface Pkg {
  id:            string
  name:          string
  status:        PkgStatus
  formats:       string[]
  audience:      string
  tone:          string
  submittedAt:   string
  reviewedAt?:   string
  reviewerNote?: string
  denialReason?: string
}

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

// ─── Status config ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PkgStatus, {
  label: string
  badge: 'green' | 'yellow' | 'red' | 'blue'
  headerBg: string
  headerBorder: string
  headerColor: string
  icon: string
}> = {
  'approved':  { label: 'Approved',  badge: 'green',  headerBg: palette.white, headerBorder: palette.green.dark1, headerColor: palette.green.dark2, icon: '✓' },
  'in-review': { label: 'In Review', badge: 'yellow', headerBg: palette.white, headerBorder: '#F59E0B',          headerColor: '#92400E',           icon: '○' },
  'denied':    { label: 'Denied',    badge: 'red',    headerBg: palette.white, headerBorder: '#EF4444',          headerColor: '#991B1B',           icon: '✕' },
}

// ─── PackageHistory ───────────────────────────────────────────────────────────

export function PackageHistory({ onBack }: { onBack: () => void }) {
  const [packages, setPackages]     = useState<Pkg[]>(INITIAL_PACKAGES)
  const [selectedId, setSelectedId] = useState<string>('ai-native-q2')

  const selected = packages.find(p => p.id === selectedId) ?? null

  const handleApprove = () => {
    if (!selected) return
    setPackages(prev =>
      prev.map(p => p.id === selected.id
        ? { ...p, status: 'approved', reviewedAt: 'Jun 13, 2026' }
        : p
      )
    )
  }

  const handleDeny = (reason: string) => {
    if (!selected) return
    setPackages(prev =>
      prev.map(p => p.id === selected.id
        ? { ...p, status: 'denied', reviewedAt: 'Jun 13, 2026', denialReason: reason }
        : p
      )
    )
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
                onClick={() => setSelectedId(pkg.id)}
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
            {selected.status === 'approved'  && <DetailApproved pkg={selected} />}
            {selected.status === 'in-review' && <DetailInReview pkg={selected} onApprove={handleApprove} onDeny={handleDeny} />}
            {selected.status === 'denied'    && <DetailDenied   pkg={selected} onNewPackage={onBack} />}
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
        <Body style={{ fontSize: 12, color: palette.gray.dark1, lineHeight: 1.6 } as React.CSSProperties}>
          Your approved content is ready to share. Distribute your drafts to your audience.
        </Body>
      </Card>
    </>
  )
}

// ─── Detail: In Review ────────────────────────────────────────────────────────

function DetailInReview({ pkg, onApprove, onDeny }: {
  pkg: Pkg
  onApprove: () => void
  onDeny: (reason: string) => void
}) {
  const cfg = STATUS_CONFIG['in-review']
  const [denying, setDenying] = useState(false)
  const [denialReason, setDenialReason] = useState('')

  return (
    <>
      <StatusHeader cfg={cfg} pkg={pkg} />
      <Card style={{ padding: '20px 24px', marginBottom: 20 }}>
        <Overline style={{ display: 'block', marginBottom: 14, color: palette.gray.dark1 }}>REVIEW PROGRESS</Overline>
        <TimelineSteps currentStep={2} />
      </Card>

      {!denying ? (
        <Card style={{ padding: '20px 24px' }}>
          <Overline style={{ display: 'block', marginBottom: 14, color: palette.gray.dark1 }}>RECORD DECISION</Overline>
          <Body style={{ color: palette.gray.dark1, marginBottom: 20 } as React.CSSProperties}>
            Once you've received a decision from your external reviewer, record it below to update the package status.
          </Body>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="primary" onClick={onApprove}>
              Mark as Approved
            </Button>
            <Button variant="danger" onClick={() => setDenying(true)}>
              Mark as Denied
            </Button>
          </div>
        </Card>
      ) : (
        <Card style={{ padding: '20px 24px' }}>
          <Overline style={{ display: 'block', marginBottom: 8, color: palette.gray.dark1 }}>REASON FOR DENIAL</Overline>
          <Body style={{ color: palette.gray.dark1, marginBottom: 12 } as React.CSSProperties}>
            Enter the reason provided by your reviewer so you can reference it later.
          </Body>
          <textarea
            value={denialReason}
            onChange={e => setDenialReason(e.target.value)}
            placeholder="e.g. Several product claims are not aligned with current documentation…"
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box' as const,
              padding: '10px 12px', borderRadius: 6,
              border: `1px solid ${palette.gray.light1}`,
              fontFamily: "'Euclid Circular A', sans-serif",
              fontSize: 13, color: palette.black,
              resize: 'vertical' as const, outline: 'none',
              marginBottom: 16,
            }}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              variant="danger"
              disabled={!denialReason.trim()}
              onClick={() => { onDeny(denialReason.trim()); setDenying(false) }}
            >
              Confirm Denial
            </Button>
            <Button variant="default" onClick={() => { setDenying(false); setDenialReason('') }}>
              Cancel
            </Button>
          </div>
        </Card>
      )}
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
