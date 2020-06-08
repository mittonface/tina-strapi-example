import { TinaCMS, TinaProvider } from "tinacms";

export default function MyApp({ Component, pageProps }) {
  const cms = new TinaCMS({ sidebar: { hidden: true } });
  return (
    <TinaProvider cms={cms}>
      <Component {...pageProps} />
    </TinaProvider>
  );
}
