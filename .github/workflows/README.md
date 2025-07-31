# GitHub Actions CI/CD Pipeline

## Overview

The CI/CD pipeline is configured to run tests and deployments in a sequential manner:

1. **Unit Tests** - Runs linting, TypeScript checks, and unit tests
2. **Vercel Deployment** - Deploys to Vercel (only if tests pass)
3. **Playwright E2E Tests** - Runs end-to-end tests (only if deployment succeeds)

If any step fails, the subsequent steps will not run.

## Required Secrets

The following secrets need to be configured in the repository settings:

- `VERCEL_TOKEN` - Your Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

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