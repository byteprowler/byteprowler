import type { CharacterState } from "./CharacterState";
import styles from "./world.module.css";

const poseByState = {
  idle: "idle",
  walking: "walking",
  sitting: "sitting",
  openingLaptop: "openingLaptop",
  typing: "typing",
  reading: "idle",
  listening: "idle",
  thinking: "idle",
  sleeping: "sitting",
  celebrating: "idle",
} as const satisfies Record<CharacterState, string>;

const ink = "#38273d";
const skin = "#c88664";
const jacket = "#6e9990";

const seatedArms = {
  sitting: ["M69 87q12 3 15 14l9 4", "M57 88q5 17 20 19l12 1"],
  openingLaptop: ["M69 87q13 5 22 4l13-8", "M57 88q10 11 25 8l24-15"],
  typing: ["M69 87q12 3 21 5l17-6", "M57 88q8 12 24 10l20-5"],
} as const;

function Face({ expression }: { expression: "normal" | "focused" | "happy" }) {
  const happy = expression === "happy";
  const focused = expression === "focused";

  return (
    <g data-face={expression}>
      <path d="M48 51q8-3 16 0l-1 9q-7 5-14 0Zm23 0q7-3 14 0l-1 8q-6 5-12 0ZM64 53q4-3 8 0"
        fill="#ffefcc" fillOpacity=".24" strokeWidth="1.3" />
      <g className={styles.openEyes} fill={ink} stroke="none">
        {happy ? (
          <path d="M51 56q5-7 10 0m13 0q4-6 8 0" stroke={ink} fill="none" strokeWidth="1.7" />
        ) : (
          <>
            <ellipse cx={focused ? 59 : 56} cy="55" rx="2.5" ry={focused ? 2.3 : 3.3} />
            <ellipse cx={focused ? 80 : 77} cy="55" rx="2.3" ry={focused ? 2.3 : 3.2} />
            <path d={focused ? "M59 54h.1m21 0h.1" : "M56 54h.1m21 0h.1"} stroke="#fff4e4" strokeWidth="1.1" />
          </>
        )}
      </g>
      <path data-face="blink" className={styles.closedEyes} d="M53 56q3 2 6 0m16 0q3 2 6 0"
        fill="none" strokeWidth="1.6" />
      <path d="M69 58l3 5-4 1" fill="none" stroke="#995a50" strokeWidth="1.15" />
      <path d={happy ? "M62 67q8 9 15-1Z" : focused ? "M66 68q3-1 6 0" : "M64 67q5 4 9-1"}
        fill={happy ? "#754454" : "none"} strokeWidth="1.4" />
      <path d="M47 63l5 1m28-1 3-1" fill="none" stroke="#eaa088" strokeWidth="2.6" />
    </g>
  );
}

