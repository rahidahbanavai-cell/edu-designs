import { useState } from 'react'
import { Button } from '@leafygreen-ui/button'
import { MongoDBLogoMark } from '@leafygreen-ui/logo'
import { palette } from '../tokens'
import { HomePage } from './HomePage'
import { WizardStep1 } from './WizardStep1'
import { WizardStep2 } from './WizardStep2'
import { WizardStep3 } from './WizardStep3'
import { DashboardView } from './DashboardView'

export type AppView = 'home' | 'step1' | 'step2' | 'step3' | 'dashboard'

export interface PackageForm {
  campaignName: string
  sources: string[]
  audience: string
  outputTypes: string[]
  tone: string
  additionalContext: string
}

const defaultForm: PackageForm = {
  campaignName: '',
  sources: [],
  audience: '',
  outputTypes: [],
  tone: '',
  additionalContext: '',
}

export function GhostwriterApp() {
  const [view, setView] = useState<AppView>('home')
  const [form, setForm] = useState<PackageForm>(defaultForm)

  const updateForm = (updates: Partial<PackageForm>) => {
    setForm(prev => ({ ...prev, ...updates }))
  }

  const startNew = () => {
    setForm(defaultForm)
    setView('step1')
  }

  const isWizard = view === 'step1' || view === 'step2' || view === 'step3'

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Euclid Circular A', sans-serif" }}>

      {/* Top nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: palette.white, borderBottom: `1px solid ${palette.gray.light2}`,
        display: 'flex', alignItems: 'center', padding: '0 32px', height: 56,
      }}>
        <button
          onClick={() => setView('home')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          {/* @ts-ignore */}
          <MongoDBLogoMark height={24} />
          <span style={{
            color: palette.black, fontSize: 15, fontWeight: 700,
            fontFamily: "'Euclid Circular A', sans-serif",
          }}>
            Ghostwriter
          </span>
        </button>

        {/* Breadcrumb for wizard */}
        {isWizard && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
            <span style={{ color: palette.gray.light1, fontSize: 16 }}>›</span>
            <span style={{ color: palette.gray.dark1, fontSize: 13 }}>
              {form.campaignName || 'New Package'}
            </span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setView('dashboard')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              color: view === 'dashboard' ? palette.green.dark2 : palette.gray.dark1,
              fontFamily: "'Euclid Circular A', sans-serif",
              padding: '4px 2px',
              borderBottom: view === 'dashboard' ? `2px solid ${palette.green.dark2}` : '2px solid transparent',
            }}
          >
            Dashboard
          </button>
          <Button variant="primary" onClick={startNew}>
            + New Package
          </Button>
        </div>
      </nav>

      <div style={{ paddingTop: 56 }}>
        {view === 'home'      && <HomePage      onStart={startNew} onDashboard={() => setView('dashboard')} />}
        {view === 'step1'     && <WizardStep1   form={form} updateForm={updateForm} onNext={() => setView('step2')} />}
        {view === 'step2'     && <WizardStep2   form={form} updateForm={updateForm} onBack={() => setView('step1')} onNext={() => setView('step3')} />}
        {view === 'step3'     && <WizardStep3   form={form} onBack={() => setView('step2')} onDone={() => setView('dashboard')} />}
        {view === 'dashboard' && <DashboardView onNew={startNew} />}
      </div>

    </div>
  )
}
