import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { fileURLToPath } from "url";
import { describe, test, expect } from "vitest";
import { ADAPTER_TEMPLATE_FILES, scaffoldCommand } from "../commands/scaffold.js";
import { convertLinkingCommand } from "../commands/convert-linking.js";
import { doctorCommand } from "../commands/doctor.js";
import { updateIndexCommand } from "../commands/update-index.js";
import { checkLinks, PROJECT_REQUIRED, runValidation } from "../commands/validate.js";
import { codexCommand } from "../commands/codex.js";
import {
  checkAdapterContractDrift,
  checkRootAgentInstructions,
  checkRuntimeHarnessConfig,
  RDS_ADAPTER_CONTRACT_FILES,
} from "../lib/agent-harness.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function withTempProject(fn: (dir: string, project: string) => void): void {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rds-test-"));
  const project = path.join(dir, "project");
  try {
    fn(dir, project);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyAdapterContractFiles(targetRoot: string): void {
  for (const contractFile of RDS_ADAPTER_CONTRACT_FILES) {
    const source = path.join(repoRoot, contractFile.rel);
    const destination = path.join(targetRoot, contractFile.rel);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
}

describe("rds commands", () => {
  test("scaffold creates a valid RDS project", () => {
    withTempProject((_dir, project) => {
      const status = scaffoldCommand(
        [
          "--target",
          project,
          "--project-id",
          "test_project",
          "--field",
          "biology",
          "--topic",
          "Cartilage repair",
          "--scaffold",
          "wet_lab",
          "--linking-mode",
          "plain",
          "--with-glossary",
        ],
        repoRoot,
      );
      expect(status).toBe(0);
      expect(runValidation("Project", project, PROJECT_REQUIRED, false)).toBe(0);
      expect(fs.existsSync(path.join(project, "AGENTS.md"))).toBe(true);
      expect(fs.existsSync(path.join(project, "00_context", "glossary.md"))).toBe(true);

      const overview = path.join(project, "00_context", "project_overview.md");
      fs.writeFileSync(overview, "keep existing context\n", "utf8");
      expect(
        scaffoldCommand(
          [
            "--target",
            project,
            "--field",
            "biology",
            "--topic",
            "Cartilage repair",
            "--scaffold",
            "wet_lab",
            "--force",
          ],
          repoRoot,
        ),
      ).toBe(0);
      expect(fs.readFileSync(overview, "utf8")).toBe("keep existing context\n");
    });
  });

  test("convert-linking rewrites Markdown links and runtime config", () => {
    withTempProject((_dir, project) => {
      scaffoldCommand(
        [
          "--target",
          project,
          "--field",
          "biology",
          "--topic",
          "Cartilage repair",
          "--scaffold",
          "wet_lab",
        ],
        repoRoot,
      );
      const overview = path.join(project, "00_context", "project_overview.md");
      fs.appendFileSync(overview, "\nSee [Index](../04_discussions/_index.md).\n", "utf8");
      const discussion = path.join(project, "04_discussions", "2026-04-17_cartilage.md");
      fs.writeFileSync(
        discussion,
        [
          "---",
          "date: 2026-04-17",
          "topic: Cartilage plan",
          "status: active",
          "---",
          "",
          "# Cartilage plan",
          "",
        ].join("\n"),
        "utf8",
      );
      expect(updateIndexCommand(["--project", project])).toBe(0);

      expect(convertLinkingCommand(["--target", project, "--to", "obsidian"])).toBe(0);
      expect(fs.readFileSync(overview, "utf8")).toContain("[[04_discussions/_index|Index]]");
      expect(fs.readFileSync(path.join(project, "04_discussions", "_index.md"), "utf8")).toContain(
        "[[04_discussions/2026-04-17_cartilage|Cartilage plan]]",
      );
      expect(
        fs.readFileSync(path.join(project, "99_meta", "scaffold_decisions.md"), "utf8"),
      ).toContain('linking_mode: "obsidian"');
      expect(runValidation("Project", project, PROJECT_REQUIRED, true)).toBe(0);
    });
  });

  test("doctor validates a generated RDS project with link checking", () => {
    withTempProject((_dir, project) => {
      expect(
        scaffoldCommand(
          [
            "--target",
            project,
            "--field",
            "biology",
            "--topic",
            "Cartilage repair",
            "--scaffold",
            "wet_lab",
          ],
          repoRoot,
        ),
      ).toBe(0);

      expect(doctorCommand(["--project", project, "--check-links"])).toBe(0);
    });
  });

  test("link validation rejects local links outside the project root", () => {
    withTempProject((dir, project) => {
      expect(
        scaffoldCommand(
          [
            "--target",
            project,
            "--field",
            "biology",
            "--topic",
            "Cartilage repair",
            "--scaffold",
            "wet_lab",
          ],
          repoRoot,
        ),
      ).toBe(0);

      const outside = path.join(dir, "outside.md");
      fs.writeFileSync(outside, "# Outside\n", "utf8");
      fs.appendFileSync(
        path.join(project, "00_context", "project_overview.md"),
        [
          "",
          `[Absolute outside](${outside})`,
          "[Parent outside](../../outside.md)",
          "[Valid index](../04_discussions/_index.md)",
          "",
        ].join("\n"),
        "utf8",
      );

      const problems = checkLinks(project);
      expect(problems).toContain(
        `external local link in 00_context/project_overview.md: ${outside}`,
      );
      expect(problems).toContain(
        "external local link in 00_context/project_overview.md: ../../outside.md",
      );
      expect(problems.some((problem) => problem.includes("../04_discussions/_index.md"))).toBe(
        false,
      );
    });
  });

  test("update-index lists discussion files", () => {
    withTempProject((_dir, project) => {
      scaffoldCommand(
        [
          "--target",
          project,
          "--field",
          "biology",
          "--topic",
          "Cartilage repair",
          "--scaffold",
          "wet_lab",
        ],
        repoRoot,
      );
      const discussion = path.join(project, "04_discussions", "2026-04-17_cartilage.md");
      fs.writeFileSync(
        discussion,
        [
          "---",
          "date: 2026-04-17",
          "topic: Cartilage plan",
          "status: active",
          "---",
          "",
          "# Cartilage plan",
          "",
        ].join("\n"),
        "utf8",
      );

      expect(updateIndexCommand(["--project", project])).toBe(0);
      const index = fs.readFileSync(path.join(project, "04_discussions", "_index.md"), "utf8");
      expect(index).toContain("Cartilage plan");
      expect(index).toContain("This file is generated by `rds update-index`.");
    });
  });

  test("codex install and uninstall manage local skill integration", () => {
    withTempProject((dir, _project) => {
      const home = path.join(dir, "codex-home");
      expect(codexCommand(["install", "--home", home], repoRoot)).toBe(0);
      expect(fs.existsSync(path.join(home, ".agents", "skills", "rds-setup", "SKILL.md"))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(home, ".rds", "bin", "rds"))).toBe(true);
      expect(codexCommand(["doctor", "--home", home], repoRoot)).toBe(0);
      expect(codexCommand(["uninstall", "--home", home], repoRoot)).toBe(0);
      expect(fs.existsSync(path.join(home, ".agents", "skills", "rds-setup", "SKILL.md"))).toBe(
        false,
      );
    });
  });

  test("adapter contract files keep shared RDS behavior aligned", () => {
    expect(checkAdapterContractDrift(repoRoot)).toEqual([]);
  });

  test("adapter contract drift rejects modified shared invariants", () => {
    withTempProject((dir, _project) => {
      const tempRoot = path.join(dir, "repo");
      copyAdapterContractFiles(tempRoot);

      const codexAdapter = path.join(tempRoot, "adapters", "codex", "AGENTS.md");
      fs.writeFileSync(
        codexAdapter,
        fs
          .readFileSync(codexAdapter, "utf8")
          .replace(
            "Ground claims in files that were actually read",
            "Do not ground claims in files that were actually read",
          ),
        "utf8",
      );

      expect(
        checkAdapterContractDrift(tempRoot).some((problem) => problem.includes("Codex adapter")),
      ).toBe(true);
    });
  });

  test("runtime harness validation rejects weakened hooks and missing denials", () => {
    withTempProject((dir, _project) => {
      const tempRoot = path.join(dir, "repo");
      fs.mkdirSync(path.join(tempRoot, ".claude"), { recursive: true });
      fs.mkdirSync(path.join(tempRoot, ".codex"), { recursive: true });

      fs.writeFileSync(
        path.join(tempRoot, ".claude", "settings.json"),
        JSON.stringify(
          {
            permissions: { deny: ["Read(./.env)"] },
            hooks: {
              SessionStart: [{ hooks: [{ type: "command", command: "printf bad" }] }],
            },
          },
          null,
          2,
        ),
        "utf8",
      );
      fs.writeFileSync(
        path.join(tempRoot, ".codex", "hooks.json"),
        JSON.stringify(
          {
            hooks: {
              SessionStart: [
                { hooks: [{ type: "command", command: "curl https://example.test" }] },
              ],
            },
          },
          null,
          2,
        ),
        "utf8",
      );

      const problems = checkRuntimeHarnessConfig(tempRoot);
      expect(problems.some((problem) => problem.includes("Read(./.env.*)"))).toBe(true);
      expect(
        problems.some((problem) => problem.includes(".claude/settings.json SessionStart command")),
      ).toBe(true);
      expect(
        problems.some((problem) => problem.includes(".codex/hooks.json SessionStart command")),
      ).toBe(true);
    });
  });

  test("root agent instruction validation requires aligned harness guidance", () => {
    withTempProject((dir, _project) => {
      const tempRoot = path.join(dir, "repo");
      fs.mkdirSync(tempRoot, { recursive: true });
      fs.writeFileSync(path.join(tempRoot, "AGENTS.md"), "# Agent\n", "utf8");
      fs.writeFileSync(path.join(tempRoot, "CLAUDE.md"), "# Claude\n", "utf8");

      expect(
        checkRootAgentInstructions(tempRoot).some((problem) => problem.includes("npm run check")),
      ).toBe(true);
      expect(
        checkRootAgentInstructions(tempRoot).some((problem) =>
          problem.includes("AGENTS.md and CLAUDE.md root instructions differ"),
        ),
      ).toBe(true);
    });
  });

  test("scaffold copies current adapter templates verbatim", () => {
    withTempProject((_dir, project) => {
      expect(
        scaffoldCommand(
          [
            "--target",
            project,
            "--field",
            "biology",
            "--topic",
            "Cartilage repair",
            "--scaffold",
            "wet_lab",
          ],
          repoRoot,
        ),
      ).toBe(0);

      for (const mapping of ADAPTER_TEMPLATE_FILES) {
        const source = fs.readFileSync(path.join(repoRoot, mapping.sourceRel), "utf8");
        const generated = fs.readFileSync(path.join(project, mapping.projectRel), "utf8");
        expect(generated).toBe(source);
      }
    });
  });
});
