import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
      ui_host: "https://eu.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      persistence: "memory",
      // Enable debug mode in development
      loaded: (posthog) => {
        if (
          process.env.NODE_ENV === "development" ||
          process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
        )
          posthog.debug();
      },
    });

    const handleRouteChange = () => posthog?.capture("$pageview");

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="application-name" content="Wannmaschinefrei" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wannmaschinefrei" />
        <meta
          name="description"
          content="Schau ob eine Maschine im Keller frei ist!"
        />
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
        <meta
          property="og:description"
          content="Schau ob eine Maschine im Keller frei ist!"
        />
        <meta property="og:site_name" content="Wannmaschinefrei" />
        <meta property="og:url" content="https://www.wannmaschinefrei.de/" />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <PostHogProvider client={posthog}>
        <Component {...pageProps} />
      </PostHogProvider>
    </>
  );
}

export default MyApp;
