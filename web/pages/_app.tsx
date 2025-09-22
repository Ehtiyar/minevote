import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Head from 'next/head'
import { AuthProvider } from '../contexts/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <link rel="preload" href="/assets/fonts/minecraft.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  )
}


