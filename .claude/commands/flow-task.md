# Flow Task Command

## Overview
This command automates the complete development workflow from creating a new worktree/branch to submitting a PR with all checks passing.

## Usage
```
/flow-task "description of the task or feature"
```

The task description will be available as `$ARGUMENTS`.

## Workflow Steps

### 1. Setup Worktree and Branch
- Parse task description from `$ARGUMENTS`
- Check if we're in a git repository
- Get the parent directory path
- Create a branch name from `$ARGUMENTS` (convert to kebab-case)
- Check if worktree already exists
- If not, create new worktree in parent directory: `../langomango.landing-{branch-name}`
- Create and checkout the new branch

### 2. Implement Task Step-by-Step
For each implementation step:

#### a. Plan the Implementation
- Analyze `$ARGUMENTS` to understand the task requirements
- Break down the task into small, atomic steps
- Use TodoWrite tool to track all steps
- Each step should be independently testable

#### b. Implement Step
- Make the code changes for the current step
- Keep changes minimal and focused
- Follow existing code patterns and conventions

#### c. Test Locally
- Run `yarn dev` to test the changes work
- Run `yarn lint` to check for linting errors
- Run `npx tsc --noEmit` to check for TypeScript errors
- Fix any errors before proceeding

#### d. Commit Changes
- Stage the relevant files
- Create a descriptive commit message following conventional commits
- Commit with message format: `{type}: {description of step}`

#### e. Push and Check CI
- Push the commit to remote: `git push -u origin {branch-name}`
- **WAIT for GitHub Actions to start running**
- Monitor the workflow status using `gh run list --branch {branch-name}`
- **WAIT for all checks to complete** (this may take several minutes)
- Check the status of the latest workflow run
- If checks fail:
  - Analyze the error logs using `gh run view {run-id}`
  - Fix the issues locally
  - Amend the commit or create a fix commit
  - Push again
  - **WAIT for the new checks to complete**
  - Re-verify all checks pass

#### f. Repeat for Next Step
- Only proceed after all CI checks are green
- Mark current todo as completed
- Move to next implementation step
- Repeat until all steps are complete

### 3. Create Pull Request
- Ensure all commits are pushed and all checks are passing
- Create PR targeting `develop` branch using `gh pr create`
- PR title should summarize `$ARGUMENTS`
- PR body should include:
  - Summary of changes based on `$ARGUMENTS`
  - List of all implementation steps
  - Testing instructions
  - Any breaking changes or notes

### 4. Verify PR Checks
- **WAIT for PR checks to start**
- Monitor PR status checks using `gh pr checks`
- **WAIT for all PR checks to complete** (this may take several minutes)
- If any checks fail:
  - View detailed logs: `gh pr checks --watch`
  - Pull the latest changes
  - Fix the failing checks
  - Push fixes
  - **WAIT for checks to re-run and complete**
  - Re-verify all checks pass
- Ensure PR is ready for review

## Implementation Script

```bash
# Parse arguments
TASK_DESCRIPTION="$ARGUMENTS"

# Convert task description to branch name (kebab-case)
# Example: "Add dark mode toggle" -> "add-dark-mode-toggle"
BRANCH_NAME="feat/$(echo "$TASK_DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')"

# Get parent directory
PARENT_DIR=$(dirname $(pwd))
WORKTREE_DIR="$PARENT_DIR/langomango.landing-${BRANCH_NAME#feat/}"

# Check if worktree exists
if [ -d "$WORKTREE_DIR" ]; then
    echo "Worktree already exists at $WORKTREE_DIR"
    cd "$WORKTREE_DIR"
else
    echo "Creating new worktree for: $TASK_DESCRIPTION"
    cd "$PARENT_DIR"
    git worktree add "langomango.landing-${BRANCH_NAME#feat/}" -b "$BRANCH_NAME"
    cd "$WORKTREE_DIR"
fi

# Install dependencies
yarn install

# Now proceed with implementation based on $ARGUMENTS
echo "Ready to implement: $TASK_DESCRIPTION"
```

## Monitoring GitHub Actions

### Check workflow runs
```bash
# List recent runs for the branch
gh run list --branch {branch-name}

# Watch a specific run (waits until completion)
gh run watch {run-id}

# View run details and logs
gh run view {run-id} --log
```

### Check PR status
```bash
# Check PR checks status
gh pr checks {pr-number}

# Watch PR checks (waits until completion)
gh pr checks {pr-number} --watch
```

## Example with $ARGUMENTS

When called with:
```
/flow-task "Add dark mode toggle to header component"
```

The command will:
1. Set `$ARGUMENTS` = "Add dark mode toggle to header component"
2. Create branch name: `feat/add-dark-mode-toggle-to-header-component`
3. Create worktree: `../langomango.landing-add-dark-mode-toggle-to-header-component`
4. Implement step by step, **waiting for CI checks after each commit**
5. Create PR only after all commits pass their checks
6. **Wait for PR checks to complete** before marking task as done

## Creating the PR

When creating the PR, always target the `develop` branch:
```bash
gh pr create --base develop --title "feat: $TASK_DESCRIPTION" --body "$(cat <<'EOF'
## Summary
Implements: $TASK_DESCRIPTION

## Changes
- [List of changes made]

## Test Plan
- [How to test the changes]

## Checklist
- [ ] All tests pass
- [ ] Lint checks pass
- [ ] TypeScript checks pass
- [ ] Tested locally
- [ ] CI/CD checks pass
EOF
)"
```

## Important Notes

- `$ARGUMENTS` contains the full task description as provided by the user
- The PR must always target the `develop` branch
- **ALWAYS WAIT for CI/CD checks to complete before proceeding**
- Each commit should pass all checks independently
- Use conventional commit messages
- Keep PRs focused and reviewable
- Test thoroughly before pushing
- Be patient - CI/CD checks can take several minutes
- Document any environment changes needed