export default function ChibiCharacter({ state }: { state: CharacterState }) {
  const pose = poseByState[state];
  const arms = pose === "idle" || pose === "walking" ? undefined : seatedArms[pose];
  const expression = state === "celebrating" ? "happy"
    : pose === "typing" || pose === "openingLaptop" || state === "reading" || state === "thinking" ? "focused" : "normal";

  return (
    <svg className={styles.character} data-state={state} data-pose={pose} viewBox="0 0 120 140" aria-hidden="true">
      <ellipse className={styles.characterShadow} cx="59" cy="134" rx="26" ry="4" fill="#49334f" opacity=".22" />
      <g className={styles.characterFigure} stroke={ink} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        {arms ? (
          <g data-part="seated-legs">
            <path d="M55 103q13 1 24 8l-2 12 10 3q4 4-3 6H71q-4-2-2-7l-2-6-15-4Z" fill="#62546f" />
            <path d="M68 124q9-1 15 2 5 3 1 6H71q-5 0-3-8Z" fill="#f2d4a9" />
            <path d="M43 102q13-2 29 8l-4 13 10 4q6 4-1 7H61q-5-2-4-8l2-8-13-4Z" fill="#4f435e" />
            <path d="M58 126q8-1 18 1 6 4 1 7H61q-5-1-3-8Z" fill="#fff0d6" />
          </g>
        ) : (
          <>
            <g className={styles.farLeg}>
              <path d="M60 102l12 1-3 23 7 4q2 4-3 4H60q-4-1-3-6Z" fill="#645771" />
              <path d="M58 127q11 0 17 3 3 4-2 4H60q-4-1-2-7Z" fill="#e8c9a6" />
            </g>
            <g className={styles.nearLeg}>
              <path d="M45 101l13 4-6 23 8 2q3 4-3 4H42q-4-1-2-6Z" fill="#4f435e" />
              <path d="M41 127q9-2 18 3 4 4-2 4H43q-5-1-2-7Z" fill="#fff0d6" />
            </g>
          </>
        )}
        {!arms && (
          <g className={styles.farArm}>
            <path d="M70 78q10 5 10 18l-2 8-9-1-1-15Z" fill="#52766e" />
            <path d="M70 102q7 1 9 0l-1 6q-5 4-9-1Z" fill={skin} />
          </g>
        )}
        <path d="M46 74q12-5 25 1 9 10 7 32-16 9-37 0-2-21 5-33Z" fill={jacket} />
        <path d="M42 82q2-11 11-12l15 1 8 8q-14 9-34 3Z" fill="#56796f" />
        <path d="M56 83l7 8 8-9m-8 9v17m-12-9 7 1-2 5-7-1" fill="none" stroke="#415e59" strokeWidth="1.4" />
        <path d="M54 89h.1m16 1h.1" stroke="#f6d59a" strokeWidth="2.8" />
        {arms ? (
          <>
            <g className={styles.farHand}>
              <path d={arms[0]} fill="none" strokeWidth="10" />
              <path d={arms[0]} fill="none" stroke="#52766e" strokeWidth="6.4" />
              <path d={arms[0]} pathLength="100" fill="none" stroke={skin} strokeWidth="5.1" strokeLinecap="butt" strokeDasharray="0 87 13 0" />
            </g>
            <g className={styles.nearHand}>
              <path d={arms[1]} fill="none" strokeWidth="11" />
              <path d={arms[1]} fill="none" stroke={jacket} strokeWidth="7.3" />
              <path d={arms[1]} pathLength="100" fill="none" stroke={skin} strokeWidth="5.6" strokeLinecap="butt" strokeDasharray="0 86 14 0" />
            </g>
          </>
        ) : (
          <g className={styles.nearArm}>
            <path d="M48 81q-8 4-10 19l8 3 9-13" fill={jacket} />
            <path d="M39 98l8 3-2 8q-6 4-10-2Z" fill={skin} />
          </g>
        )}
        <g className={styles.characterHead}>
          <path d="M24 52Q13 42 21 31q-2-11 8-15 2-12 16-10 11-8 22 1 13-2 19 9 12 3 12 15 6 9-2 20l-5 13-54 9Z" fill="#3e2e47" />
          <path d="M38 44q8-17 25-19 19-2 25 18l1 15q-1 13-13 19-17 7-32-4l-7-12q-9 1-10-7 0-9 11-7Z" fill={skin} />
          <path d="M38 60q-6 0-6-6 2-3 5 0" fill="none" stroke="#995a50" strokeWidth="1.3" />
          <path d="M27 46q-4-10 2-18 3-9 15-12 12-9 24-2 20-1 24 19l-4 10q-10-5-13-13-6 12-20 12l3-8q-7 10-19 13l-2 11-5-10Z" fill="#48354e" />
          <path d="M34 29q7-10 18-9m9-1q8-3 15 1" fill="none" stroke="#75536e" strokeWidth="2" />
          <path d="m39 35 7-7m-4 11 7-7" fill="none" stroke="#f7ca79" strokeWidth="2.3" />
          <Face expression={expression} />
        </g>
      </g>
    </svg>
  );
}
