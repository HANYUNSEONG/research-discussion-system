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
const IS_WINDOWS = process.platform === "win32";
function packageVersion(repoRoot) {
    const pkgPath = path.join(repoRoot, "package.json");
    const pkg = JSON.parse(readText(pkgPath));
    if (typeof pkg.version !== "string" || pkg.version.trim().length === 0) {
        fail("Unable to read package version", 1);
    }
    return pkg.version;
}
function userHome(homeArg) {
    if (homeArg) {
        return resolvePath(homeArg);
    }
    const envHome = process.env.RDS_CODEX_HOME;
    if (envHome && envHome.trim().length > 0) {
        return resolvePath(envHome);
    }
    return os.homedir();
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
function cmdQuote(input) {
    return `"${input.replace(/"/g, '""')}"`;
}
function wrapperPaths(home) {
    const binDir = path.join(home, ".rds", "bin");
    const posix = path.join(binDir, "rds");
    const windows = path.join(binDir, "rds.cmd");
    return {
        primary: IS_WINDOWS ? windows : posix,
        posix,
        windows,
    };
}
function writeWrappers(paths, supportRoot) {
    const cliPath = path.join(supportRoot, "dist", "cli.js");
    const written = [];
    if (paths.posix) {
        const posixWrapper = `#!/usr/bin/env bash
set -euo pipefail
exec node ${shellSingleQuote(cliPath)} "$@"
`;
        writeText(paths.posix, posixWrapper);
        if (!IS_WINDOWS) {
            fs.chmodSync(paths.posix, 0o755);
        }
        written.push(paths.posix);
    }
    if (paths.windows) {
        const windowsWrapper = `@echo off\r\nnode ${cmdQuote(cliPath)} %*\r\n`;
        writeText(paths.windows, windowsWrapper);
        written.push(paths.windows);
    }
    return written;
}
function generateSkill(skillName, paths, supportRoot) {
    const wrapperGuidance = paths.posix && paths.windows
        ? `- Always use this backend wrapper for RDS actions. Pick the one matching the host OS:
  - macOS / Linux / WSL / Git Bash: \`${paths.posix}\`
  - Windows (PowerShell or cmd): \`${paths.windows}\``
        : `- Always use this backend wrapper for RDS actions: \`${paths.primary}\`.`;
    return `---
name: ${skillName}
description: Installed RDS Codex skill (${skillName})
disable-model-invocation: false
---

# ${skillName}

This skill is installed by \`rds codex install\`.

## Execution contract
${wrapperGuidance}
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
        const wrappers = Array.isArray(parsed.wrapperPaths)
            ? parsed.wrapperPaths.filter((entry) => typeof entry === "string")
            : [parsed.wrapperPath];
        return {
            installedAt: typeof parsed.installedAt === "string" ? parsed.installedAt : "",
            version: parsed.version,
            supportRoot: parsed.supportRoot,
            wrapperPath: parsed.wrapperPath,
            wrapperPaths: wrappers,
            skillsRoot: parsed.skillsRoot,
            skillNames: parsed.skillNames,
            platform: parsed.platform ?? process.platform,
        };
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
    const paths = wrapperPaths(home);
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
    ensureDir(path.dirname(paths.primary));
    const writtenWrappers = writeWrappers(paths, supportRoot);
    ensureDir(skillInstallRoot);
    for (const skill of SKILL_NAMES) {
        const skillDir = path.join(skillInstallRoot, skill);
        ensureDir(skillDir);
        writeText(path.join(skillDir, "SKILL.md"), generateSkill(skill, paths, supportRoot));
    }
    writeManifest(home, {
        installedAt: new Date().toISOString(),
        version,
        supportRoot,
        wrapperPath: paths.primary,
        wrapperPaths: writtenWrappers,
        skillsRoot: skillInstallRoot,
        skillNames: [...SKILL_NAMES],
        platform: process.platform,
    });
    console.log(`Installed RDS Codex integration.`);
    console.log(`- Home: ${home}`);
    console.log(`- Wrapper: ${paths.primary}`);
    if (writtenWrappers.length > 1) {
        for (const extra of writtenWrappers) {
            if (extra !== paths.primary) {
                console.log(`  also: ${extra}`);
            }
        }
    }
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
    for (const wrapper of manifest.wrapperPaths.length > 0 ? manifest.wrapperPaths : [manifest.wrapperPath]) {
        removeIfExists(wrapper);
    }
    for (const skill of manifest.skillNames) {
        removeIfExists(path.join(manifest.skillsRoot, skill));
    }
    removeIfExists(installManifestPath(home));
    console.log(`Removed RDS Codex integration from ${home}.`);
    return 0;
}
function wrapperIsUsable(wrapperPath, isPrimary) {
    if (!exists(wrapperPath))
        return false;
    if (!isPrimary)
        return true;
    if (IS_WINDOWS)
        return true;
    return isExecutable(wrapperPath);
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
        const wrappersToCheck = manifest.wrapperPaths.length > 0
            ? manifest.wrapperPaths
            : [manifest.wrapperPath];
        for (const wrapper of wrappersToCheck) {
            const isPrimary = wrapper === manifest.wrapperPath;
            checks.push({
                name: isPrimary ? "Wrapper executable" : "Wrapper (alt)",
                ok: wrapperIsUsable(wrapper, isPrimary),
                detail: wrapper,
            });
        }
        for (const skill of SKILL_NAMES) {
            const skillFile = path.join(manifest.skillsRoot, skill, "SKILL.md");
            checks.push({
                name: `Skill ${skill}`,
                ok: exists(skillFile),
                detail: skillFile,
            });
        }
        if (smokeTest && exists(manifest.supportRoot)) {
            const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rds-codex-smoke-"));
            const projectPath = path.join(tmpRoot, "project");
            const cliPath = path.join(manifest.supportRoot, "dist", "cli.js");
            try {
                const run = (args) => {
                    const result = spawnSync(process.execPath, [cliPath, ...args], {
                        cwd: tmpRoot,
                        encoding: "utf8",
                    });
                    if (result.status !== 0) {
                        fail(`Smoke test failed: node ${[cliPath, ...args].join(" ")}\n${result.stderr ?? result.stdout ?? ""}`, 1);
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

Notes:
  --home defaults to the OS user home (~ on POSIX, %USERPROFILE% on Windows).
  Skills install to <home>/.agents/skills (Codex's canonical user-skills path).
  On Windows, both an rds.cmd and an rds bash wrapper are written so the same
  install works from PowerShell, cmd, and Git Bash.
`);
        return 0;
    }
    const home = userHome(readString(args, "home"));
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