# Instructions for AI Coding Agents

## Repository workflow

- Read this `AGENTS.md` before beginning any task.
- Verify the current branch and working tree status before modifying files.
- Never develop directly on `main`; create or use a dedicated feature branch for each task.
- Do not push directly to `main`. Use pull requests for all changes.
- Keep pull requests focused and reasonably small.
- Never merge a pull request without explicit authorization.
- Preserve unrelated changes and existing worktrees.
- Never reset, discard, or delete existing work without authorization.

## Project overview

- CosmoPort Voyage is being rebuilt as an interactive fictional space-tourism website.
- Visual direction: 1950s Space Age retrofuturism / Atompunk.
- The application lives at the repository root and uses Nuxt 4, Vue 3, TypeScript, Tailwind CSS v4, and DaisyUI v5.
- Vitest is used for testing.
- Sanity CMS is planned for future integration.
- Python, FastAPI, and MongoDB have been removed from the project.

## Development standards

- Follow existing project conventions.
- Prefer simple solutions over unnecessary abstractions.
- Avoid introducing dependencies without a clear reason.
- Keep components focused and reusable.
- Maintain responsive layouts and accessibility.
- Do not introduce backend services, authentication, or payment systems without approval.

## Validation

- Inspect the root `package.json` before choosing commands.
- If Node/npm is unavailable, check whether `nvm use 22.23.3` is appropriate.
- Install dependencies with `npm ci`.
- Run the test suite with `npm run test`.
- Run the production build with `npm run build`.
- Report what passed, failed, or could not be verified.
- Once CI is established, ensure required checks pass before merging.

## Security

- Never read or expose `.env` files, credentials, API tokens, or secrets.
- Never commit sensitive configuration.
- Use example configuration files to understand required environment variable names.
- Do not expose privileged Sanity API tokens in frontend code.

## Task completion

- Summarize the files changed.
- Report verification results.
- Identify blockers or unresolved issues.
- Do not expand the task beyond its approved scope.
