import { MongoDBLogoMark } from '@leafygreen-ui/logo'
import { Badge } from '@leafygreen-ui/badge'
import { palette } from '../tokens'
import { SplitView } from './SplitView'

export function GhostwriterV3App() {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: "'Euclid Circular A', sans-serif", background: palette.white,
    }}>
      <nav style={{
        height: 56, borderBottom: `1px solid ${palette.gray.light2}`,
        display: 'flex', alignItems: 'center', padding: '0 28px',
        flexShrink: 0, background: palette.white, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* @ts-ignore */}
          <MongoDBLogoMark height={24} />
          <span style={{
            fontSize: 15, fontWeight: 700, color: palette.black,
            fontFamily: "'Euclid Circular A', sans-serif",
          }}>
            Ghostwriter
          </span>
          <Badge variant="blue">Live Preview</Badge>
        </div>
      </nav>
      <SplitView />
    </div>
  )
}
