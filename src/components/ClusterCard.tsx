import { useState } from 'react'
import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import Icon from '@leafygreen-ui/icon'
import Tooltip from '@leafygreen-ui/tooltip'
import { MongoDBLogoMark } from '@leafygreen-ui/logo'
import { palette } from '../tokens'

const LABEL: React.CSSProperties = {
  fontSize: 12,
  fontFamily: "'Euclid Circular A', sans-serif",
  fontWeight: 600,
  color: palette.gray.dark1,
  letterSpacing: '0.4px',
  textTransform: 'uppercase',
  lineHeight: '16px',
  margin: 0,
}

const VALUE: React.CSSProperties = {
  fontSize: 13,
  fontFamily: "'Euclid Circular A', sans-serif",
  fontWeight: 400,
  color: palette.gray.base,
  lineHeight: '20px',
  margin: 0,
}

function MetaField({ label, value, isLink = false }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={LABEL}>{label}</span>
      <span style={isLink ? { ...VALUE, color: palette.blue.base } : VALUE}>{value}</span>
    </div>
  )
}

type SparkLine = {
  label: string
  color: string
  value?: string   // shown inline in title row if provided
  showDot?: boolean // show colored dot before label
}

function MiniSparkline({ lines, unit = '100/s', infoIcon = true, tooltip = '' }: {
  lines: SparkLine[]
  unit?: string
  infoIcon?: boolean
  tooltip?: string
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const chartH = 110
  // Place each flat line at ~72% chart height, stacked 8px apart so fills are visible
  const getLineY = (i: number) => Math.round(chartH * 0.72) - i * 8

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0, padding: '0 14px' }}>
      {/* Title rows — one row per line, first row gets ℹ icon */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {lines.map((line, i) => (
          <div key={line.label} style={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: 20 }}>
            {line.showDot && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: line.color, flexShrink: 0 }} />
            )}
            <span style={{ fontSize: 13, fontFamily: "'Euclid Circular A', sans-serif", color: palette.gray.dark1, whiteSpace: 'nowrap' }}>
              {line.label}
            </span>
            {line.value && (
              <span style={{ fontSize: 13, fontFamily: "'Source Code Pro', monospace", color: palette.black, whiteSpace: 'nowrap' }}>
                {line.value}
              </span>
            )}
            {i === 0 && infoIcon && (
              /* @ts-ignore - React 19 polymorphic type mismatch */
              <Tooltip
                open={tooltipOpen}
                trigger={
                  <span
                    style={{ display: 'inline-flex', cursor: 'help' }}
                    onMouseEnter={() => setTooltipOpen(true)}
                    onMouseLeave={() => setTooltipOpen(false)}
                  >
                    {/* @ts-ignore - React 19 polymorphic type mismatch */}
                    <Icon glyph="InfoWithCircle" size="small" fill={palette.gray.base} />
                  </span>
                }
              >
                {tooltip}
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      {/* Chart container */}
      <div style={{ position: 'relative', width: '100%', height: chartH + 16 }}>
        {/* Y-axis max label */}
        <span style={{ position: 'absolute', top: 0, left: 0, fontSize: 10, color: palette.gray.base, fontFamily: "'Euclid Circular A', sans-serif", lineHeight: 1 }}>
          {unit}
        </span>
        {/* viewBox keeps coordinate system at 172×chartH; preserveAspectRatio="none" lets width stretch */}
        <svg
          viewBox={`0 0 172 ${chartH}`}
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 14, left: 0, width: '100%', height: chartH }}
        >
          {/* Dashed gridlines */}
          <line x1="0" y1="2" x2="172" y2="2" stroke={palette.gray.light2} strokeDasharray="3 3" strokeWidth="1" />
          <line x1="0" y1={chartH / 2} x2="172" y2={chartH / 2} stroke={palette.gray.light2} strokeDasharray="3 3" strokeWidth="1" />
          <line x1="0" y1={chartH - 1} x2="172" y2={chartH - 1} stroke={palette.gray.light2} strokeDasharray="3 3" strokeWidth="1" />
          {/* Data lines with fill area below */}
          {lines.map((line, i) => {
            const y = getLineY(i)
            const fillH = chartH - y
            return (
              <g key={line.label}>
                <rect x="0" y={y} width="172" height={fillH} fill={line.color} opacity="0.15" />
                <line x1="0" y1={y} x2="172" y2={y} stroke={line.color} strokeWidth="2" />
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export function ClusterCard() {
  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 24, border: `1px solid ${palette.gray.light2}`, background: palette.white, boxShadow: '0px 4px 10px -4px rgba(0,30,43,0.3)', overflow: 'hidden' }}>

      {/* ── Top section ── */}
      <div style={{ position: 'relative', padding: '25px 24px 0' }}>

        {/* Green status dot */}
        <div style={{ position: 'absolute', top: 34, left: 24, width: 12, height: 12, borderRadius: '50%', background: palette.green.dark1 }} />

        {/* Cluster name + action buttons row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 20 }}>
          <span style={{ fontSize: 16, fontFamily: "'Euclid Circular A', sans-serif", fontWeight: 600, color: palette.blue.base, lineHeight: '28px' }}>
            Cluster0
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* @ts-ignore - React 19 polymorphic type mismatch */}
            <Button size="default">Connect</Button>
            {/* @ts-ignore - React 19 polymorphic type mismatch */}
            <Button size="default">View Monitoring</Button>
            {/* @ts-ignore - React 19 polymorphic type mismatch */}
            <Button size="default">Browse Collections</Button>
            {/* @ts-ignore - React 19 polymorphic type mismatch */}
            <Button size="default" leftGlyph={<Icon glyph="Ellipsis" />} aria-label="More options" />
          </div>
          <Badge variant="green">Free</Badge>
          <Badge variant="blue">Shared</Badge>
        </div>

        {/* ── Middle: Upgrade tip + 4 metric panels ── */}
        <div style={{ display: 'flex', marginTop: 16, gap: 0, minHeight: 240 }}>

          {/* Upgrade upsell panel */}
          <div style={{ width: 179, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
              <MongoDBLogoMark height={16} color="green-dark-2" />
              <span style={{ fontSize: 13, fontFamily: "'Euclid Circular A', sans-serif", fontWeight: 600, color: palette.gray.dark3, lineHeight: '20px' }}>
                More Storage for $9/mo
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{ fontSize: 13, fontFamily: "'Euclid Circular A', sans-serif", fontWeight: 400, color: palette.gray.dark4, lineHeight: '20px', margin: 0, width: 179 }}>
                Upgrade to a M2 cluster for $9 a month and get 2 GB of storage and daily backups.
              </p>
              {/* @ts-ignore - React 19 polymorphic type mismatch */}
              <Button size="small" variant="primary">Upgrade</Button>
            </div>
          </div>

          {/* Vertical divider between upgrade panel and metrics */}
          <div style={{ width: 1, background: palette.gray.light2, margin: '0 20px', alignSelf: 'stretch' }} />

          {/* 4 metric panels — order: R/W · Connections · In/Out · Data Size */}
          <div style={{ display: 'flex', flex: 1, gap: 0 }}>

            {/* Panel 1: R/W — dots + values in title rows */}
            <MiniSparkline
              lines={[
                { label: 'R', color: palette.blue.base, value: '0', showDot: true },
                { label: 'W', color: '#F9A53A', showDot: true },
              ]}
              unit="100/s"
              tooltip="Number of read and write operations per second on this cluster."
            />
            <div style={{ width: 1, background: palette.gray.light2, alignSelf: 'stretch' }} />

            {/* Panel 2: Connections */}
            <MiniSparkline
              lines={[{ label: 'Connections', color: palette.blue.base, value: '0', showDot: false }]}
              unit="100/s"
              tooltip="Current number of active client connections to this cluster."
            />
            <div style={{ width: 1, background: palette.gray.light2, alignSelf: 'stretch' }} />

            {/* Panel 3: In/Out — dots + value for "In" in title rows */}
            <MiniSparkline
              lines={[
                { label: 'In', color: '#F97A5A', value: '0.0 KB/s', showDot: true },
                { label: 'Out', color: '#F9A53A', showDot: true },
              ]}
              unit="100/s"
              tooltip="Network throughput flowing in and out of this cluster per second."
            />
            <div style={{ width: 1, background: palette.gray.light2, alignSelf: 'stretch' }} />

            {/* Panel 4: Data Size */}
            <MiniSparkline
              lines={[{ label: 'Data Size', color: '#43B1E5', value: '0 GB', showDot: false }]}
              unit="100/s"
              tooltip="Total uncompressed size of all data stored across collections in this cluster."
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: palette.gray.light2 }} />

      {/* ── Bottom section (light gray bg) ── */}
      <div style={{ background: palette.gray.light3, borderTop: `1px solid ${palette.gray.light2}`, borderRadius: '0 0 24px 24px', padding: '12px 24px' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <MetaField label="Version" value="5.0" />
          <MetaField label="Region" value="AWS / N. Virginia (us-east-1)" />
          <MetaField label="Cluster Tier" value="M0 Sandbox (General)" />
          <MetaField label="Type" value="Replica Set - 3 nodes" />
          <MetaField label="Backups" value="Inactive" />
          <MetaField label="Linked App Services" value="None Linked" />
          <MetaField label="Atlas Search" value="Create Index" isLink />
        </div>
      </div>
    </div>
  )
}
