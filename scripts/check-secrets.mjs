import { spawnSync } from "node:child_process";

const signatures = [
  ["GitHub credential", "github_pat_[A-Za-z0-9_]{30,}|gh[pousr]_[A-Za-z0-9]{30,}"],
  ["Service credential", "sb_secret_[A-Za-z0-9_-]{20,}|re_[A-Za-z0-9_]{28,}|eyJ[A-Za-z0-9_-]{12,}\\.eyJ[A-Za-z0-9_-]{12,}\\.[A-Za-z0-9_-]{20,}"],
  ["Private key", "-----BEGIN ([A-Z]+ )*PRIVATE KEY-----"],
  ["Credential in URL", "https?://[^ /:@]+:[^ /@]+@"],
];

for (const [label, pattern] of signatures) {
  const result = spawnSync("git", ["grep", "-IlE", "-e", pattern, "--", ".", ":(exclude)pnpm-lock.yaml", ":(exclude)bun.lock"], { encoding: "utf8" });
  if (result.status === 0) {
    console.error(label + " signature in tracked files:\n" + result.stdout.trim());
    process.exitCode = 1;
  } else if (result.status !== 1) {
    console.error("Credential scan could not complete.");
    process.exitCode = 1;
  }
}
