import { color } from '@leafygreen-ui/tokens'

const l = color.light

// Named color tokens sourced directly from @leafygreen-ui/tokens color.light
export const palette = {
  // Greens
  green: {
    dark2:  l.text.success.default,         // #00684A
    dark1:  l.border.success.default,       // #00A35C
    light3: l.background.success.default,   // #E3FCF7
    light2: '#C0FAE6',
  },
  // Grays
  gray: {
    light3: l.background.secondary.default, // #F9FBFA
    light2: l.border.secondary.default,     // #E8EDEB
    light1: '#C1C7C6',
    base:   '#889397',
    dark1:  l.text.secondary.default,       // #5C6C75
    dark3:  '#1C2D38',
    dark4:  '#112733',
  },
  // Blues
  blue: {
    base:   l.border.info.default,          // #016BF8
    dark1:  '#1254B7',
    light3: '#E1F7FF',
    light2: '#C3E7FE',
  },
  // Neutrals
  black:  l.text.primary.default,           // #001E2B
  white:  l.background.primary.default,     // #FFFFFF
  red:    '#DB3030',
}
