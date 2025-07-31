# GitHub Actions CI/CD Pipeline

## Overview

The CI/CD pipeline is configured to run tests in a sequential manner:

1. **Unit Tests** - Runs linting, TypeScript checks, and unit tests
2. **Vercel Deployment** - Automatic deployment via Vercel GitHub integration
3. **Playwright E2E Tests** - Runs end-to-end tests after Vercel deployment completes

If any step fails, the subsequent steps will not run.

## How It Works

- Unit tests (linting, TypeScript checks) run first on every push/PR
- Vercel automatically deploys via their GitHub integration (not controlled by this workflow)
- Playwright E2E tests run after unit tests pass
- E2E tests run against a local build to avoid authentication issues with Vercel preview deployments

## Workflow Files

- `ci-cd.yml` - Main sequential pipeline
- `claude.yml` - Claude AI assistant for PR reviews (unchanged)
- `codeql-analysis.yml` - Security scanning (unchanged)
- `playwright-sharded.yml` - Sharded Playwright tests (kept for manual runs)
- `*.yml.disabled` - Disabled workflows that are now part of the unified pipeline

## Running Tests Locally

```bash
# Lint
yarn lint

# TypeScript check
npx tsc --noEmit

# Playwright tests
yarn test
```