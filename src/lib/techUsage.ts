import { projects } from "./projects";

function normalizeTechName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "");
}

export function getTechProjectCount(name: string) {
  const key = normalizeTechName(name);
  return projects.filter(project => project.stack.some(tech => normalizeTechName(tech) === key)).length;
}
