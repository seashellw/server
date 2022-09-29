import { CssVarsProvider } from "@mui/joy/styles";
import Layout from "components/Layout";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps & { pageProps: any }) {
  return (
    <SessionProvider
      session={pageProps.session}
      basePath={process.env.NEXT_PUBLIC_AUTH_BASE_PATH}
    >
      <CssVarsProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CssVarsProvider>
    </SessionProvider>
  );
}

export default MyApp;
