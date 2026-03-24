# Requirements Document

## Introduction

The repository root contains approximately 60 loose Node.js scripts accumulated during development. These scripts clutter the root alongside standard Next.js config files and must be cleaned up: 57 scripts are to be permanently deleted, and 3 operational scripts are to be moved into a new `scripts/ops/` directory. One of the scripts being moved (`deploy_worker_fix.js`) contains hardcoded secrets that must be replaced with environment variable reads before it is committed. After cleanup, the root should contain only standard Next.js config files and the canonical source directories (`src/`, `cloudflare/`, `public/`).

## Glossary

- **Cleanup_Script**: The process (manual or automated) that executes the repo cleanup steps defined in this document
- **Operational_Script**: A Node.js script that performs a repeatable, production-relevant task (deploy, data migration, git ops) and is worth preserving
- **Throwaway_Script**: A Node.js script whose sole purpose was a one-time action (writing source files, patching code, or reading/inspecting files for debugging) and is no longer needed
- **scripts/ops/**: The target directory for preserved operational scripts, located at `<repo-root>/scripts/ops/`
- **Sanitized_Script**: A version of `deploy_worker_fix.js` with all hardcoded secrets replaced by environment variable reads
- **Root**: The repository root directory (the directory containing `package.json`, `next.config.js`, etc.)

## Requirements

### Requirement 1: Delete Throwaway Scripts

**User Story:** As a developer, I want all one-off code-writer, patcher, and diagnostic scripts removed from the repository, so that the root is not cluttered with dead code.

#### Acceptance Criteria

1. THE Cleanup_Script SHALL delete all 40 code-writer scripts listed in Category A of the design (all files matching the pattern `write_*.js`, `build_page.js`, `update_auto_news.js`).
2. THE Cleanup_Script SHALL delete all 6 one-time patcher scripts listed in Category B of the design (`patch_dedup.js`, `patch_dedup2.js`, `patch_routes.js`, `fix_worker_syntax.js`, `fix_worker_syntax2.js`, `fix_both_seen.js`).
3. THE Cleanup_Script SHALL delete all 10 diagnostic/inspection scripts listed in Category C of the design (`check_line796.js`, `check_seen_area.js`, `check_seen_area2.js`, `check_seen_post.js`, `check_worker_line.js`, `find_getip.js`, `read_files.js`, `read_worker.js`, `read_worker_top.js`, `verify_task4.js`).
4. WHEN a throwaway script is deleted, THE Cleanup_Script SHALL preserve the deletion in git history so the file can be recovered via `git checkout`.
5. IF a script file listed for deletion does not exist at execution time, THEN THE Cleanup_Script SHALL skip that file and continue without error.

### Requirement 2: Create scripts/ops/ Directory

**User Story:** As a developer, I want a dedicated `scripts/ops/` directory, so that operational scripts have a clear, organized home separate from source code.

#### Acceptance Criteria

1. THE Cleanup_Script SHALL create the directory `scripts/ops/` at the repository root if it does not already exist.
2. WHEN `scripts/ops/` is created, THE Cleanup_Script SHALL ensure the directory is tracked by git (e.g., via a `.gitkeep` or by the presence of the moved scripts).

### Requirement 3: Move Operational Scripts

**User Story:** As a developer, I want the three operational scripts moved to `scripts/ops/`, so that they are preserved and easy to find.

#### Acceptance Criteria

1. THE Cleanup_Script SHALL move `add_feeds.js` from the repository root to `scripts/ops/add_feeds.js`.
2. THE Cleanup_Script SHALL move `push_news_sitemap.js` from the repository root to `scripts/ops/push_news_sitemap.js`.
3. WHEN operational scripts are moved, THE Cleanup_Script SHALL remove the originals from the repository root.
4. IF a destination file already exists in `scripts/ops/`, THEN THE Cleanup_Script SHALL not overwrite it without explicit confirmation.

### Requirement 4: Sanitize deploy_worker_fix.js Before Moving

**User Story:** As a developer, I want `deploy_worker_fix.js` sanitized of hardcoded secrets before it is committed to `scripts/ops/`, so that credentials are never stored in version control.

#### Acceptance Criteria

1. THE Cleanup_Script SHALL create `scripts/ops/deploy_worker.js` as a sanitized copy of `deploy_worker_fix.js` with all hardcoded secret values replaced by `process.env` reads.
2. THE Sanitized_Script SHALL read the Cloudflare API token from `process.env.CLOUDFLARE_API_TOKEN`.
3. THE Sanitized_Script SHALL read the automation secret from `process.env.AUTOMATE_SECRET`.
4. WHEN `scripts/ops/deploy_worker.js` is executed without `CLOUDFLARE_API_TOKEN` set, THE Sanitized_Script SHALL throw a descriptive error and exit before executing any commands.
5. WHEN `scripts/ops/deploy_worker.js` is executed without `AUTOMATE_SECRET` set, THE Sanitized_Script SHALL throw a descriptive error and exit before executing any commands.
6. THE Cleanup_Script SHALL delete `deploy_worker_fix.js` from the repository root after the sanitized version is created.
7. THE Sanitized_Script SHALL NOT contain any literal secret values (API tokens, passwords, or keys).

### Requirement 5: Root Cleanliness After Cleanup

**User Story:** As a developer, I want the repository root to contain only standard config files and canonical source directories after cleanup, so that the project structure is immediately understandable to new contributors.

#### Acceptance Criteria

1. WHEN cleanup is complete, THE Root SHALL contain no `.js` files other than standard Next.js config files (`next.config.js`, `postcss.config.js`).
2. WHEN cleanup is complete, THE Root SHALL retain `src/`, `cloudflare/`, and `public/` directories unchanged.
3. WHEN cleanup is complete, THE Root SHALL retain all standard config files (`package.json`, `tsconfig.json`, `tailwind.config.ts`, `vercel.json`, `next.config.js`, `postcss.config.js`, etc.) unchanged.
4. WHEN cleanup is complete, THE Root SHALL contain the new `scripts/` directory with the three operational scripts inside `scripts/ops/`.

### Requirement 6: Build Integrity Verification

**User Story:** As a developer, I want to verify that the Next.js build still passes after cleanup, so that I can confirm no source files were accidentally deleted.

#### Acceptance Criteria

1. WHEN cleanup is complete, running `next build` SHALL succeed without errors.
2. WHEN cleanup is complete, running `npx wrangler deploy --dry-run` from the `cloudflare/` directory SHALL succeed without errors.
3. IF `next build` fails after cleanup, THEN THE developer SHALL be able to recover any accidentally deleted file using `git checkout <hash> -- <filename>`.
