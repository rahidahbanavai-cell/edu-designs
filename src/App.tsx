import { Button } from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import { TextInput } from '@leafygreen-ui/text-input'
import { palette } from './tokens'
import { useState } from 'react'
import { TopNav } from './components/TopNav'
import { SideNav } from './components/SideNav'
import { ClusterCard } from './components/ClusterCard'

export default function App() {
  const [search, setSearch] = useState('')

  return (
    <div style={{ background: palette.white, minHeight: '100vh', fontFamily: "'Euclid Circular A', sans-serif" }}>
      <TopNav />

      <div style={{ display: 'flex', paddingTop: 108 }}>
        <SideNav />

        {/* Main content area */}
        <main style={{ marginLeft: 217, flex: 1, padding: '29px 24px 40px', maxWidth: 1063 }}>

          {/* Breadcrumb */}
          <p style={{
            fontSize: 12,
            fontFamily: "'Euclid Circular A', sans-serif",
            fontWeight: 600,
            color: palette.blue.base,
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            lineHeight: '16px',
            margin: '0 0 8px',
          }}>
            LeafyCorp &nbsp;&rsaquo;&nbsp; Greenery
          </p>

          {/* Page title */}
          <h1 style={{
            fontFamily: "'MongoDB Value Serif', serif",
            fontWeight: 400,
            fontSize: 32,
            lineHeight: '40px',
            color: palette.green.dark2,
            margin: '0 0 16px',
          }}>
            Database Deployments
          </h1>

          {/* Search + Create row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, width: '100%' }}>
            <div style={{ position: 'relative', width: 260 }}>
              {/* @ts-ignore - React 19 polymorphic type mismatch */}
              <TextInput
                aria-label="Find a database deployment"
                placeholder="Find a database deployment"
                value={search}
                onChange={e => setSearch(e.target.value)}
                sizeVariant="default"
              />
              {/* Magnifying glass icon overlaid on the right edge of the input */}
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                {/* @ts-ignore - React 19 polymorphic type mismatch */}
                <Icon glyph="MagnifyingGlass" size="small" fill="#889397" />
              </div>
            </div>
            {/* @ts-ignore - React 19 polymorphic type mismatch */}
            <Button variant="primary" leftGlyph={<Icon glyph="Plus" />}>
              Create
            </Button>
          </div>

          {/* Cluster card */}
          <ClusterCard />
        </main>
      </div>
    </div>
  )
}
