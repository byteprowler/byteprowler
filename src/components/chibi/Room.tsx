import styles from "./world.module.css";

export default function Room() {
  return (
    <svg viewBox="0 0 600 470" preserveAspectRatio="none" aria-hidden="true" width="100%" height="100%">
      <defs>
        <linearGradient id="workshop-sky" x2="0%" y2="100%">
          <stop stopColor="#827cc8" />
          <stop offset="1" stopColor="#e9b6d0" />
        </linearGradient>
        <pattern id="workshop-wall" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1" fill="#7e6293" opacity=".22" />
        </pattern>
      </defs>
      <path fill="#e4c9e2" d="M0 0h600v326H0z" />
      <path fill="url(#workshop-wall)" d="M0 0h600v326H0z" />
      <path fill="#b79bbb" d="M0 326h600v144H0z" />
      <g stroke="#775d87" strokeWidth="2" opacity=".43">
        <path d="M0 328h600M0 378h600M0 430h600M116 328 42 470m190-142-15 142m126-142 35 142m74-142 88 142" />
      </g>
      <g className={styles.foregroundLayer}>
      <ellipse cx="272" cy="395" rx="208" ry="48" fill="#e0a8a9" />
      <ellipse cx="272" cy="395" rx="191" ry="39" fill="none" stroke="#f5cac0" strokeWidth="2" />
      </g>
      <g className={styles.backgroundLayer} stroke="#4d365e" strokeWidth="3" strokeLinejoin="round">
        <rect x="53" y="51" width="215" height="178" rx="65" fill="#fff0df" />
        <rect x="65" y="63" width="191" height="154" rx="55" fill="url(#workshop-sky)" />
        <path d="M66 181q42-39 83-7 52-56 106-4v14q-8 33-49 33h-88q-39 0-52-30Z" fill="#a98cbf" stroke="none" />
        <circle cx="191" cy="113" r="22" fill="#ffdeb0" stroke="none" />
        <path d="M160 65v151M67 153h187" stroke="#fff0df" strokeWidth="5" />
        <path d="M75 233h174" strokeLinecap="round" strokeWidth="7" />
      </g>
      <g className={styles.midgroundLayer} stroke="#4d365e" strokeWidth="3" strokeLinejoin="round">
        <path d="M340 88h164v10H340z" fill="#9e7bb0" />
        <path d="M352 98v12m140-12v12" stroke="#785686" strokeLinecap="round" strokeWidth="5" />
        <path d="M477 182h67v8h-67z" fill="#9e7bb0" />
        <path d="M250 296h44v8h-44zm5 8h5v33h-5zm28 0h5v33h-5z" fill="#ae819c" />
        <path d="M251 315h42" stroke="#855d8d" />
        <g>
          <ellipse cx="346" cy="375" rx="22" ry="5" fill="#654e82" opacity=".2" stroke="none" />
          <path d="m333 329-6 45m29-45 7 45m-32-14h29" fill="none" stroke="#705779" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="345" cy="329" rx="22" ry="7" fill="#b589ac" />
        </g>
        <path d="M380 325h12v63h-12zm142 0h12v63h-12z" fill="#654e82" />
        <path d="M369 304h171l20 20H349z" fill="#f2c09f" />
        <path d="M349 324h211v11H349z" fill="#be878d" />
        <path d="M517 296v-41l-18-18m-2 60h39" fill="none" strokeWidth="5" strokeLinecap="round" />
        <path d="M491 226q19-10 24 9l-31 14q-8-16 7-23Z" fill="#f3c873" />
      </g>
      <g className={styles.foregroundLayer} stroke="#4d365e" strokeWidth="3" strokeLinejoin="round">
        <path d="M102 341h36l-6 26h-24z" fill="#be807f" />
        <path className={styles.plantLeaves} d="M120 341q-32-3-34-30 28-3 34 30-5-42 23-45 10 25-23 45Z" fill="#7d9d89" />
      </g>
      <g className={styles.backgroundLayer + " " + styles.roomDetail} fill="#fff4de">
        <path d="M103 106l2 5 5 2-5 2-2 5-2-5-5-2 5-2zm120 28 2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
        <circle cx="125" cy="132" r="2" /><circle cx="220" cy="92" r="2" />
      </g>
    </svg>
  );
}
