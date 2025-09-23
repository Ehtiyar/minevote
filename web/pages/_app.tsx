import type { AppProps } from 'next/app'
import { ReactNode } from 'react'
import '../styles/globals.css'
import Head from 'next/head'
import { AuthProvider } from '../contexts/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head></Head>
      <Component {...pageProps} />
    </AuthProvider>
  )
}


