import styles from "./world.module.css";

export const workshopObjects = {
  laptop: {
    label: "Projects", cue: "Open project archive", source: "Laptop",
    description: "Open the archive for shipped work, live demos, and notes on how each project was built.",
    link: { href: "/projects", label: "Enter the archive" },
    reaction: "thinking",
  },
  bookshelf: {
    label: "About", cue: "Meet Joshua", source: "Bookshelf",
    description: "I’m Joshua Ogo, a frontend developer. I build accessible web apps, dashboards, and tools with React, Next.js, and TypeScript, and I’m expanding into full-stack systems.",
    link: { href: "/resumes/frontend-resume.pdf", label: "View my résumé" },
    reaction: "reading",
  },
  headphones: {
    label: "Music", cue: "Visit my listening log", source: "Headphones",
    description: "Find my listening history and favorite tracks on Last.fm. Live scrobbles aren’t connected to this room yet.",
    link: { href: "https://www.last.fm/user/byteprowler", label: "Open Last.fm" },
    reaction: "listening",
  },
  manga: {
    label: "Reading", cue: "Open the reading shelf", source: "Manga",
    description: "This shelf is for manga and the worlds that inspire the workshop. The reading log lives on AniList.",
    link: {
      href: process.env.NEXT_PUBLIC_ANILIST_USERNAME
        ? `https://anilist.co/user/${encodeURIComponent(process.env.NEXT_PUBLIC_ANILIST_USERNAME)}/mangalist`
        : "https://anilist.co/search/manga",
      label: process.env.NEXT_PUBLIC_ANILIST_USERNAME ? "Open my AniList reading log" : "Browse manga on AniList",
    },
    reaction: "reading",
  },
  phone: {
    label: "Contact", cue: "Send me a message", source: "Phone",
    description: "Have a project in mind or want to talk about something you saw here? Send me an email.",
    link: { href: "mailto:joshuaexcellency1@gmail.com", label: "Email Joshua" },
    reaction: "thinking",
  },
  desk: {
    label: "Lab", cue: "Read the workbench notes", source: "Workbench",
    description: "On the bench: an illustrated portfolio that turns objects into navigation. I’m exploring SVG character poses, small moments of motion, and how a room can work as an interface on touch and keyboard.",
    reaction: "thinking",
  },
} as const;

export type WorkshopObject = keyof typeof workshopObjects;
export const objectOrder = ["laptop", "bookshelf", "headphones", "manga", "phone", "desk"] as const;

export function WorkshopObjectArt({ object }: { object: WorkshopObject }) {
  if (object === "laptop") {
    return (
      <svg className={styles.laptopArt} viewBox="0 0 112 82" aria-hidden="true">
        <g className={styles.lid}>
          <path d="M21 12h72l-6 44H15Z" fill="#efcb80" stroke="#342442" strokeWidth="3" strokeLinejoin="round" />
          <path className={styles.screen} d="M25 17h62l-5 33H21Z" fill="#a8c7af" />
          <path className={styles.screen} d="M35 27h22m-23 6h35m-36 6h18" fill="none" stroke="#475e5b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <path d="M15 55h72l17 13H5Z" fill="#f4e6ff" stroke="#342442" strokeWidth="3" strokeLinejoin="round" />
        <path d="M44 62h23" stroke="#a189a7" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={styles.propArt} viewBox="0 0 70 56" aria-hidden="true" fill="none"
      stroke="#493653" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {object === "bookshelf" && <>
        <path d="M10 47V14h12v33m3 0V7h14v40" fill="#e9ad9e" />
        <path d="m41 47 2-33 11-3 9 36Z" fill="#f4ce87" />
        <path d="M13 21h6m10-5h6m-6 5h6m12 2 7-2" />
      </>}
      {object === "headphones" && <>
        <path d="M15 33v-8a20 20 0 0 1 40 0v8" stroke="#654974" strokeWidth="6" />
        <path d="M12 29h9q4 0 4 5v10q0 5-4 5h-9q-5-7 0-20Zm46 0h-9q-4 0-4 5v10q0 5 4 5h9q5-7 0-20Z" fill="#9e87bd" />
        <path d="M55 49q-1 6-10 4" />
      </>}
      {object === "manga" && <>
        <path d="m17 43 5-32 32-5 6 36-32 7Z" fill="#bb7f95" />
        <path d="m21 40 7 5 30-6m-31-23 19-3 4 13-21 4Z" fill="#f6c7be" />
        <path d="m31 33 17-3" />
      </>}
      {object === "phone" && <>
        <rect x="20" y="5" width="30" height="46" rx="6" fill="#654d70" />
        <rect x="24" y="11" width="22" height="32" rx="2" fill="#b6cbb4" />
        <path d="m28 22 7 6 7-6m-14 0h14v12H28Z" strokeWidth="1.5" />
      </>}
      {object === "desk" && <>
        <path d="M10 20h50v25H10Z" fill="#ad7588" />
        <path d="M7 15h56v9H7Z" fill="#e5a99b" />
        <path d="M27 33h16" stroke="#f9d9a2" strokeWidth="3.5" />
      </>}
    </svg>
  );
}
