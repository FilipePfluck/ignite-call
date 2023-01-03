import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },

  '::-webkit-scrollbar': {
    width: 12,
  },
  '::-webkit-scrollbar-track': {
    background: '$gray800',
  },
  '::-webkit-scrollbar-thumb': {
    background: '$gray600',
    borderRadius: 6,
  },
})
