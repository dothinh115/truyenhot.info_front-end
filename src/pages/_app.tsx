import { MainLayout } from "@/layouts";
import { MyAppProps } from "@/models";
import { API } from "@/utils/config";
import createEmotionCache from "@/utils/createEmotionCache";
import { getDesignTokens } from "@/utils/theme";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Head from "next/head";
import { SWRConfig } from "swr/_internal";
import "../style/style.scss";
import "react-quill/dist/quill.snow.css";
import { useEffect } from "react";
import NProgress from "nprogress";
import { useRouter } from "next/router";

const clientSideEmotionCache = createEmotionCache();
NProgress.configure({ showSpinner: false, speed: 500 });
export const NProgressStart = () => NProgress.start();
export const NProgressDone = () => NProgress.done();
export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) {
  const Layout = Component.Layout ?? MainLayout;
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", NProgressStart);
    router.events.on("routeChangeComplete", NProgressDone);
    router.events.on("routeChangeError", NProgressDone);

    return () => {
      router.events.off("routeChangeStart", NProgressStart);
      router.events.off("routeChangeComplete", NProgressDone);
      router.events.off("routeChangeError", NProgressDone);
    };
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <SWRConfig
        value={{
          shouldRetryOnError: false,
          revalidateOnFocus: false,
          fetcher: (url) => API.get(url),
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </CacheProvider>
  );
}
