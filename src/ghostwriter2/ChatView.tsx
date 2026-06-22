import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@leafygreen-ui/button'
import { Badge } from '@leafygreen-ui/badge'
import { Card } from '@leafygreen-ui/card'
import { Body } from '@leafygreen-ui/typography'
import TextInput from '@leafygreen-ui/text-input'
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

const FULL_BLOG = `## Building Production RAG: What We Got Wrong (And How to Fix It)

When we started building our RAG pipeline at scale, the first thing we broke was our own assumption about what "vector search" actually means in production. The index strategy that works in a demo is rarely the one that survives 10 million embeddings and three rounds of model retraining.

This post covers the three decisions that will define your Atlas Vector Search deployment — and the failure mode that comes with getting each one wrong.

### 1. Index granularity isn't about performance, it's about accuracy

Most teams create one vector index per collection. That works until your documents are long enough that a single embedding loses the nuance at paragraph level. The fix is chunking — but chunking strategy is a product decision as much as an engineering one.

What we got wrong: We chunked at fixed character counts, which split sentences mid-thought. Semantic chunking by paragraph or logical section dramatically improved retrieval precision.

### 2. The embedding model you start with isn't the one you'll finish with

Model upgrades are a fact of life. Atlas lets you run multiple vector indexes on the same collection, which means you can test a new model in parallel before committing.

What we got wrong: We didn't design for model versioning. The migration cost us two weeks of engineering time.

### 3. Hybrid search beats pure vector search for most real-world queries

Pure vector search excels at semantic similarity. Full-text search excels at exact matches, named entities, and recent content. Atlas Search supports $vectorSearch combined with traditional query operators — and that combination is usually the right answer.

The result: Precision improved by 31% when we added a full-text filter to our vector queries for product-specific terms.

---

Ready to implement? The MongoDB Atlas Vector Search quickstart covers the index setup in under 20 minutes.`

const FULL_LINKEDIN = `Post 1 / 5
🧵 Most RAG implementations I review are one ops incident away from a bad time.

Here's the Atlas Vector Search setup that actually holds up in production — covering index strategy, embedding pipeline, and query tuning. Five posts. Real lessons.

---

Post 2 / 5
Chunking strategy is a product decision, not just an engineering one.

Fixed-size chunking is fast to implement. It's also the fastest way to get retrieval that feels "almost right" but never quite clicks for users.

Semantic chunking — splitting at paragraph or logical section boundaries — takes more work upfront and meaningfully improves precision. Do it before you have 10M embeddings to rebuild.

---

Post 3 / 5
The embedding model you start with isn't the one you'll finish with.

Model upgrades happen. Atlas lets you maintain multiple vector indexes on the same collection. Test a new model without touching production. Commit when you're confident.

This sounds minor — it saved us two weeks during our last model migration.

---

Post 4 / 5
Hybrid search > pure vector search for most real-world queries.

Vector search is excellent at semantic similarity. Full-text search is excellent at exact terms, named entities, and recent content.

Most production queries need both. $vectorSearch + traditional query operators in the same pipeline. Our precision improved 31% when we stopped treating these as competing approaches.

---

Post 5 / 5
The operational argument for keeping vectors and documents in the same cluster:

→ No sync lag between your document store and vector store
→ One connection string, one SDK, one monitoring dashboard
→ Transactional consistency on document + embedding updates

Two systems means two places for drift. MongoDB Atlas Vector Search.`

const FULL_EMAIL = `Email 1 of 2

Subject: The RAG architecture decision you'll regret later
Preview text: Most teams hit this wall at month three.

---

Most teams get three months into their RAG pipeline before they hit the wall: embedding drift, index rebuilds at 3am, and a vector database that scales on a completely different curve than everything else in the stack.

The teams who avoid this made one architectural decision early: they kept their vectors and their operational data in the same database.

Here's why that matters — and how Atlas Vector Search makes it practical.

The core problem with separate vector databases

When your embedding model updates (and it will), you need to rebuild your index. If your vectors live in a separate system from your documents, that rebuild requires coordinating two pipelines, two monitoring setups, and two places where things can go wrong.

With Atlas Vector Search, your vectors are indexes on your existing collections. Model update? Rebuild the index, not the architecture.

---

Email 2 of 2  (sent 7 days later)

Subject: The hybrid search pattern that improved our precision by 31%
Preview text: Pure vector search isn't always the right answer.

---

Last week I covered the operational case for keeping vectors and documents together. Today: the query pattern that took our retrieval from "pretty good" to "actually useful."

Pure vector search excels at semantic similarity. Full-text search excels at exact terms, brand names, and recent content. Most production RAG queries need both.

The Atlas approach: $vectorSearch combined with standard query operators in the same aggregation pipeline. One query. Both signal types. Measurably better results.`

