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

## Parallel-agent branch and worktree isolation (mandatory)

These rules apply whenever multiple AI agents might operate on the repository, even if they are assigned different tasks.

- **One agent = one dedicated worktree + one dedicated feature branch.** Do not share a working directory between concurrent agents, and do not work in another agent's worktree.
- **Never switch branches inside an existing or shared checkout** to start a new task. A checkout on a feature branch may belong to another agent; a checkout on `main` may also be in use. Leave both untouched.
- **Never assume the current branch is a safe starting point.** All independent task branches must start explicitly from the latest fetched `origin/main`, not the current `HEAD`, another feature branch, or potentially stale local `main`. Only use another base with explicit approval for a dependent task.
- Each feature or independently assigned piece of work gets a distinct, descriptively named branch and worktree path. Do not reuse an agent's existing branch.
- Branches and Git metadata are shared across worktrees. Never reset, rebase, force-push, rename, delete, or otherwise manipulate branches owned by another agent.
- Never stash, clean, reset, discard, or overwrite another agent's uncommitted changes. If ownership or repository state is uncertain, stop and report the conflict rather than "fixing" the state.

### Required preflight: before editing any file

Run these commands in the checkout where the agent started:

```sh
pwd
git rev-parse --show-toplevel
git branch --show-current
git status --short --branch
git worktree list --porcelain
```

Identify the current branch, worktree root, other registered worktrees, and any uncommitted changes. Treat existing checkouts and changes as belonging to someone else unless clearly assigned otherwise. Do not change or clean them.

### Create a fresh isolated task worktree

For each new agent/task, from an existing repository checkout run:

```sh
git fetch origin main
git worktree add -b feat/astro-pop-flavor-details ../cosmoport_voyage-flavor-details origin/main
cd ../cosmoport_voyage-flavor-details
git rev-parse --show-toplevel
git branch --show-current
git status --short --branch
```

The branch and path above are examples: use **new unique names** appropriate to the assigned task. Check that both names are unused before creating them. `git worktree add -b ... origin/main` creates the new branch at the fetched remote main commit *without changing the original checkout*. If the fetch fails, do not claim the new branch is based on the latest main; report the blocker.

### While working and before committing or pushing

- Run all edits, installs, tests, builds, and commits from the agent's assigned worktree. Do not edit files through paths into the primary checkout or other worktrees.
- Recheck `git rev-parse --show-toplevel`, `git branch --show-current`, and `git status --short --branch` before commits and pushes. Stop if the worktree root or branch differs from the assignment.
- Review `git diff` and staged changes to ensure the PR contains only the assigned scope. Never mix another agent's task into the current branch.
- Open a PR against `main`. Do not merge it without explicit authorization.
- Do not remove worktrees or branches as automatic cleanup. Clean up only after their work is finished and removal is explicitly authorized; do not delete dirty worktrees.

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
- If Node/npm is unavailable, check whether `nvm use 22.23.4` is appropriate.
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
