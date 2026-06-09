import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LeafyGreenProvider darkMode={false}>
      <App />
    </LeafyGreenProvider>
  </StrictMode>,
)
