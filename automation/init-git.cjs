#!/usr/bin/env node

/**
 * Git Initialization Script
 * Removes old .git folder and initializes new repository
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REMOTE_URL = 'https://github.com/teefeh-07/stacks-lab.git';
const PROJECT_ROOT = path.join(__dirname, '..');

function exec(command) {
    try {
        console.log(`Executing: ${command}`);
        const output = execSync(command, {
            encoding: 'utf-8',
            cwd: PROJECT_ROOT,
            stdio: 'inherit'
        });
        return output;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}

function removeGitFolder() {
    const gitPath = path.join(PROJECT_ROOT, '.git');

    if (fs.existsSync(gitPath)) {
        console.log('Removing existing .git folder...');

        // Use rmdir on Windows
        try {
            execSync(`rmdir /s /q "${gitPath}"`, {
                shell: true,
                cwd: PROJECT_ROOT
            });
            console.log('✓ .git folder removed successfully');
            return true;
        } catch (error) {
            console.error('Error removing .git folder:', error.message);
            return false;
        }
    } else {
        console.log('.git folder does not exist');
        return true;
    }
}

function initializeGit() {
    console.log('\nInitializing new Git repository...');
    exec('git init');

    console.log('\nSetting up remote origin...');
    exec(`git remote add origin ${REMOTE_URL}`);

    // Set local identity for commits to work
    exec('git config user.email "bot@stackslab.com"');
    exec('git config user.name "Antigravity Bot"');

    console.log('\nConfiguring Git settings...');
    exec('git config core.autocrlf true');
    exec('git config core.safecrlf false');

    console.log('\n✓ Git initialization complete!');
}

function createGitignore() {
    const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');

    if (!fs.existsSync(gitignorePath)) {
        const content = `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Clarinet
.cache/
settings/Devnet.toml
settings/Testnet.toml
settings/Mainnet.toml

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
logs/

# Database
*.db
*.sqlite

# Redis
dump.rdb
`;

        fs.writeFileSync(gitignorePath, content);
        console.log('✓ Created .gitignore file');
    }
}

function displayInfo() {
    console.log('\n' + '='.repeat(60));
    console.log('GIT INITIALIZATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`Remote URL: ${REMOTE_URL}`);
    console.log('Next steps:');
    console.log('  1. Stage and commit initial files');
    console.log('  2. Push to remote: git push -u origin main');
    console.log('  3. Run automation scripts to generate micro-commits');
    console.log('='.repeat(60) + '\n');
}

// Main execution
console.log('Starting Git re-initialization process...\n');

if (removeGitFolder()) {
    initializeGit();
    createGitignore();
    displayInfo();
} else {
    console.error('Failed to remove .git folder. Please remove it manually and try again.');
    process.exit(1);
}
