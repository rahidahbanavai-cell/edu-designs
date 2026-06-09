import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import { palette } from '../tokens'

type Stage =
  | 'awaiting_name'
  | 'awaiting_audience'
  | 'awaiting_formats'
  | 'awaiting_tone'
  | 'generating'
  | 'done'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const AUDIENCES = [
  'AI-Native Engineers',
  'Developer (General)',
  'Technical Executives',
  'Social Media Audience',
]

const FORMATS = [
  { id: 'blog',     label: 'Blog Post',       desc: '~1,200 words · Developer Blog · technical how-to' },
  { id: 'linkedin', label: 'LinkedIn Thread',  desc: '5 posts · Engineering Leads · MOFU positioning' },
  { id: 'email',    label: 'Email Sequence',   desc: '2 emails · 7 days apart · pain → proof → CTA' },
]

const TONES = ['Technical peer', 'Educational', 'Executive', 'Casual / social']

const OUTPUT_CARDS = [
  {
    type: 'Blog Post', badge: 'green' as const, meta: '1,247 words · 5 min read',
    preview: 'When we started building our RAG pipeline, the first thing we broke was our own assumption about what "vector search" actually means in production. Here\'s what we wish someone had told us.',
  },
  {
    type: 'LinkedIn Thread', badge: 'blue' as const, meta: '5 posts · Engineering Leads',
    preview: '🧵 Most teams building RAG apps get vector search wrong in production. Here\'s what we learned after deploying at scale — and what you can do differently →',
  },
  {
    type: 'Email Sequence', badge: 'yellow' as const, meta: '2 emails · 7-day cadence',
    preview: 'Subject: The RAG pattern that actually works in production\n\nMost developers I talk to have the same question after their first demo...',
  },
]

