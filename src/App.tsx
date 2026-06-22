import { GhostwriterApp } from './ghostwriter/GhostwriterApp'
import { GhostwriterV2App } from './ghostwriter2/GhostwriterV2App'
import { GhostwriterV3App } from './ghostwriter3/GhostwriterV3App'
import { GhostwriterV4App } from './ghostwriter4/GhostwriterV4App'
import { GhostwriterV5App } from './ghostwriter5/GhostwriterV5App'

const version = new URLSearchParams(window.location.search).get('v')

export default function App() {
  if (version === '2') return <GhostwriterV2App />
  if (version === '3') return <GhostwriterV3App />
  if (version === '4') return <GhostwriterV4App />
  if (version === '5') return <GhostwriterV5App />
  return <GhostwriterApp />
}
