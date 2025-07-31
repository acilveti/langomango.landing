# Create Worktree Command

## Overview
This command creates a new git worktree and branch for a given feature, setting up a clean workspace for development.

## Usage
```
/create-worktree "feature description"
```

The feature description will be available as `$ARGUMENTS`.

## Workflow Steps

### 1. Parse Feature Name
- Extract feature description from `$ARGUMENTS`
- Convert to kebab-case for branch naming
- Example: "Add dark mode toggle" → "add-dark-mode-toggle"

### 2. Setup Directory Access
- **REQUIRED**: Use `/add-dir ..` to include parent directory
- This allows creating sibling worktrees alongside the main repository

### 3. Create Branch and Worktree
- Check if we're in a git repository
- Create branch name: `feature/[kebab-case-name]`
- Create worktree at: `../langomango-[kebab-case-name]`
- The worktree will be created as a sibling to the current repository

### 4. Navigate and Install
- Change directory to the new worktree
- Install dependencies with `npm install` or `yarn install`
- Confirm successful setup

## Implementation Steps

1. Extract feature description from `$ARGUMENTS`
2. Convert to kebab-case: replace spaces with hyphens, lowercase
3. Use `/add-dir ..` to include parent directory
4. Create feature branch: `feature/[kebab-case-name]`
5. Create worktree: `git worktree add ../langomango-[kebab-case-name] feature/[kebab-case-name]`
6. Navigate to worktree: `cd ../langomango-[kebab-case-name]`
7. Install dependencies
8. Display confirmation with next steps

## Example

When called with:
```
/create-worktree "Add user authentication"
```

The command will:
1. Parse `$ARGUMENTS` = "Add user authentication"
2. Convert to kebab-case: "add-user-authentication"
3. Include parent directory with `/add-dir ..`
4. Create branch: `feature/add-user-authentication`
5. Create worktree: `../langomango-add-user-authentication`
6. Navigate and install dependencies
7. Ready for development!

## Output
After successful execution, the command should display:
- ✅ Created branch: `feature/[name]`
- ✅ Created worktree at: `../langomango-[name]`
- ✅ Dependencies installed
- 📍 Current directory: `[absolute-path-to-worktree]`
- 🚀 Ready to start development!

## Important Notes

- **CRITICAL**: Parent directory must be included via `/add-dir ..` before creating worktree
- Branch names always use the `feature/` prefix
- Worktree names always use the `langomango-` prefix
- The worktree is created as a sibling to the main repository
- Dependencies are automatically installed after creation