# Local Model Workflow

This project can be analyzed locally with a small `llama.cpp` runtime and a Qwen coder GGUF.

## Installed local runtime

- Runtime: `/Users/joeiton/Tools/llama.cpp/llama-b8833/llama-cli`
- Model: `/Users/joeiton/Tools/llama.cpp/Qwen2.5-Coder-1.5B-Instruct-Q4_K_M.gguf`

## Quick start

Run a one-off prompt:

```bash
"/Users/joeiton/Tools/llama.cpp/llama-b8833/llama-cli" \
  -m "/Users/joeiton/Tools/llama.cpp/Qwen2.5-Coder-1.5B-Instruct-Q4_K_M.gguf" \
  -ngl 0 \
  -t 4 \
  -c 2048 \
  -n 256 \
  -p "Summarize the CheapVacay stack and name the first files to inspect."
```

Load repo files directly into the prompt context:

```bash
cd /Users/joeiton/Desktop/Rob/AndroidStudioProjects/cheapvacay
"/Users/joeiton/Tools/llama.cpp/llama-b8833/llama-cli" \
  -m "/Users/joeiton/Tools/llama.cpp/Qwen2.5-Coder-1.5B-Instruct-Q4_K_M.gguf" \
  -ngl 0 \
  -t 4 \
  -c 4096 \
  -n 384
```

Inside the interactive prompt:

```text
/read README.md
/read package.json
/read server.ts
/glob src/**/*.tsx
Summarize the app architecture, request flow, and deployment assumptions.
```

## Recommended codebase analysis flow

1. Read `README.md`, `package.json`, `server.ts`, and `src/`.
2. Ask for stack, entrypoints, API boundaries, env vars, and deploy targets.
3. Ask for one subsystem at a time instead of the whole repo at once.
4. Ask for proposed edits only after the model has summarized the current patterns.

## Current contact data workflow

Use the local model for reasoning, not discovery.

1. Fetch current company/contact data from live sources such as company sites, LinkedIn, CRM exports, or Apollo CSVs.
2. Save the retrieved text or CSV excerpts locally.
3. Load those files into `llama-cli` with `/read`.
4. Ask the model to rank likely contact paths and explain confidence based only on the retrieved evidence.

Example:

```text
/read docs/contact-research/acme.txt
/read docs/contact-research/acme-linkedin.txt
Based only on these files, who should be contacted first, through which channel, and why?
```

## Limits

- This local model is small enough to run on an 8 GB Intel Mac, but it is not a substitute for larger hosted coding models.
- It will not know live contact information unless you retrieve it first.
- Keep prompts focused and file subsets small for better results on this hardware.
