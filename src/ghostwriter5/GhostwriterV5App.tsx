import { useState } from 'react'
import { MongoDBLogoMark } from '@leafygreen-ui/logo'
import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import { palette } from '../tokens'
import { SplitViewV5 } from './SplitViewV5'
import { LandingPageV5 as LandingPage } from './LandingPageV5'
import { PackageHistory } from '../ghostwriter3/PackageHistory'

type View = 'landing' | 'editor' | 'history'

export function GhostwriterV5App() {
  const [view, setView] = useState<View>('landing')
  const [editorDone, setEditorDone] = useState(false)
  const [editorStarted, setEditorStarted] = useState(false)
  const [editorSubmitted, setEditorSubmitted] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const handleStartNew = () => {
    setResetKey(k => k + 1)
    setEditorDone(false)
    setEditorStarted(false)
    setEditorSubmitted(false)
  }

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
        <button
          onClick={() => setView('landing')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          {/* @ts-ignore */}
          <MongoDBLogoMark height={24} />
          <span style={{
            fontSize: 15, fontWeight: 700, color: palette.black,
            fontFamily: "'Euclid Circular A', sans-serif",
          }}>
            Ghostwriter
          </span>
        </button>
        {view === 'editor' && <Badge variant="blue" style={{ marginLeft: 8 }}>Live Preview</Badge>}
        <div style={{ flex: 1 }} />

        {view === 'editor' && !editorSubmitted && editorDone && (
          <Button variant="default" onClick={handleStartNew}>Start New Package</Button>
        )}
        {view === 'history' && (
          <Button variant="default" onClick={() => setView('editor')}>Back to Editor</Button>
        )}
      </nav>

      {view === 'landing' && <LandingPage onGetStarted={() => setView('editor')} />}
      {view === 'editor'  && <SplitViewV5 key={resetKey} onViewHistory={() => setView('history')} onGenStageChange={stage => { setEditorDone(stage === 'done'); setEditorStarted(stage !== 'idle') }} onSubmittedChange={setEditorSubmitted} onStartNew={handleStartNew} />}
      {view === 'history' && <PackageHistory onBack={() => setView('editor')} />}
    </div>
  )
}
