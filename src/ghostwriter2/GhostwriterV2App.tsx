import { useState } from 'react'
import { MongoDBLogoMark } from '@leafygreen-ui/logo'
import { Badge } from '@leafygreen-ui/badge'
import { Button } from '@leafygreen-ui/button'
import { Overline } from '@leafygreen-ui/typography'
import { palette } from '../tokens'
import { ChatView } from './ChatView'

const pastPackages = [
  { name: 'Atlas Search — Q2 Launch', status: 'Approved', variant: 'green' as const },
  { name: 'Vector Search for Beginners', status: 'Published', variant: 'blue' as const },
  { name: 'Agentic Apps Playbook', status: 'Published', variant: 'blue' as const },
]

export function GhostwriterV2App() {
  const [chatKey, setChatKey] = useState(0)

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: "'Euclid Circular A', sans-serif", background: palette.white,
    }}>
      {/* Nav */}
      <nav style={{
        height: 56, borderBottom: `1px solid ${palette.gray.light2}`,
        display: 'flex', alignItems: 'center', padding: '0 24px',
        flexShrink: 0, background: palette.white, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* @ts-ignore */}
          <MongoDBLogoMark height={24} />
          <span style={{ fontSize: 15, fontWeight: 700, color: palette.black,
            fontFamily: "'Euclid Circular A', sans-serif" }}>
            Ghostwriter
          </span>
          <Badge variant="green">Chat</Badge>
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="default" onClick={() => setChatKey(k => k + 1)}>
          + New Package
        </Button>
      </nav>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{
          width: 260, borderRight: `1px solid ${palette.gray.light2}`,
          padding: '20px 16px', overflowY: 'auto', flexShrink: 0,
          background: palette.gray.light3,
        }}>
          <Overline style={{ display: 'block', marginBottom: 12 }}>PACKAGES</Overline>

          {/* Active package */}
          <div style={{
            borderRadius: 8, padding: '12px 14px', marginBottom: 4,
            background: palette.white,
            border: `1px solid ${palette.green.dark1}`,
            cursor: 'pointer',
          }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: palette.black, marginBottom: 8,
              fontFamily: "'Euclid Circular A', sans-serif", lineHeight: 1.4,
            }}>
              AI Native Developer Campaign — Q2 2026
            </div>
            <Badge variant="yellow">In Progress</Badge>
          </div>

          {/* Past packages */}
          {pastPackages.map(pkg => (
            <div
              key={pkg.name}
              style={{ borderRadius: 8, padding: '12px 14px', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = palette.white)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                fontSize: 12, color: palette.gray.dark3, marginBottom: 8, lineHeight: 1.4,
                fontFamily: "'Euclid Circular A', sans-serif",
              }}>
                {pkg.name}
              </div>
              <Badge variant={pkg.variant}>{pkg.status}</Badge>
            </div>
          ))}
        </aside>

        {/* Chat panel */}
        <ChatView key={chatKey} />
      </div>
    </div>
  )
}
