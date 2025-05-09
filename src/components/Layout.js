import { Sora } from "next/font/google";
import Head from "next/head";
import BottomNav from "./BottomNav";
import Curve from "./Curve";
import Header from "./Header";

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800']
});

export default function Layout({ children }) {
  return (
    <div className={`layout ${sora.variable}`}>
      <Head>
        <title>ByteProwler</title>
        <meta name="description" content="Coding Ideas to Life" />
        <meta name="keywords" content="html, tailwindcss, js, javascript" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="ByteProwler - Coding Ideas to Life" />
        <meta
          property="og:description"
          content="Where Coding Meets Creativity, Every Byte Counts Toward a Terabyte."
        />
        <meta property="og:image" content="/byteprowler.jpeg" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ByteProwler - Coding Ideas to Life" />
        <meta
          name="twitter:description"
          content="Where Coding Meets Creativity, Small Steps Lead to Gigantic Results."
        />
        <meta name="twitter:image" content="/byteprowler.jpeg" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
      </Head>
      <BottomNav />
      <Header />
      {/* <Curve /> */}
      {children}
    </div>
  );
}
