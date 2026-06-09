import { palette } from '../tokens'

const steps = [
  { num: 1, pill: 'INPUT',   label: 'Curated Knowledge',  sublabel: 'Sources & audience' },
  { num: 2, pill: 'PROCESS', label: 'Templates & Style',  sublabel: 'Formats & tone'     },
  { num: 3, pill: 'OUTPUT',  label: 'Tailored Content',   sublabel: 'Review & submit'    },
]

export function StepHeader({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{
      background: palette.white, borderBottom: `1px solid ${palette.gray.light2}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px 0', flexShrink: 0,
    }}>
      {steps.map((s, i) => {
        const active = i + 1 === step
        const done   = i + 1 < step
        return (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Step item */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 160 }}>
              {/* Circle + number */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: active ? palette.green.dark1 : done ? palette.green.light3 : palette.gray.light2,
                  border: `2px solid ${active ? palette.green.dark1 : done ? palette.green.dark1 : palette.gray.light1}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {done ? (
                    <span style={{ color: palette.green.dark2, fontSize: 14, fontWeight: 700, lineHeight: 1 }}>✓</span>
                  ) : (
                    <span style={{
                      color: active ? palette.white : palette.gray.base,
                      fontSize: 13, fontWeight: 700, lineHeight: 1,
                    }}>
                      {s.num}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: active ? 700 : done ? 600 : 400,
                    color: active ? palette.black : done ? palette.green.dark2 : palette.gray.base,
                    lineHeight: 1.2,
                  }}>
                    {s.label}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: active ? palette.gray.dark1 : palette.gray.base,
                    lineHeight: 1.3,
                    marginTop: 2,
                  }}>
                    {s.sublabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Connector line */}
            {i < 2 && (
              <div style={{
                width: 64, height: 2,
                background: done ? palette.green.dark1 : palette.gray.light2,
                marginBottom: 0, flexShrink: 0,
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
