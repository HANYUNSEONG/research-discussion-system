import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { spawnSync } from "child_process";
import { parseArgs, readFlag, readString } from "../lib/args.js";
import { ensureDir, exists, isExecutable, readText, resolvePath, writeText } from "../lib/files.js";
import { fail } from "../lib/errors.js";
const SKILL_NAMES = [
    "rds-setup",
    "rds-doctor",
    "rds-resume",
    "rds-new-discussion",
    "rds-close-discussion",
    "rds-convert-linking",
    "rds-link-check",
];
const SUPPORT_DIRS = ["dist", "core", "templates", "scaffolds", "adapters", "skills"];
function packageVersion(repoRoot) {
    const pkgPath = path.join(repoRoot, "package.json");
    const pkg = JSON.parse(readText(pkgPath));
    if (typeof pkg.version !== "string" || pkg.version.trim().length === 0) {
        fail("Unable to read package version", 1);
    }
    return pkg.version;
}
function codexHome(homeArg) {
    if (homeArg) {
        return resolvePath(homeArg);
    }
    const envHome = process.env.CODEX_HOME;
    if (envHome && envHome.trim().length > 0) {
        return resolvePath(envHome);
    }
    return path.join(os.homedir(), ".codex");
}
function skillsRoot(home) {
    return path.join(home, ".agents", "skills");
}
function rdsDataRoot(home) {
    return path.join(home, ".rds", "codex");
}
function installManifestPath(home) {
    return path.join(rdsDataRoot(home), "install-manifest.json");
}
function ensureExists(rel, repoRoot) {
    const source = path.join(repoRoot, rel);
    if (!exists(source)) {
        fail(`Missing installer asset: ${rel}`, 1);
    }
    return source;
}
function copyRecursive(source, destination) {
    const stat = fs.statSync(source);
    if (stat.isDirectory()) {
        ensureDir(destination);
        for (const entry of fs.readdirSync(source)) {
            copyRecursive(path.join(source, entry), path.join(destination, entry));
        }
        return;
    }
    ensureDir(path.dirname(destination));
    fs.copyFileSync(source, destination);
    fs.chmodSync(destination, stat.mode);
}
function removeIfExists(target) {
    if (exists(target)) {
        fs.rmSync(target, { recursive: true, force: true });
    }
}
function shellSingleQuote(input) {
    return `'${input.replace(/'/g, "'\\''")}'`;
}
function writeWrapper(wrapperPath, supportRoot) {
    const wrapper = `#!/usr/bin/env bash
set -euo pipefail
exec node ${shellSingleQuote(`${supportRoot}/dist/cli.js`)} "$@"
`;
    writeText(wrapperPath, wrapper);
    fs.chmodSync(wrapperPath, 0o755);
}
function generateSkill(skillName, wrapperPath, supportRoot) {
    return `---
name: ${skillName}
description: Installed RDS Codex skill (${skillName})
disable-model-invocation: false
---

# ${skillName}

This skill is installed by \`rds codex install\`.

## Execution contract
- Always use this backend wrapper for RDS actions: \`${wrapperPath}\`.
- RDS support files are installed at: \`${supportRoot}\`.
- Delegate to the canonical RDS skill source under \`${supportRoot}/skills/${skillName}/SKILL.md\` when the model can read local files.
- If local file access is restricted, run backend commands directly with the wrapper.

Task: $ARGUMENTS
`;
}
function readManifest(home) {
    const manifestFile = installManifestPath(home);
    if (!exists(manifestFile)) {
        return null;
    }
    try {
        const parsed = JSON.parse(readText(manifestFile));
        if (typeof parsed.version !== "string" ||
            typeof parsed.supportRoot !== "string" ||
            typeof parsed.wrapperPath !== "string" ||
            typeof parsed.skillsRoot !== "string" ||
            !Array.isArray(parsed.skillNames)) {
            return null;
        }
        return parsed;
    }
    catch {
        return null;
    }
}
function writeManifest(home, manifest) {
    writeText(installManifestPath(home), `${JSON.stringify(manifest, null, 2)}\n`);
}
function installCodex(repoRoot, home, force) {
    const version = packageVersion(repoRoot);
    const supportRoot = path.join(rdsDataRoot(home), "rds", version);
    const wrapperPath = path.join(home, ".rds", "bin", "rds");
    const skillInstallRoot = skillsRoot(home);
    const manifestFile = installManifestPath(home);
    if (exists(manifestFile) && !force) {
        const prior = readManifest(home);
        if (prior && prior.version === version && exists(prior.wrapperPath)) {
            console.log(`RDS Codex integration already installed for version ${version}.`);
            console.log(`Use --force to reinstall. Home: ${home}`);
            return 0;
        }
    }
    removeIfExists(supportRoot);
    for (const rel of SUPPORT_DIRS) {
        const source = ensureExists(rel, repoRoot);
        copyRecursive(source, path.join(supportRoot, rel));
    }
    ensureDir(path.dirname(wrapperPath));
    writeWrapper(wrapperPath, supportRoot);
    ensureDir(skillInstallRoot);
    for (const skill of SKILL_NAMES) {
        const skillDir = path.join(skillInstallRoot, skill);
        ensureDir(skillDir);
        writeText(path.join(skillDir, "SKILL.md"), generateSkill(skill, wrapperPath, supportRoot));
    }
    writeManifest(home, {
        installedAt: new Date().toISOString(),
        version,
        supportRoot,
        wrapperPath,
        skillsRoot: skillInstallRoot,
        skillNames: [...SKILL_NAMES],
    });
    console.log(`Installed RDS Codex integration.`);
    console.log(`- Home: ${home}`);
    console.log(`- Wrapper: ${wrapperPath}`);
    console.log(`- Skills: ${skillInstallRoot}`);
    console.log(`- Version: ${version}`);
    return 0;
}
function uninstallCodex(home) {
    const manifest = readManifest(home);
    if (!manifest) {
        console.log(`No RDS Codex install manifest found at ${installManifestPath(home)}.`);
        return 0;
    }
    removeIfExists(manifest.supportRoot);
    removeIfExists(manifest.wrapperPath);
    for (const skill of manifest.skillNames) {
        removeIfExists(path.join(manifest.skillsRoot, skill));
    }
    removeIfExists(installManifestPath(home));
    console.log(`Removed RDS Codex integration from ${home}.`);
    return 0;
}
function codexDoctor(home, smokeTest) {
    const manifest = readManifest(home);
    const checks = [];
    if (!manifest) {
        checks.push({
            name: "Install manifest",
            ok: false,
            detail: `missing (${installManifestPath(home)})`,
        });
    }
    else {
        checks.push({ name: "Install manifest", ok: true, detail: manifest.version });
        checks.push({
            name: "Support root",
            ok: exists(manifest.supportRoot),
            detail: manifest.supportRoot,
        });
        checks.push({
            name: "Wrapper executable",
            ok: exists(manifest.wrapperPath) && isExecutable(manifest.wrapperPath),
            detail: manifest.wrapperPath,
        });
        for (const skill of SKILL_NAMES) {
            const skillFile = path.join(manifest.skillsRoot, skill, "SKILL.md");
            checks.push({
                name: `Skill ${skill}`,
                ok: exists(skillFile),
                detail: skillFile,
            });
        }
        if (smokeTest && exists(manifest.wrapperPath)) {
            const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rds-codex-smoke-"));
            const projectPath = path.join(tmpRoot, "project");
            try {
                const run = (args) => {
                    const result = spawnSync(manifest.wrapperPath, args, {
                        cwd: tmpRoot,
                        encoding: "utf8",
                    });
                    if (result.status !== 0) {
                        fail(`Smoke test failed: ${[manifest.wrapperPath, ...args].join(" ")}\n${result.stderr ?? result.stdout ?? ""}`, 1);
                    }
                };
                run([
                    "scaffold",
                    "--target",
                    projectPath,
                    "--field",
                    "biology",
                    "--topic",
                    "Codex smoke test",
                    "--scaffold",
                    "wet_lab",
                ]);
                run(["validate", "--project", projectPath]);
                run(["doctor", "--project", projectPath]);
                checks.push({ name: "Smoke test", ok: true, detail: projectPath });
            }
            catch (error) {
                checks.push({ name: "Smoke test", ok: false, detail: String(error) });
            }
            finally {
                fs.rmSync(tmpRoot, { recursive: true, force: true });
            }
        }
    }
    for (const check of checks) {
        const icon = check.ok ? "✅" : "❌";
        console.log(`${icon} ${check.name}: ${check.detail}`);
    }
    return checks.every((check) => check.ok) ? 0 : 1;
}
export function codexCommand(argv, repoRoot) {
    const args = parseArgs(argv);
    const [subcommand] = args.positionals;
    if (!subcommand || subcommand === "help" || subcommand === "--help" || subcommand === "-h") {
        console.log(`RDS Codex integration commands

Usage:
  rds codex install [--home <path>] [--force]
  rds codex doctor [--home <path>] [--smoke-test]
  rds codex uninstall [--home <path>]
`);
        return 0;
    }
    const home = codexHome(readString(args, "home"));
    switch (subcommand) {
        case "install":
            return installCodex(repoRoot, home, readFlag(args, "force"));
        case "doctor":
            return codexDoctor(home, readFlag(args, "smoke-test"));
        case "uninstall":
            return uninstallCodex(home);
        default:
            fail(`Unknown codex subcommand: ${subcommand}`, 2);
    }
}
//# sourceMappingURL=codex.js.map