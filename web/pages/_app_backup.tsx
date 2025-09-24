import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Head from 'next/head'
import { AuthProvider } from '../contexts/AuthContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head />
      <Component {...pageProps} />
    </AuthProvider>
  )
}
