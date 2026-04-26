# npm security / audit

## What we do

- Run `npm audit` in CI or before releases; apply **`npm audit fix`** (non-breaking) when it clears issues.
- Keep **`firebase`**, **`firebase-admin`**, and other network-facing dependencies on current minors/patches when practical.

## Known constraints

- Remaining `npm audit` items are often **nested** under large SDKs. Fixing them may require **upstream** releases or risk breaking `firebase-admin` if forced to an older sub-dependency.
- Do **not** use `npm audit fix --force` blindly in this repo: it can downgrade or conflict with `firebase-admin` or Node resolution.

## Process

1. `npm audit`
2. `npm audit fix`
3. If still reporting issues, check whether the path is `firebase-admin` / `@google-cloud/*` / `gaxios` and track the parent package’s changelog.
4. Consider **overrides** in `package.json` only for a **pinned, tested** version, then `npm test` / `npm run build`.

See also `docs/OPS.md` for production env and Sentry.