const OUTPUT_CARDS = [
  {
    type: 'Blog Post', badge: 'green' as const, meta: '1,247 words · 5 min read',
    title: 'Building Production RAG: What We Got Wrong (And How to Fix It)',
    fullContent: FULL_BLOG,
    preview: 'When we started building our RAG pipeline, the first thing we broke was our own assumption about what "vector search" actually means in production. Here\'s what we wish someone had told us.',
  },
  {
    type: 'LinkedIn Thread', badge: 'blue' as const, meta: '5 posts · Engineering Leads',
    title: 'The production RAG setup that actually holds up',
    fullContent: FULL_LINKEDIN,
    preview: '🧵 Most teams building RAG apps get vector search wrong in production. Here\'s what we learned after deploying at scale — and what you can do differently →',
  },
  {
    type: 'Email Sequence', badge: 'yellow' as const, meta: '2 emails · 7-day cadence',
    title: 'The RAG architecture decision you\'ll regret later',
    fullContent: FULL_EMAIL,
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
  const [previewCard, setPreviewCard]     = useState<string | null>(null)
  const [submittedCards, setSubmittedCards] = useState<string[]>([])
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

  const handleSubmit = useCallback((cardType: string) => {
    setSubmittedCards(prev => [...prev, cardType])
    setPreviewCard(null)
    addMsg('assistant', `Your ${cardType} draft has been submitted for review. Typical turnaround is 1–2 business days — you'll be notified when it's approved.`)
  }, [addMsg])

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      overflow: 'hidden', background: palette.white,
      position: 'relative',
    }}>
      <style>{`
        @keyframes gw-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* Message list */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '32px 0 16px' }}>
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
                {OUTPUT_CARDS.map(card => {
                  const isSubmitted = submittedCards.includes(card.type)
                  return (
                    <Card key={card.type} style={{ padding: '18px 20px' }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: 10,
                      }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <Badge variant={card.badge}>{card.type}</Badge>
                          {isSubmitted && <Badge variant="green">Submitted</Badge>}
                        </div>
                        <Body style={{ fontSize: 11, color: palette.gray.dark1 } as React.CSSProperties}>
                          {card.meta}
                        </Body>
                      </div>
                      <Body style={{
                        fontSize: 12, color: palette.gray.dark1, lineHeight: 1.65,
                        fontStyle: 'italic', marginBottom: 14,
                      } as React.CSSProperties}>
                        "{card.preview.length > 130 ? card.preview.slice(0, 130) + '…' : card.preview}"
                      </Body>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button variant="default" size="xsmall" onClick={() => setPreviewCard(card.type)}>
                          Preview draft
                        </Button>
                        {!isSubmitted && (
                          <Button variant="primary" size="xsmall" onClick={() => handleSubmit(card.type)}>
                            Submit for Review →
                          </Button>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </InteractionRow>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Draft preview overlay */}
      {previewCard && (() => {
        const card = OUTPUT_CARDS.find(c => c.type === previewCard)!
        const isSubmitted = submittedCards.includes(card.type)
        return (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 40,
            background: palette.white,
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 28px', borderBottom: `1px solid ${palette.gray.light2}`,
              display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Badge variant={card.badge}>{card.type}</Badge>
                  <Body style={{ fontSize: 11, color: palette.gray.dark1 } as React.CSSProperties}>
                    {card.meta}
                  </Body>
                  {isSubmitted && <Badge variant="green">Submitted</Badge>}
                </div>
                <Body style={{ fontWeight: 600, color: palette.black, fontSize: 14 } as React.CSSProperties}>
                  {card.title}
                </Body>
              </div>
              <button
                onClick={() => setPreviewCard(null)}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none',
                  background: palette.gray.light2, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: palette.gray.dark1, flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '32px 28px' }}>
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <pre style={{
                  color: palette.black, fontSize: 13, lineHeight: 1.85,
                  fontFamily: "'Euclid Circular A', sans-serif",
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
                }}>
                  {card.fullContent}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 28px', borderTop: `1px solid ${palette.gray.light2}`,
              display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0,
            }}>
              <Button variant="default" onClick={() => setPreviewCard(null)}>
                ← Back to chat
              </Button>
              {isSubmitted ? (
                <Body style={{ fontSize: 13, color: palette.green.dark2, fontWeight: 600 } as React.CSSProperties}>
                  ✓ Submitted for review
                </Body>
              ) : (
                <Button variant="primary" onClick={() => handleSubmit(card.type)}>
                  Submit for Review →
                </Button>
              )}
            </div>
          </div>
        )
      })()}

      {/* Text input — only active for the campaign name step */}
      <div style={{
        borderTop: `1px solid ${palette.gray.light2}`,
        padding: '14px 28px', background: palette.white, flexShrink: 0,
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <TextInput
              ref={inputRef}
              aria-label="Campaign name"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleNameSubmit() }}
              placeholder={
                stage === 'awaiting_name'
                  ? 'Name your campaign…'
                  : 'Use the options above to respond'
              }
              disabled={stage !== 'awaiting_name'}
            />
          </div>
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
