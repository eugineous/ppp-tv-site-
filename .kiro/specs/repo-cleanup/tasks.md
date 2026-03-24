# Implementation Plan: repo-cleanup

## Overview

Delete 57 throwaway scripts from the repo root, create `scripts/ops/`, move 3 operational scripts, and write a sanitized `deploy_worker.js` that reads secrets from environment variables.

## Tasks

- [x] 1. Create `scripts/ops/` directory
  - Create `scripts/ops/.gitkeep` to ensure the directory is tracked by git
  - _Requirements: 2.1, 2.2_

- [x] 2. Create sanitized `scripts/ops/deploy_worker.js`
  - [x] 2.1 Write `scripts/ops/deploy_worker.js` reading secrets from `process.env.CLOUDFLARE_API_TOKEN` and `process.env.AUTOMATE_SECRET`
    - Throw a descriptive error and exit before running any commands if either env var is missing
    - Do not include any literal secret values
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7_

  - [ ]* 2.2 Write property test for deploy_worker.js — Property 3: Sanitized deploy script contains no literal secrets
    - **Property 3: Sanitized deploy script contains no literal secrets**
    - Read `scripts/ops/deploy_worker.js` as a string and assert it contains no hardcoded token/secret literals
    - Assert it contains `process.env.CLOUDFLARE_API_TOKEN` and `process.env.AUTOMATE_SECRET`
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.7**

  - [ ]* 2.3 Write property test for deploy_worker.js — Property 4: Missing env vars cause early descriptive errors
    - **Property 4: Missing env vars cause early descriptive errors**
    - Execute `scripts/ops/deploy_worker.js` with each required env var absent and assert it throws before invoking wrangler
    - **Validates: Requirements 4.4, 4.5**

- [x] 3. Move non-secret operational scripts to `scripts/ops/`
  - Copy `add_feeds.js` → `scripts/ops/add_feeds.js`
  - Copy `push_news_sitemap.js` → `scripts/ops/push_news_sitemap.js`
  - _Requirements: 3.1, 3.2_

- [x] 4. Delete Category A — code-writer scripts
  - Delete all 40 `write_*.js` files, `build_page.js`, and `update_auto_news.js` listed in design Category A
  - Skip any file that does not exist without error
  - _Requirements: 1.1, 1.5_

- [x] 5. Delete Category B — one-time patcher scripts
  - Delete `patch_dedup.js`, `patch_dedup2.js`, `patch_routes.js`, `fix_worker_syntax.js`, `fix_worker_syntax2.js`, `fix_both_seen.js`
  - Skip any file that does not exist without error
  - _Requirements: 1.2, 1.5_

- [x] 6. Delete Category C — diagnostic/inspection scripts
  - Delete `check_line796.js`, `check_seen_area.js`, `check_seen_area2.js`, `check_seen_post.js`, `check_worker_line.js`, `find_getip.js`, `read_files.js`, `read_worker.js`, `read_worker_top.js`, `verify_task4.js`
  - Skip any file that does not exist without error
  - _Requirements: 1.3, 1.5_

- [x] 7. Delete originals of moved scripts and `deploy_worker_fix.js` from root
  - Delete `add_feeds.js`, `push_news_sitemap.js`, and `deploy_worker_fix.js` from the repository root
  - _Requirements: 3.3, 4.6_

- [x] 8. Checkpoint — verify root cleanliness
  - Assert no `.js` files remain in the root other than `next.config.js` and `postcss.config.js`
  - Assert `scripts/ops/` contains exactly `add_feeds.js`, `deploy_worker.js`, `push_news_sitemap.js`
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 5.1, 5.4_

  - [ ]* 8.1 Write property test — Property 1: All throwaway scripts are absent after cleanup
    - **Property 1: All throwaway scripts are absent after cleanup**
    - For each filename in Category A, B, and C, assert the file does not exist at the repo root
    - **Validates: Requirements 1.1, 1.2, 1.3**

  - [ ]* 8.2 Write property test — Property 2: Operational scripts are relocated, not duplicated
    - **Property 2: Operational scripts are relocated, not duplicated**
    - Assert original filenames (`add_feeds.js`, `push_news_sitemap.js`, `deploy_worker_fix.js`) do not exist at root
    - Assert corresponding files exist under `scripts/ops/`
    - **Validates: Requirements 3.1, 3.2, 3.3, 4.6**

  - [ ]* 8.3 Write property test — Property 5: Root contains only allowed .js files after cleanup
    - **Property 5: Root contains only allowed .js files after cleanup**
    - List all `.js` files at repo root depth 1 and assert the set equals `{next.config.js, postcss.config.js}`
    - **Validates: Requirements 5.1**

  - [ ]* 8.4 Write property test — Property 6: scripts/ops/ contains exactly the three operational scripts
    - **Property 6: scripts/ops/ contains exactly the three operational scripts**
    - List `scripts/ops/` and assert it contains exactly `add_feeds.js`, `deploy_worker.js`, `push_news_sitemap.js`
    - **Validates: Requirements 5.4**

- [x] 9. Final checkpoint — build integrity
  - Confirm `src/`, `cloudflare/`, and `public/` directories are untouched
  - Confirm all standard config files (`package.json`, `tsconfig.json`, `tailwind.config.ts`, `vercel.json`, `next.config.js`, `postcss.config.js`) are present
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 5.2, 5.3, 6.1, 6.2_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All deletions are preserved in git history and recoverable via `git checkout <hash> -- <filename>`
- `deploy_worker_fix.js` contains hardcoded secrets — rotate the Cloudflare API token and `AUTOMATE_SECRET` before or immediately after running task 7
- Property tests can be written as simple Node.js assertion scripts or integrated into the existing vitest setup
