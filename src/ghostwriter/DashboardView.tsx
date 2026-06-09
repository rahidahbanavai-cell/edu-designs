import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import { Card } from '@leafygreen-ui/card'
import { H2, Body, Overline } from '@leafygreen-ui/typography'
import Icon from '@leafygreen-ui/icon'
import { palette } from '../tokens'

const packages = [
  {
    id: 1,
    name: 'AI Native Developer Campaign — Q2 2026',
    sources: 3, outputs: 3,
    status: 'In Review',
    statusVariant: 'yellow' as const,
    date: 'Jun 9, 2026',
    audience: 'AI Native Engineers',
    types: ['Blog Post', 'LinkedIn', 'Email'],
  },
  {
    id: 2,
    name: 'MongoDB Atlas Search — Q2 Launch',
    sources: 2, outputs: 2,
    status: 'Approved',
    statusVariant: 'green' as const,
    date: 'Jun 2, 2026',
    audience: 'Developer (General)',
    types: ['Blog Post', 'LinkedIn'],
  },
  {
    id: 3,
    name: 'Vector Search for Beginners — Social Push',
    sources: 2, outputs: 3,
    status: 'Draft',
    statusVariant: 'lightgray' as const,
    date: 'May 28, 2026',
    audience: 'Social Media Audience',
    types: ['Blog Post', 'LinkedIn', 'Email'],
  },
  {
    id: 4,
    name: 'Revenue Marketing: Agentic Apps Playbook',
    sources: 3, outputs: 2,
    status: 'Published',
    statusVariant: 'blue' as const,
    date: 'May 20, 2026',
    audience: 'Growth & Revenue Marketing',
    types: ['Blog Post', 'Email'],
  },
]

const stats = [
  { label: 'Total Packages', value: '12', color: palette.black },
  { label: 'In Review',      value: '4',  color: '#F97316' },
  { label: 'Approved',       value: '6',  color: palette.green.dark2 },
  { label: 'Published',      value: '2',  color: palette.blue.base },
]

const pipeline = [
  { label: 'Draft',      variant: 'lightgray' as const },
  { label: 'In Review',  variant: 'yellow'    as const },
  { label: 'Approved',   variant: 'green'     as const },
  { label: 'Published',  variant: 'blue'      as const },
]

export function DashboardView({ onNew }: { onNew: () => void }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      fontFamily: "'Euclid Circular A', sans-serif", padding: '40px 48px',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <H2 style={{ marginBottom: 6 }}>Content Packages</H2>
            <Body style={{ color: palette.gray.dark1 }}>
              Track your Ghostwriter packages through the review pipeline.
            </Body>
          </div>
          <div style={{ flex: 1 }} />
          <Button variant="primary" onClick={onNew}>
            + New Package
          </Button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 36 }}>
          {stats.map(stat => (
            <Card key={stat.label}>
              <div style={{
                color: stat.color, fontSize: 36, fontWeight: 700, marginBottom: 6, lineHeight: 1,
                fontFamily: "'Euclid Circular A', sans-serif",
              }}>
                {stat.value}
              </div>
              <Body style={{ color: palette.gray.dark1, fontSize: 13 }}>{stat.label}</Body>
            </Card>
          ))}
        </div>

        {/* Pipeline legend */}
        <div style={{
          background: palette.gray.light3,
          borderRadius: 8, padding: '12px 20px',
          border: `1px solid ${palette.gray.light2}`,
          display: 'flex', alignItems: 'center',
          gap: 16, marginBottom: 24, flexWrap: 'wrap' as const,
        }}>
          <Overline>PIPELINE</Overline>
          {pipeline.map((s, i) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Badge variant={s.variant}>{s.label}</Badge>
              {i < pipeline.length - 1 && (
                <span style={{ color: palette.gray.light1, fontSize: 14, marginLeft: 4 }}>→</span>
              )}
            </div>
          ))}
        </div>

        {/* Section label */}
        <Overline style={{ display: 'block', marginBottom: 12 }}>RECENT PACKAGES</Overline>

        {/* Package list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {packages.map(pkg => (
            <Card key={pkg.id} style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: palette.black, fontSize: 14, fontWeight: 600, marginBottom: 10,
                    fontFamily: "'Euclid Circular A', sans-serif",
                  }}>
                    {pkg.name}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const, alignItems: 'center' }}>
                    <Body style={{ color: palette.gray.dark1, fontSize: 12 }}>{pkg.audience}</Body>
                    <span style={{ color: palette.gray.light1 }}>·</span>
                    <Body style={{ color: palette.gray.dark1, fontSize: 12 }}>{pkg.sources} sources</Body>
                    <span style={{ color: palette.gray.light1 }}>·</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {pkg.types.map(t => (
                        <Badge key={t} variant="lightgray">{t}</Badge>
                      ))}
                    </div>
                    <span style={{ color: palette.gray.light1 }}>·</span>
                    <Body style={{ color: palette.gray.dark1, fontSize: 12 }}>{pkg.date}</Body>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Badge variant={pkg.statusVariant}>{pkg.status}</Badge>
                </div>
                {/* @ts-ignore */}
                <Icon glyph="ChevronRight" fill={palette.gray.base} style={{ flexShrink: 0 }} />
              </div>
            </Card>
          ))}
        </div>

        {/* Pilot notice */}
        <div style={{
          marginTop: 32,
          background: palette.blue.light3,
          border: `1px solid ${palette.blue.base}`,
          borderLeft: `4px solid ${palette.blue.base}`,
          borderRadius: 8, padding: '16px 20px',
        }}>
          <div style={{
            color: palette.black, fontSize: 13, fontWeight: 600, marginBottom: 4,
            fontFamily: "'Euclid Circular A', sans-serif",
          }}>
            10 active pilots
          </div>
          <Body style={{ color: palette.gray.dark1, fontSize: 12 }}>
            Running white-glove pilots with Growth, Revenue, and Social Marketing teams. All packages during the pilot phase include dedicated review support from the content team.
          </Body>
        </div>

      </div>
    </div>
  )
}