export function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [stage, setStage]       = useState<Stage>('awaiting_name')
  const [isThinking, setIsThinking] = useState(false)
  const [input, setInput]       = useState('')
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  const addMsg = useCallback((role: 'user' | 'assistant', text: string) => {
    setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, role, text }])
  }, [])

  const think = useCallback((fn: () => void, delay = 900) => {
    setIsThinking(true)
    setTimeout(() => { setIsThinking(false); fn() }, delay)
  }, [])

  // Opening message
  useEffect(() => {
    const t = setTimeout(() => {
      addMsg('assistant', "Hi! I'm Ghostwriter. Tell me about the campaign you're working on — what should I call this content package?")
    }, 500)
    return () => clearTimeout(t)
  }, [addMsg])

  // Auto-focus input when it becomes active
  useEffect(() => {
    if (stage === 'awaiting_name' && !isThinking) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [stage, isThinking])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking, stage, progress])

  // Generation progress
  useEffect(() => {
    if (stage !== 'generating') return
    let p = 0
    const id = setInterval(() => {
      p += 7 + Math.random() * 10
      if (p >= 100) {
        clearInterval(id)
        setProgress(100)
        setTimeout(() => {
          addMsg('assistant', "Your package is ready! Here are the three drafts — each tailored to AI-Native Engineers with a technical-peer voice.")
          setStage('done')
        }, 500)
      } else {
        setProgress(p)
      }
    }, 180)
    return () => clearInterval(id)
  }, [stage, addMsg])

  const handleNameSubmit = () => {
    const name = input.trim()
    if (!name) return
    addMsg('user', name)
    setInput('')
    think(() => {
      addMsg('assistant', `Got it — "${name}" it is. Who's the primary audience for this campaign?`)
      setStage('awaiting_audience')
    })
  }

  const handleAudience = (a: string) => {
    addMsg('user', a)
    think(() => {
      addMsg('assistant', 'Perfect. Which content formats do you need? Select all that apply, then hit Continue.')
      setStage('awaiting_formats')
    })
  }

  const toggleFormat = (id: string) => {
    setSelectedFormats(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const handleFormats = () => {
    if (!selectedFormats.length) return
    const labels = FORMATS.filter(f => selectedFormats.includes(f.id)).map(f => f.label)
    addMsg('user', labels.join(', '))
    setSelectedFormats([])
    think(() => {
      addMsg('assistant', "Great choices. Last question — what tone should I write in?")
      setStage('awaiting_tone')
    })
  }

  const handleTone = (t: string) => {
    addMsg('user', t)
    think(() => {
      addMsg('assistant', 'Got everything I need. Generating your content package now...')
      setStage('generating')
      setProgress(0)
    })
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      overflow: 'hidden', background: palette.white,
    }}>
      <style>{`
        @keyframes gw-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* Message list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 0 16px' }}>
        <div style={{ maxWidth: 680, width: '100%', margin: '0 auto', padding: '0 28px' }}>

          {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}

          {/* Thinking dots */}
          {isThinking && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'flex-start' }}>
              <Avatar />
              <div style={{
                padding: '10px 14px', borderRadius: '2px 12px 12px 12px',
                background: palette.gray.light3, display: 'flex', gap: 5, alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                    background: palette.gray.base,
                    animation: `gw-bounce 1.1s ${i * 0.18}s ease-in-out infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Audience chips */}
          {stage === 'awaiting_audience' && !isThinking && (
            <InteractionRow>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                {AUDIENCES.map(a => (
                  <QuickChip key={a} label={a} onClick={() => handleAudience(a)} />
                ))}
              </div>
            </InteractionRow>
          )}

          {/* Format checkboxes */}
          {stage === 'awaiting_formats' && !isThinking && (
            <InteractionRow>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 12 }}>
                {FORMATS.map(f => {
                  const on = selectedFormats.includes(f.id)
                  return (
                    <button key={f.id} onClick={() => toggleFormat(f.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${on ? palette.green.dark1 : palette.gray.light2}`,
                      background: on ? palette.green.light3 : palette.white,
                      textAlign: 'left', fontFamily: "'Euclid Circular A', sans-serif",
                      transition: 'all 0.12s',
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                        border: `2px solid ${on ? palette.green.dark1 : palette.gray.light1}`,
                        background: on ? palette.green.dark1 : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {on && <span style={{ color: palette.white, fontSize: 10, fontWeight: 700 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: palette.black, marginBottom: 2,
                          fontFamily: "'Euclid Circular A', sans-serif" }}>{f.label}</div>
                        <div style={{ fontSize: 11, color: palette.gray.dark1 }}>{f.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <Button variant="primary" disabled={!selectedFormats.length} onClick={handleFormats}>
                Continue →
              </Button>
            </InteractionRow>
          )}

          {/* Tone chips */}
          {stage === 'awaiting_tone' && !isThinking && (
            <InteractionRow>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                {TONES.map(t => (
                  <QuickChip key={t} label={t} onClick={() => handleTone(t)} />
                ))}
              </div>
            </InteractionRow>
          )}

          {/* Generation progress */}
          {stage === 'generating' && (
            <InteractionRow>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {FORMATS.map((f, i) => {
                  const done = progress > (i + 1) * 30
                  return (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        background: done ? palette.green.dark1 : palette.gray.light2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.3s',
                      }}>
                        {done && <span style={{ color: palette.white, fontSize: 9, fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{
                        fontSize: 13, fontFamily: "'Euclid Circular A', sans-serif",
                        color: done ? palette.black : palette.gray.dark1,
                        transition: 'color 0.3s',
                      }}>
                        {f.label}
                      </span>
                    </div>
                  )
                })}
                <div style={{
                  height: 4, borderRadius: 2, background: palette.gray.light2,
                  overflow: 'hidden', marginTop: 4,
                }}>
                  <div style={{
                    height: '100%', borderRadius: 2, background: palette.green.dark1,
                    width: `${progress}%`, transition: 'width 0.18s ease-out',
                  }} />
                </div>
              </div>
            </InteractionRow>
          )}

          {/* Output cards */}
          {stage === 'done' && (
            <InteractionRow>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                {OUTPUT_CARDS.map(card => (
                  <div key={card.type} style={{
                    border: `1px solid ${palette.gray.light2}`, borderRadius: 10,
                    padding: '18px 20px', background: palette.white,
                    boxShadow: '0 1px 4px rgba(0,30,43,0.06)',
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 10,
                    }}>
                      <Badge variant={card.badge}>{card.type}</Badge>
                      <span style={{ fontSize: 11, color: palette.gray.dark1,
                        fontFamily: "'Euclid Circular A', sans-serif" }}>
                        {card.meta}
                      </span>
                    </div>
                    <p style={{
                      fontSize: 12, color: palette.gray.dark1, lineHeight: 1.65,
                      fontStyle: 'italic', margin: '0 0 14px',
                      fontFamily: "'Euclid Circular A', sans-serif",
                    }}>
                      "{card.preview.length > 130 ? card.preview.slice(0, 130) + '…' : card.preview}"
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{
                        padding: '6px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer',
                        border: `1px solid ${palette.gray.light2}`, background: palette.white,
                        color: palette.gray.dark1, fontFamily: "'Euclid Circular A', sans-serif",
                        fontWeight: 500,
                      }}>
                        Preview draft
                      </button>
                      <button style={{
                        padding: '6px 14px', fontSize: 12, borderRadius: 6, cursor: 'pointer',
                        border: 'none', background: palette.green.dark2, color: palette.white,
                        fontFamily: "'Euclid Circular A', sans-serif", fontWeight: 500,
                      }}>
                        Submit for Review →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </InteractionRow>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Text input — only active for the campaign name step */}
      <div style={{
        borderTop: `1px solid ${palette.gray.light2}`,
        padding: '14px 28px', background: palette.white, flexShrink: 0,
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 10 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleNameSubmit() }}
            placeholder={
              stage === 'awaiting_name'
                ? 'Name your campaign…'
                : 'Use the options above to respond'
            }
            disabled={stage !== 'awaiting_name'}
            style={{
              flex: 1, height: 44, borderRadius: 8, fontSize: 14,
              padding: '0 14px', fontFamily: "'Euclid Circular A', sans-serif",
              border: `1px solid ${stage === 'awaiting_name' ? palette.green.dark1 : palette.gray.light2}`,
              background: stage !== 'awaiting_name' ? palette.gray.light3 : palette.white,
              color: palette.black, outline: 'none',
            }}
          />
          <Button
            variant="primary"
            disabled={stage !== 'awaiting_name' || !input.trim()}
            onClick={handleNameSubmit}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 10, marginBottom: 16, alignItems: 'flex-start',
    }}>
      {!isUser && <Avatar />}
      <div style={{
        maxWidth: '76%', padding: '10px 14px', fontSize: 13, lineHeight: 1.65,
        borderRadius: isUser ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
        background: isUser ? palette.green.dark2 : palette.gray.light3,
        color: isUser ? palette.white : palette.black,
        fontFamily: "'Euclid Circular A', sans-serif",
      }}>
        {msg.text}
      </div>
    </div>
  )
}

function Avatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
      background: palette.green.light3,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 700, color: palette.green.dark2,
      fontFamily: "'Euclid Circular A', sans-serif",
    }}>
      GW
    </div>
  )
}

function InteractionRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingLeft: 42, marginBottom: 20 }}>
      {children}
    </div>
  )
}

function QuickChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 18px', borderRadius: 20, cursor: 'pointer',
        border: `1px solid ${palette.green.dark1}`,
        background: palette.white, color: palette.green.dark2,
        fontSize: 13, fontWeight: 500,
        fontFamily: "'Euclid Circular A', sans-serif",
        transition: 'all 0.12s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = palette.green.dark1
        e.currentTarget.style.color = palette.white
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = palette.white
        e.currentTarget.style.color = palette.green.dark2
      }}
    >
      {label}
    </button>
  )
}
