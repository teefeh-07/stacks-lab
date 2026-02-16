# Automation Scripts

This folder contains all automation scripts for generating micro-commits.

## Scripts

### Core Scripts
- **auto-commit.cjs** - Base class with Git operations
- **run-all.cjs** - Master orchestration script (RUN THIS!)

### Generators
- **init-git.cjs** - Initialize Git repository
- **feature-generator.cjs** - Generate feature branches
- **mass-commits.cjs** - Generate mass commits
- **advanced-commits.cjs** - Generate advanced features

## Usage

### Run Everything (Recommended)
```bash
npm run automate
```

### Individual Scripts
```bash
npm run git:init              # Initialize Git only
npm run generate:features     # Generate features only
npm run generate:commits      # Generate mass commits only
```

## What Each Script Does

### run-all.cjs
- Orchestrates all other scripts
- Manages the entire automation flow
- Creates 200+ commits and 20+ branches

### init-git.cjs
- Removes existing .git folder
- Initializes new repository
- Sets remote to GitHub

### feature-generator.cjs
Creates branches with commits for:
- Clarity v4 upgrade
- WalletConnect integration
- Chainhooks integration

### mass-commits.cjs
Creates commits for:
- Documentation (API, Architecture, Security, Testing)
- Utilities (Validation, Formatting, API, Storage)
- Components (Wallet, Transactions, NFTs)
- Tests (Unit, Integration)
- Contract helpers

### advanced-commits.cjs
Creates commits for:
- Stacks Connect enhancements
- Advanced UI components
- Configuration files
- Performance optimizations
- Analytics and tracking

## Output

All scripts generate:
- Conventional commit messages
- Detailed activity logs
- Branch management
- Merge operations

Check `ACTIVITY_LOG.md` in the project root for commit tracking.
