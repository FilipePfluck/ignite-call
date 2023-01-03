import { Heading, styled, Text } from '@ignite-ui/react'

export const Container = styled('div', {
  maxWidth: 852,
  padding: '0 $4',
  margin: '$10 auto $4',
})

export const UserHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '>div': {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '$6',
  },

  [`> ${Heading}`]: {
    lineHeight: 'base',
    marginTop: '$8',

    '@media(max-width: 900px)': {
      fontSize: '$6',
    },
  },

  [`> ${Text}`]: {
    color: '$gray200',

    '@media(max-width: 900px)': {
      fontSize: '$4',
    },
  },
})
