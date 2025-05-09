import "@/styles/globals.css"
import Layout from "@/components/Layout";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Curve from "@/components/Curve";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <Layout>
      <AnimatePresence mode="wait">
      <Curve />
    <Component key={router.route} {...pageProps} />
      </AnimatePresence>
  </Layout>
  )
}
