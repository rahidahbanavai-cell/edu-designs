import { GhostwriterApp } from './ghostwriter/GhostwriterApp'
import { GhostwriterV2App } from './ghostwriter2/GhostwriterV2App'

const version = new URLSearchParams(window.location.search).get('v')

export default function App() {
  return version === '2' ? <GhostwriterV2App /> : <GhostwriterApp />
}
