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
- Create a branch name from `$ARGUMENTS` (convert to kebab-case)
- **FIRST**: Use `/add-dir ..` to include parent directory in the session
  - This is required to create sibling worktrees
- Create a worktree at `../langomango-[feature-name]` with branch `feature/[feature-name]`
- Navigate to the new worktree directory
- Install dependencies

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
- Test the changes work locally
- Check for linting errors
- Check for TypeScript errors
- Fix any errors before proceeding

#### d. Commit Changes
- Stage the relevant files
- Create a descriptive commit message following conventional commits
- Commit with message format: `{type}: {description of step}`

#### e. Push and Check CI
- Push the commit to remote
- **WAIT for GitHub Actions to start running**
- Monitor the workflow status
- **WAIT for all checks to complete** (this may take several minutes)
- Check the status of the latest workflow run
- If checks fail:
  - Analyze the error logs
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
- Create PR targeting `develop` branch
- PR title should summarize `$ARGUMENTS`
- PR body should include:
  - Summary of changes based on `$ARGUMENTS`
  - List of all implementation steps
  - Testing instructions
  - Any breaking changes or notes

### 4. Verify PR Checks
- **WAIT for PR checks to start**
- Monitor PR status checks
- **WAIT for all PR checks to complete** (this may take several minutes)
- If any checks fail:
  - View detailed logs
  - Pull the latest changes
  - Fix the failing checks
  - Push fixes
  - **WAIT for checks to re-run and complete**
  - Re-verify all checks pass
- Ensure PR is ready for review

## Implementation Steps

1. Parse task description from `$ARGUMENTS`
2. Use `/add-dir ..` to include parent directory (required for sibling worktrees)
3. Convert task description to kebab-case for branch naming
4. Create branch name as `feature/[feature-name]`
5. Create worktree at `../langomango-[feature-name]`
6. Navigate to the new worktree
7. Install dependencies
8. Begin implementation based on `$ARGUMENTS`

## Monitoring GitHub Actions

### Check workflow runs
- List recent runs for the branch
- Watch specific runs until completion
- View run details and logs when needed

### Check PR status
- Monitor PR checks status
- Watch PR checks until completion
- Review any failed checks

## Example with $ARGUMENTS

When called with a task description like "Add dark mode toggle to header component":

The command will:
1. Set `$ARGUMENTS` to the task description
2. Use `/add-dir ..` to include parent directory in the session
3. Create feature name from the task description (kebab-case)
4. Create branch name: `feature/[feature-name]`
5. Create worktree: `../langomango-[feature-name]`
6. Navigate to the worktree and install dependencies
7. Implement step by step, **waiting for CI checks after each commit**
8. Create PR only after all commits pass their checks
9. **Wait for PR checks to complete** before marking task as done

## Creating the PR

When creating the PR:
- Always target the `develop` branch
- Use a descriptive title based on `$ARGUMENTS`
- Include in the PR body:
  - Summary of implementation
  - List of changes made
  - Test plan
  - Checklist of validations

## Important Notes

- **CRITICAL**: The parent directory must be included in the Claude session to create sibling worktrees
- `$ARGUMENTS` contains the full task description as provided by the user
- The PR must always target the `develop` branch
- **ALWAYS WAIT for CI/CD checks to complete before proceeding**
- Each commit should pass all checks independently
- Use conventional commit messages
- Keep PRs focused and reviewable
- Test thoroughly before pushing
- Be patient - CI/CD checks can take several minutes
- Document any environment changes needed