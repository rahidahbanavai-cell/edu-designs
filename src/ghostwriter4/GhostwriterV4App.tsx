import { useState } from 'react'
import { MongoDBLogoMark } from '@leafygreen-ui/logo'
import { Button } from '@leafygreen-ui/button'
import { palette } from '../tokens'
import { FocusFlow } from './FocusFlow'
import { LandingPageV4 } from './LandingPageV4'
import { PackageHistoryV4 } from './PackageHistoryV4'

type View = 'landing' | 'editor' | 'history'

export function GhostwriterV4App() {
  const [view, setView] = useState<View>('landing')

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: "'Euclid Circular A', sans-serif",
      background: palette.white, overflow: 'hidden',
    }}>
      {/* Nav — a flex item above the scroll container, so it never scrolls */}
      <div style={{
        flexShrink: 0, height: 52, zIndex: 20,
        display: 'flex', alignItems: 'center', padding: '0 28px',
        background: view === 'landing' ? palette.black : palette.white,
        borderBottom: view !== 'landing' ? `1px solid ${palette.gray.light2}` : 'none',
      }}>
        <button
          onClick={() => setView('landing')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          {/* @ts-ignore */}
          <MongoDBLogoMark height={22} />
          <span style={{
            fontSize: 14, fontWeight: 700,
            color: view === 'landing' ? palette.white : palette.black,
            fontFamily: "'Euclid Circular A', sans-serif",
          }}>
            Ghostwriter
          </span>
        </button>

        <div style={{ flex: 1 }} />
      </div>

      {/* Content — the only thing that scrolls */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {view === 'landing' && <LandingPageV4 onGetStarted={() => setView('editor')} />}
        {view === 'editor'  && <FocusFlow onViewHistory={() => setView('history')} />}
        {view === 'history' && <PackageHistoryV4 onBack={() => setView('editor')} />}
      </div>
    </div>
  )
}
