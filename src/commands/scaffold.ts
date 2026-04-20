import * as path from "path";
import { parseArgs, readChoice, readFlag, readString } from "../lib/args.js";
import {
  ensureDir,
  exists,
  isNonEmptyDir,
  localDate,
  readText,
  resolvePath,
  toPosix,
  walkFiles,
  writeText,
} from "../lib/files.js";
import { fail } from "../lib/errors.js";

export const SCAFFOLD_FOLDERS: Record<string, string[]> = {
  wet_lab: ["01_protocols", "02_raw_data", "03_analysis"],
  computational: ["01_pipelines", "02_datasets", "03_experiments"],
  social_science: ["01_research_design", "02_data", "03_analysis"],
  clinical: ["01_protocol_irb", "02_deidentified_case_notes", "03_analysis"],
  theoretical: ["01_problem_statements", "02_attempts", "03_proofs"],
  mixed: ["01_research_materials", "02_data", "03_analysis"],
};

export const ADAPTER_TEMPLATE_FILES = [
  { sourceRel: "adapters/codex/AGENTS.md", projectRel: "AGENTS.md" },
  { sourceRel: "adapters/gemini/GEMINI.md", projectRel: "GEMINI.md" },
  { sourceRel: "adapters/claude-cowork/CLAUDE.md", projectRel: "CLAUDE.md" },
] as const;

const SCAFFOLD_CHOICES = Object.keys(SCAFFOLD_FOLDERS);
const LINKING_CHOICES = ["plain", "obsidian"] as const;

export function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "rds_project";
}

function render(text: string, values: Record<string, string>): string {
  let rendered = text;
  for (const [key, value] of Object.entries(values)) {
    rendered = rendered.split(`{{${key}}}`).join(value);
  }
  return rendered;
}

function copyTemplateTree(
  source: string,
  target: string,
  values: Record<string, string>,
  includeGlossary: boolean,
): void {
  for (const sourceFile of walkFiles(source)) {
    const rel = toPosix(path.relative(source, sourceFile));
    if (rel === "00_context/glossary.md" && !includeGlossary) {
      continue;
    }
    const destination = path.join(target, rel);
    if (exists(destination)) {
      continue;
    }
    writeText(destination, render(readText(sourceFile), values));
  }
}

function copyAdapterTemplates(repoRoot: string, target: string): void {
  for (const mapping of ADAPTER_TEMPLATE_FILES) {
    const source = path.join(repoRoot, mapping.sourceRel);
    const destination = path.join(target, mapping.projectRel);
    if (exists(source) && !exists(destination)) {
      writeText(destination, readText(source));
    }
  }
}

export function scaffoldCommand(argv: string[], repoRoot: string, cwd = process.cwd()): number {
  const args = parseArgs(argv);
  const targetArg = readString(args, "target", true);
  const field = readString(args, "field", true);
  const topic = readString(args, "topic", true);
  const scaffold = readChoice(args, "scaffold", SCAFFOLD_CHOICES);
  const linkingMode = readChoice(args, "linking-mode", LINKING_CHOICES, "plain");
  const projectIdArg = readString(args, "project-id") ?? "";
  const includeGlossary = readFlag(args, "with-glossary");
  const force = readFlag(args, "force");

  if (!targetArg || !field || !topic) {
    fail("Missing required scaffold options", 2);
  }

  const target = resolvePath(targetArg, cwd);
  if (isNonEmptyDir(target) && !force) {
    fail(`Target is not empty: ${target}. Use --force to add RDS files.`);
  }

  ensureDir(target);
  const projectId = projectIdArg || slugify(topic);
  const values: Record<string, string> = {
    project_id: projectId,
    field,
    topic,
    scaffold,
    linking_mode: linkingMode,
    date: localDate(),
    agent_provider: "unknown",
    agent_surface: "unknown",
    agent_model: "unknown",
    title: topic,
  };

  for (const folder of ["00_context", "04_discussions", "05_literature", "99_meta"]) {
    ensureDir(path.join(target, folder));
  }
  for (const folder of SCAFFOLD_FOLDERS[scaffold]) {
    ensureDir(path.join(target, folder));
  }

  copyTemplateTree(path.join(repoRoot, "templates"), target, values, includeGlossary);
  copyAdapterTemplates(repoRoot, target);

  console.log(`Created RDS Project at ${target}`);
  console.log(`Project id: ${projectId}`);
  console.log(`Scaffold: ${scaffold}`);
  console.log(`Linking mode: ${linkingMode}`);
  return 0;
}
