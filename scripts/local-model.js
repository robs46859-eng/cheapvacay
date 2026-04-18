#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import process from "node:process";

const LLAMA_CLI =
  process.env.LLAMA_CLI_PATH ||
  "/Users/joeiton/Tools/llama.cpp/llama-b8833/llama-completion";

const MODEL_PATH =
  process.env.LOCAL_CODE_MODEL_PATH ||
  "/Users/joeiton/Tools/llama.cpp/Qwen2.5-Coder-1.5B-Instruct-Q4_K_M.gguf";

function usage() {
  console.error("Usage:");
  console.error("  npm run local:model -- --prompt \"your prompt\"");
  console.error("  npm run local:model -- --prompt-file path/to/prompt.txt");
  console.error("  npm run local:model -- --help");
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const part = argv[index];
    if (!part.startsWith("--")) continue;
    const key = part.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  usage();
  process.exit(0);
}

if (!existsSync(LLAMA_CLI)) {
  console.error(`llama-cli not found at ${LLAMA_CLI}`);
  process.exit(1);
}

if (!existsSync(MODEL_PATH)) {
  console.error(`model not found at ${MODEL_PATH}`);
  process.exit(1);
}

let prompt = "";
if (typeof args["prompt-file"] === "string") {
  prompt = readFileSync(String(args["prompt-file"]), "utf8");
} else if (typeof args.prompt === "string") {
  prompt = String(args.prompt);
}

if (!prompt.trim()) {
  usage();
  process.exit(1);
}

const result = spawnSync(
  LLAMA_CLI,
  [
    "--log-disable",
    "-m",
    MODEL_PATH,
    "-ngl",
    "0",
    "-t",
    process.env.LOCAL_MODEL_THREADS || "4",
    "-c",
    process.env.LOCAL_MODEL_CONTEXT || "4096",
    "-n",
    process.env.LOCAL_MODEL_TOKENS || "384",
    "-p",
    prompt,
  ],
  {
    stdio: "inherit",
  },
);

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
