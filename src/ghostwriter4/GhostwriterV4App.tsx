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
      {/* Nav */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', padding: '0 28px',
        height: 52, zIndex: 20,
        background: view === 'landing' ? 'transparent' : palette.white,
        borderBottom: view !== 'landing' ? `1px solid ${palette.gray.light2}` : 'none',
        transition: 'background 0.2s, border-color 0.2s',
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
            transition: 'color 0.2s',
          }}>
            Ghostwriter
          </span>
        </button>

        <div style={{ flex: 1 }} />

      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, paddingTop: view !== 'landing' ? 52 : 0 }}>
        {view === 'landing' && <LandingPageV4 onGetStarted={() => setView('editor')} />}
        {view === 'editor'  && <FocusFlow onViewHistory={() => setView('history')} />}
        {view === 'history' && <PackageHistoryV4 onBack={() => setView('editor')} />}
      </div>
    </div>
  )
}
