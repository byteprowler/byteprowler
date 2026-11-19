/* eslint-disable @next/next/no-html-link-for-pages -- The return link opens the terminal as a full page. */
import Head from "next/head";
import ChibiScene from "../components/chibi/ChibiScene";
import Room from "../components/chibi/Room";
import styles from "../components/chibi/world.module.css";

export default function ExperimentalPage() {
  return (
    <>
      <Head>
        <title>Joshua’s Little Workshop | ByteProwler</title>
        <meta name="description" content="An interactive 2D portfolio experiment by Joshua Ogo." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className={styles.world}>
        <header className={styles.header}>
          <div>
            <span>BYTEPROWLER <b aria-hidden="true">{"//"}</b> WORKSHOP</span>
            <h1>Joshua’s Little Workshop</h1>
          </div>
          <a href="/">← Return to terminal</a>
        </header>
        <ChibiScene room={<Room />} />
      </main>
    </>
  );
}
