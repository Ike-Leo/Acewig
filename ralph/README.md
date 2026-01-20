# Ralph - Autonomous Development Agent

## Overview

Ralph is an autonomous AI agent loop that works through PRD stories iteratively until all features are complete. Each iteration runs a fresh Claude instance with clean context.

## Quick Start

```bash
# Run Ralph (from your project directory)
cd ralph
./ralph.sh [max_iterations]

# Example: Run up to 20 iterations
./ralph.sh 20
```

## Key Files

### Core Files

- **[CLAUDE.md](./CLAUDE.md)** - Main instructions for the Claude agent (renamed from `ralphagent.md`)
- **[prd.json](./prd.json)** - Product requirements with user stories
- **[progress.txt](./progress.txt)** - Progress log with learnings and patterns
- **[ralph.sh](./ralph.sh)** - Bash loop that spawns fresh Claude instances

### Browser Testing Files

- **[browser-test-agent.md](./browser-test-agent.md)** - Standalone agent for UI testing
- **[browser-test-flow.md](./browser-test-flow.md)** - Complete browser testing workflow

### Archive

- **[archive/](./archive/)** - Previous runs are archived here by date and branch

## How It Works

### The Loop

1. Read `prd.json` to find the highest priority incomplete story
2. Implement that single story
3. Run quality checks (typecheck, lint, test)
4. Update `CLAUDE.md` files if patterns are discovered
5. Commit changes with message: `feat: [Story ID] - [Story Title]`
6. Update PRD to mark story as complete
7. Append progress to `progress.txt`
8. Repeat until all stories are complete

### Browser Testing for UI Stories

When a story involves UI changes:

1. Main agent implements the feature
2. Triggers browser testing agent
3. Browser testing agent:
   - Starts dev server
   - Opens browser
   - Verifies UI works correctly
   - Takes screenshots
   - Reports PASS/FAIL
4. Main agent uses report to determine completion

See [browser-test-flow.md](./browser-test-flow.md) for complete testing workflow.

## PRD Format

```json
{
  "project": "Project Name",
  "branchName": "feature/branch",
  "stories": [
    {
      "id": "STRY-001",
      "title": "Story Title",
      "priority": 1,
      "passes": false,
      "description": "Detailed description of what needs to be implemented"
    }
  ]
}
```

## Progress Tracking

### progress.txt Format

```markdown
# Ralph Progress Log
Started: 2025-01-12 10:00:00

---

## Codebase Patterns
- Use Convex v.id() for foreign key references
- All mutations must be wrapped in try-catch
- UI components go in /components directory

## 2025-01-12 14:30 - STRY-001
Thread: https://ampcode.com/threads/abc123
- Implemented user authentication
- Files: convex/auth.ts, components/LoginForm.tsx
- **Learnings for future iterations:**
  - Use Convex Auth for authentication (email/password or OAuth)
  - Don't forget to update Convex schema when adding new fields
  - Test with both authenticated and guest users

---
```

## Claude Instructions (CLAUDE.md)

The main instruction file tells the Claude agent how to work:

1. Read PRD and progress
2. Check correct branch
3. Pick highest priority incomplete story
4. Implement it
5. Run quality checks
6. Update documentation (CLAUDE.md files in subdirectories)
7. Commit and update PRD
8. Log progress
9. Stop when all stories complete

## AGENTS.md → CLAUDE.md Migration

**Important:** This environment uses `CLAUDE.md` instead of `AGENTS.md` for agent instructions.

- `CLAUDE.md` - Project-specific instructions for Claude
- `CLAUDE.md` in subdirectories - Module-specific instructions
- Claude automatically discovers and reads these files

When adding learnings, update `CLAUDE.md` files (not `AGENTS.md`).

## Quality Requirements

- ALL commits must pass quality checks
- Do NOT commit broken code
- Keep changes focused and minimal
- Follow existing code patterns
- Browser test ALL UI changes

## Completion Signal

When all stories are complete, the agent outputs:
```
<promise>COMPLETE</promise>
```

The loop then exits successfully.

## Archive Behavior

When switching branches, Ralph automatically:
1. Archives the previous run's `prd.json` and `progress.txt`
2. Creates a fresh progress log for the new branch
3. Continues work on the new branch

Archive format: `archive/YYYY-MM-DD-branch-name/`

## Examples

See the example PRD and skills for reference implementations.

## Troubleshooting

### Branch Issues

```bash
# Check current branch
git branch --show-current

# Switch to PRD branch
git checkout $(jq -r '.branchName' ralph/prd.json)
```

### Quality Check Failures

```bash
# Run checks manually
npm run typecheck
npm run lint
npm run test
```

### Browser Testing Issues

```bash
# Kill stuck dev server
npx kill-port 3000

# Start fresh
npm run dev
```

See [browser-test-flow.md](./browser-test-flow.md) for more troubleshooting.

## Tips for Success

1. **Small Stories** - Keep stories small enough for one context window
2. **Clear Descriptions** - Be specific about what needs to be implemented
3. **Test Requirements** - Include acceptance criteria in story descriptions
4. **Progress Patterns** - Check `progress.txt` before starting to learn from previous iterations
5. **Browser Testing** - Always test UI changes in browser before marking complete

## Integration with Claude Code

Ralph is designed to work with Claude Code's autonomous agent capabilities:

- Uses `CLAUDE.md` instruction files (standard Claude Code convention)
- Supports browser testing via specialized agent
- Tracks progress across iterations
- Archives work by branch for continuity

## License

MIT
