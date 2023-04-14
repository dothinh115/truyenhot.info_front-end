import { MainLayout } from "@/layouts";
import { AppPropsWithLayout } from "@/models";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? MainLayout;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
