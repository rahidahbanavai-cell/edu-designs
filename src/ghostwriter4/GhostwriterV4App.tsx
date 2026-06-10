import { MongoDBLogoMark } from '@leafygreen-ui/logo'
import { palette } from '../tokens'
import { FocusFlow } from './FocusFlow'

export function GhostwriterV4App() {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: "'Euclid Circular A', sans-serif",
      background: palette.white, overflow: 'hidden',
    }}>
      {/* Minimal fixed nav */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', padding: '18px 32px',
        zIndex: 20, pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'all' }}>
          {/* @ts-ignore */}
          <MongoDBLogoMark height={22} />
          <span style={{
            fontSize: 14, fontWeight: 700, color: palette.black,
            fontFamily: "'Euclid Circular A', sans-serif",
          }}>
            Ghostwriter
          </span>
        </div>
      </div>

      <FocusFlow />
    </div>
  )
}
