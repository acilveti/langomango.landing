I want to develop features in parallel using Git worktrees and subagents: $ARGUMENTS

You are in the langomango.landing folder. You will need to set up worktrees for parallel development.

Please execute this complete workflow:

PHASE 1 - SETUP WORKTREES:
For each feature mentioned:
1. Create a worktree at ../langomango-[feature-name] with branch feature/[feature-name]
2. Set up the development environment in each worktree (yarn install)
3. List all worktrees created

PHASE 2 - SPAWN SUBAGENTS:
For each feature, run a subagent in parallel with these instructions:
- You are working in the langomango-[feature-name] worktree directory
- This is a completely isolated development environment
- Implement the [feature-name] feature with full functionality
- Include proper testing and error handling
- Run lint (yarn lint) and type checks (npx tsc --noEmit)
- When complete, write a detailed summary in [feature-name].work.txt in the worktree root

PHASE 3 - SUMMARY:
After all subagents complete:
1. Summarize the work done in each worktree
2. List any conflicts or integration considerations
3. Provide next steps for merging the features

Important notes:
- Each worktree is independent - avoid conflicts between features
- Follow the project's conventions (styled-components, i18n, TypeScript strict mode)
- Ensure all features are mobile-responsive
- Add necessary translations to locales files