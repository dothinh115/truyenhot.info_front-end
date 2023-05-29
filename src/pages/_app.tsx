import { MainLayout } from "@/layouts";
import { MyAppProps } from "@/models";
import { API } from "@/utils/config";
import createEmotionCache from "@/utils/createEmotionCache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { SWRConfig } from "swr/_internal";
import "../style/style.scss";

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
        <meta charSet="utf-8" />
      </Head>
      <CssBaseline />
      <SWRConfig
        value={{
          shouldRetryOnError: false,
          revalidateOnFocus: false,
          revalidateIfStale: false,
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
