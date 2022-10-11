import Layout from "components/Layout";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps & { pageProps: any }) {
  return (
    <SessionProvider session={pageProps.session} basePath="/server/api/auth">
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: "dark" }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </SessionProvider>
  );
}

export default MyApp;
