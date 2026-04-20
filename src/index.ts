export { run, usage } from "./cli.js";
export { scaffoldCommand, slugify, SCAFFOLD_FOLDERS } from "./commands/scaffold.js";
export {
  validateCommand,
  runValidation,
  checkLinks,
  checkRequired,
  REPO_REQUIRED,
  PROJECT_REQUIRED,
} from "./commands/validate.js";
export { doctorCommand, runDoctor, detectMode, parseRuntimeConfig } from "./commands/doctor.js";
export { updateIndexCommand } from "./commands/update-index.js";
export { convertLinkingCommand, toObsidian, toPlain } from "./commands/convert-linking.js";

export { codexCommand } from "./commands/codex.js";
