/* eslint-disable @next/next/no-html-link-for-pages -- The terminal archive opens without client prefetch. */
import { useEffect, useRef, useState, type ReactNode } from "react";
import ChibiCharacter from "./ChibiCharacter";
import { useCharacterController } from "./CharacterController";
import { characterState } from "./CharacterState";
import { moveRoom, resetRoom, useWorkshopIdle } from "./WorkshopMotion";
import { objectOrder, workshopObjects, WorkshopObjectArt, type WorkshopObject } from "./WorkshopObjects";
import styles from "./world.module.css";

export default function ChibiScene({ room }: { room: ReactNode }) {
  const { phase, toggleProjects, reset } = useCharacterController();
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [selection, setSelection] = useState<WorkshopObject | null>(null);
  const inProgress = phase !== "idle" && phase !== "projects";
  const active = selection ?? (phase === "projects" ? "laptop" : null);
  const panel = active ? workshopObjects[active] : null;
  const character = selection ? workshopObjects[selection].reaction : characterState[phase];

  useWorkshopIdle(stage, phase === "idle" && !selection);

  useEffect(() => {
    const element = dialog.current;
    if (active && element && !element.open) element.showModal();
  }, [active]);

  function activate(object: WorkshopObject, button: HTMLButtonElement) {
    trigger.current = button;
    if (object === "laptop") {
      toggleProjects();
    } else {
      reset();
      setSelection(object);
    }
  }

  function close() {
    setSelection(null);
    reset();
    trigger.current?.focus();
  }

  return (
    <section className={styles.scene} aria-label="Interactive workshop" aria-describedby="workshop-guide"
      onKeyDown={(event) => {
        if (event.key === "Escape" && inProgress) {
          event.preventDefault();
          reset();
          trigger.current?.focus();
        }
      }}>
      <div ref={stage} className={styles.stage} data-phase={phase} data-object={active ?? undefined}
        onPointerMove={moveRoom} onPointerLeave={resetRoom}>
        {room}
        <div className={styles.characterLayer}><ChibiCharacter state={character} /></div>
        {objectOrder.map((object) => {
          const info = workshopObjects[object];
          const cancel = object === "laptop" && inProgress;
          return (
            <button key={object} className={styles.hotspot} data-hotspot={object} type="button"
              aria-haspopup="dialog" aria-controls="workshop-panel"
              aria-label={cancel ? "Cancel opening projects" : `${info.label} · ${info.source}`}
              onClick={(event) => activate(object, event.currentTarget)}>
              <WorkshopObjectArt object={object} />
              <span className={styles.marker} aria-hidden="true">{cancel ? "×" : "+"}</span>
              <span className={styles.objectLabel} aria-hidden="true">{cancel ? "Cancel" : info.label}<small>{!cancel && info.cue}</small></span>
            </button>
          );
        })}
      </div>
      <div className={styles.sceneFooter}>
        <p id="workshop-guide">Explore the room. Select an object to see what’s inside.</p>
        <span aria-hidden="true"><i /> Six places to explore</span>
      </div>
      <p role="status" className="sr-only">{inProgress ? "Opening projects. Press Escape to cancel." : ""}</p>
      <noscript><a href="/projects">Browse projects</a></noscript>
      <dialog ref={dialog} id="workshop-panel" className={styles.dialog} data-panel={active ?? undefined}
        aria-labelledby="workshop-panel-title" onClose={close}>
        <div className={styles.dialogHeader}>
          <span>{panel?.source} / {active === "laptop" ? "Connected" : "Workshop"}</span>
          <form method="dialog"><button type="submit">Back to room <span aria-hidden="true">×</span></button></form>
        </div>
        <div className={styles.panelBody}>
          <h2 id="workshop-panel-title">{active === "laptop" ? "Project archive" : panel?.label}</h2>
          <p>{panel?.description}</p>
          {panel && "link" in panel && <a className={styles.primary} href={panel.link.href}>
            {panel.link.label} <span aria-hidden="true">↗</span>
          </a>}
        </div>
      </dialog>
    </section>
  );
}
