import '../lib/dayjs'

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { globalStyles } from '../styles/global'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/react-query'
import { useEffect } from 'react'
import { DefaultSeo } from 'next-seo'

globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  useEffect(() => {
    const keys = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft']

    document.body.addEventListener('keyup', function (e) {
      if (keys.includes(e.key)) {
        document
          .getElementById('calendar-step')
          ?.classList.remove('no-focus-shadow')
      }
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pt_BR',
            // url: 'https://www.url.ie/',
            siteName: 'Ignite Call',
          }}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
