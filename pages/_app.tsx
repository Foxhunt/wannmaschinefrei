import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <meta name="application-name" content="Wannmaschinefrei" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Wannmaschinefrei" />
      <meta name="description" content="Schau ob eine Maschine im Keller frei ist!" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#2B5797" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#000000" />

      <link rel="icon" type="image/png" sizes="144x144" href="icon-144.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="icon-512.png" />
      <link rel="apple-touch-icon" href="/icon-512.png"></link>
      <link rel="manifest" href="/manifest.json" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content="Wannmaschinefrei" />
      <meta property="og:description" content="Schau ob eine Maschine im Keller frei ist!" />
      <meta property="og:site_name" content="Wannmaschinefrei" />
      <meta property="og:url" content="https://www.wannmaschinefrei.de/" />

      <meta
        name='viewport'
        content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
      />

    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
