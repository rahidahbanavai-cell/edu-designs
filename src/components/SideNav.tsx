import Icon from '@leafygreen-ui/icon'
import { Badge } from '@leafygreen-ui/badge'
import { palette } from '../tokens'

const OVERLINE: React.CSSProperties = {
  fontSize: 12,
  fontFamily: "'Euclid Circular A', sans-serif",
  fontWeight: 600,
  color: palette.green.dark2,
  letterSpacing: '0.4px',
  textTransform: 'uppercase',
  lineHeight: '16px',
  margin: 0,
}

const NAV_ITEM: React.CSSProperties = {
  fontSize: 13,
  fontFamily: "'Euclid Circular A', sans-serif",
  fontWeight: 400,
  color: palette.black,
  lineHeight: '20px',
  margin: 0,
  flex: 1,
}

function SectionHeader({ glyph, label }: { glyph: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '15px 16px 8px', width: 184, overflow: 'hidden' }}>
      {/* @ts-ignore - React 19 polymorphic type mismatch */}
      <Icon glyph={glyph} fill={palette.green.dark2} />
      <span style={OVERLINE}>{label}</span>
    </div>
  )
}

function NavItem({ label, active = false, badge }: { label: string; active?: boolean; badge?: string }) {
  return (
    <div style={{ position: 'relative', height: 32, width: 184, display: 'flex', alignItems: 'center', background: active ? palette.green.light3 : 'transparent' }}>
      {active && (
        <div style={{ position: 'absolute', left: 0, top: 5, height: 22, width: 4, background: palette.green.dark1, borderRadius: '0 6px 6px 0' }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', width: '100%' }}>
        <span style={{ ...NAV_ITEM, fontWeight: active ? 600 : 400, color: active ? palette.green.dark2 : palette.black }}>
          {label}
        </span>
        {badge && (
          <Badge variant="green">{badge}</Badge>
        )}
      </div>
    </div>
  )
}

export function SideNav() {
  return (
    <div style={{
      position: 'fixed',
      top: 108,
      left: 0,
      width: 200,
      height: 'calc(100vh - 108px)',
      background: palette.gray.light3,
      paddingRight: 16,
      overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 8 }}>
        {/* DEPLOYMENT */}
        <SectionHeader glyph="Laptop" label="Deployment" />
        <NavItem label="Database" active />
        <div style={{ position: 'relative', height: 32, width: 184, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', width: '100%' }}>
            <span style={NAV_ITEM}>Data Lake</span>
            <Badge variant="green">Free</Badge>
          </div>
        </div>

        {/* DATA SERVICES */}
        <SectionHeader glyph="Laptop" label="Data Services" />
        {['Triggers', 'Data API', 'Data Federation'].map(item => (
          <NavItem key={item} label={item} />
        ))}

        {/* SECURITY */}
        <SectionHeader glyph="Lock" label="Security" />
        {['Quickstart', 'Database Access', 'Network Access', 'Advanced'].map(item => (
          <NavItem key={item} label={item} />
        ))}

        {/* Divider */}
        <div style={{ height: 24, width: 184 }} />
        <div style={{ height: 1, width: 184, background: palette.gray.light2, margin: '0' }} />

        {/* New on Atlas */}
        <div style={{ position: 'relative', height: 32, width: 184, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', width: '100%' }}>
            <span style={NAV_ITEM}>New on Atlas</span>
            <Badge variant="green">Free</Badge>
          </div>
        </div>
        <NavItem label="Goto" />
      </div>

      {/* Collapse button */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        right: 0,
        background: palette.white,
        border: `1px solid ${palette.gray.light2}`,
        borderRadius: 32,
        padding: 8,
        boxShadow: '0px 3px 2px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}>
        {/* @ts-ignore - React 19 polymorphic type mismatch */}
        <Icon glyph="ChevronLeft" />
      </div>
    </div>
  )
}
