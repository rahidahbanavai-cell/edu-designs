import Icon from '@leafygreen-ui/icon'
import { AtlasLogoLockup } from '@leafygreen-ui/logo'
import { palette } from '../tokens'

const txt: React.CSSProperties = {
  fontSize: 13,
  fontFamily: "'Euclid Circular A', sans-serif",
  fontWeight: 400,
  color: palette.black,
  whiteSpace: 'nowrap',
  margin: 0,
}

export function TopNav() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
      {/* ── Row 1: Org Nav (61px) ── */}
      <div style={{
        background: palette.white,
        height: 61,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: `1px solid ${palette.gray.light2}`,
      }}>
        {/* Left cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Atlas logo lockup */}
            {/* @ts-ignore - React 19 polymorphic type mismatch */}
            <AtlasLogoLockup height={32} />
            {/* Org selector */}
            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${palette.gray.light2}`, borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', background: palette.white }}>
                {/* @ts-ignore - React 19 polymorphic type mismatch */}
                <Icon glyph="Building" size="small" />
                <span style={{ ...txt, fontWeight: 600 }}>LeafyCorp</span>
                {/* @ts-ignore - React 19 polymorphic type mismatch */}
                <Icon glyph="CaretDown" size="small" />
              </div>
              <div style={{ width: 1, height: 30, background: palette.gray.light2 }} />
              <div style={{ padding: 7, background: palette.white }}>
                {/* @ts-ignore - React 19 polymorphic type mismatch */}
                <Icon glyph="Settings" size="small" />
              </div>
            </div>
          </div>
          {/* Org-level nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px 4px 10px', borderRadius: 6 }}>
              <span style={txt}>Access Manager</span>
              {/* @ts-ignore - React 19 polymorphic type mismatch */}
              <Icon glyph="CaretDown" size="small" />
            </div>
            <span style={txt}>Billing</span>
          </div>
        </div>
        {/* Right cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <span style={txt}>Admin</span>
          <span style={txt}>All Clusters</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px 4px 10px', borderRadius: 6 }}>
            <span style={txt}>Get Help</span>
            {/* @ts-ignore - React 19 polymorphic type mismatch */}
            <Icon glyph="CaretDown" size="small" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, border: `1px solid ${palette.gray.light2}`, borderRadius: 14, padding: '4px 10px 4px 16px', background: palette.white }}>
            <span style={txt}>Alex</span>
            {/* @ts-ignore - React 19 polymorphic type mismatch */}
            <Icon glyph="CaretDown" size="small" />
          </div>
        </div>
      </div>

      {/* ── Row 2: Project Nav (47px) ── */}
      <div style={{
        background: palette.white,
        height: 47,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        boxShadow: '0px 4px 2px rgba(0,30,43,0.1)',
      }}>
        {/* Left: project dropdown + tabs */}
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Project dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 0 23px', gap: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, width: 213, padding: '0 8px', background: palette.white, border: `1px solid ${palette.gray.light2}`, borderRadius: 5 }}>
              <div style={{ paddingTop: 1 }}>
                {/* @ts-ignore - React 19 polymorphic type mismatch */}
                <Icon glyph="Folder" size="small" />
              </div>
              <span style={{ ...txt, fontWeight: 600, flex: 1, color: palette.gray.dark3 }}>Greenery</span>
              {/* @ts-ignore - React 19 polymorphic type mismatch */}
              <Icon glyph="CaretDown" size="small" />
            </div>
            <div style={{ padding: 6, borderRadius: 22, cursor: 'pointer' }}>
              {/* @ts-ignore - React 19 polymorphic type mismatch */}
              <Icon glyph="VerticalEllipsis" size="small" />
            </div>
          </div>
          {/* Tab strip */}
          <div style={{ display: 'flex', alignItems: 'stretch', padding: '0 10px' }}>
            {/* Active tab: Data Services */}
            <div style={{ position: 'relative', width: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 2.5 }}>
              <span style={{ ...txt, fontWeight: 600, color: palette.green.dark2 }}>Data Services</span>
              <div style={{ position: 'absolute', bottom: 0, left: 5, right: 5, height: 2, background: palette.green.dark1, borderRadius: 4 }} />
            </div>
            {[['App Services'], ['Charts']].map(([label]) => (
              <div key={label} style={{ width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 2.5 }}>
                <span style={{ ...txt, color: palette.gray.dark3 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: icon group — InviteUser → ActivityFeed → Bell (with badge) */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 21px', gap: 24 }}>
          {/* @ts-ignore - React 19 polymorphic type mismatch */}
          <Icon glyph="InviteUser" size="small" style={{ color: palette.gray.dark1 }} />
          {/* @ts-ignore - React 19 polymorphic type mismatch */}
          <Icon glyph="ActivityFeed" size="small" style={{ color: palette.gray.dark1 }} />
          <div style={{ position: 'relative' }}>
            {/* @ts-ignore - React 19 polymorphic type mismatch */}
            <Icon glyph="Bell" size="small" style={{ color: palette.gray.dark1 }} />
            <div style={{ position: 'absolute', top: -4, right: -6, background: palette.red, borderRadius: '50%', width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, color: palette.white, fontWeight: 700, lineHeight: 1 }}>1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
