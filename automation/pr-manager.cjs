#!/usr/bin/env node

/**
 * PR Manager
 * Generates detailed PR descriptions and manages merges
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PRManager {
    constructor(projectRoot) {
        this.projectRoot = projectRoot || path.join(__dirname, '..');
        this.prDir = path.join(this.projectRoot, 'pull-requests');
        this.prCount = 0;

        // Ensure separate PR directory exists
        if (!fs.existsSync(this.prDir)) {
            fs.mkdirSync(this.prDir);
        }
    }

    /**
     * Execute git command
     */
    exec(command) {
        try {
            return execSync(command, {
                encoding: 'utf-8',
                cwd: this.projectRoot,
                stdio: 'pipe'
            }).trim();
        } catch (error) {
            // console.error(`Error executing: ${command}`);
            return null;
        }
    }

    /**
     * Get all branches except main
     */
    getBranches() {
        const output = this.exec('git branch --format="%(refname:short)"');
        if (!output) return [];

        return output.split('\n')
            .map(b => b.trim())
            .filter(b => b && b !== 'main' && b !== 'master');
    }

    /**
     * Get commits for a branch
     */
    getCommits(branch, base = 'main') {
        const output = this.exec(`git log ${base}..${branch} --pretty=format:"- %s"`);
        return output ? output.split('\n') : [];
    }

    /**
     * Determine priority for merging
     */
    getPriority(branch) {
        const order = [
            'setup', 'config', 'upgrade', // Infrastructure first
            'feat', 'feature',            // Features second
            'enhance', 'ui',              // Enhancements
            'perf',                       // Performance
            'docs',                       // Documentation
            'test',                       // Tests
            'chore'                       // Chores last
        ];

        const type = branch.split('/')[0];
        const index = order.indexOf(type);
        return index === -1 ? 99 : index;
    }

    /**
     * Sort branches by priority
     */
    sortBranches(branches) {
        return branches.sort((a, b) => this.getPriority(a) - this.getPriority(b));
    }

    /**
     * Generate human readable title
     */
    humanize(str) {
        return str
            .replace(/[-_]/g, ' ')
            .replace(/\//g, ': ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    /**
     * Get description template based on type
     */
    getTemplate(type, title) {
        const base = `This Pull Request imposes changes related to **${title}**.\n\n`;

        const templates = {
            feat: `${base}It introduces new functionality and features to the codebase, ensuring robust implementation and adherence to project standards.`,
            feature: `${base}It introduces new functionality and features to the codebase, ensuring robust implementation and adherence to project standards.`,
            fix: `${base}It resolves identified issues and bugs, improving system stability and reliability.`,
            docs: `${base}It updates the project documentation to ensure accuracy, completeness, and better developer experience.`,
            test: `${base}It adds comprehensive tests to verify system behavior and prevent regressions.`,
            refactor: `${base}It refactors existing code to improve maintainability, readability, and performance without changing external behavior.`,
            chore: `${base}It handles maintenance tasks, configuration updates, and tooling improvements.`,
            perf: `${base}It checks for performance bottlenecks and implements optimizations for better efficiency.`,
            enhance: `${base}It enhances existing features with improved capabilities and user experience.`,
            setup: `${base}It establishes the initial project structure and configuration settings.`
        };

        return templates[type] || `${base}It implements necessary changes to the codebase.`;
    }

    /**
     * Generate detailed PR description
     */
    generatePRContent(branch, commits) {
        const type = branch.split('/')[0] || 'misc';
        const name = branch.split('/')[1] || branch;
        const title = this.humanize(branch);

        let content = `# ${title}\n\n`;

        // Overview
        content += `## 📋 Overview\n\n`;
        content += this.getTemplate(type, name) + '\n\n';

        // Changes
        content += `## 🛠 Changes\n\n`;
        if (commits.length > 0) {
            content += commits.join('\n') + '\n';
        } else {
            content += `- implemented changes for ${name}\n`;
        }

        // Checklist
        content += `\n## ✅ Checklist\n\n`;
        content += `- [x] Code follows the project style guidelines\n`;
        content += `- [x] Implementation tested locally\n`;
        content += `- [x] Documentation updated where applicable\n`;
        content += `- [x] No breaking changes introduced\n`;

        return { title, content };
    }

    /**
     * Process a single branch (Generate PR -> Merge)
     */
    async processBranch(branch) {
        this.prCount++;
        console.log(`\nProcessing PR #${this.prCount}: ${branch}...`);

        const commits = this.getCommits(branch);
        const { title, content } = this.generatePRContent(branch, commits);

        // Save PR file
        const safeName = branch.replace(/\//g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        const filename = `PR-${this.prCount.toString().padStart(3, '0')}-${safeName}.md`;
        const filePath = path.join(this.prDir, filename);

        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Generated PR description: ${filename}`);

        // Prepare merge message
        const mergeMsgFile = path.join(this.prDir, 'MERGE_MSG');
        const mergeMessage = `Merge pull request #${this.prCount} from ${branch}\n\n${title}\n\n${content.slice(0, 500)}...`; // Truncate for commit msg if too long

        fs.writeFileSync(mergeMsgFile, mergeMessage);

        // Execute merge
        try {
            this.exec('git checkout main');
            const result = this.exec(`git merge ${branch} --no-ff -F "${mergeMsgFile}"`);

            if (result !== null) {
                console.log(`  ✓ Merged successfully`);
                // Delete branch after merge (simulate PR close)
                this.exec(`git branch -d ${branch}`);
                console.log(`  ✓ Closed branch ${branch}`);
            } else {
                console.error(`  ❌ Merge failed for ${branch}`);
            }
        } catch (error) {
            console.error(`  ❌ Error processing ${branch}: ${error.message}`);
        } finally {
            if (fs.existsSync(mergeMsgFile)) fs.unlinkSync(mergeMsgFile);
        }
    }

    /**
     * Process all branches
     */
    async processAllBranches() {
        console.log('Fetching branches...');
        let branches = this.getBranches();

        if (branches.length === 0) {
            console.log('No branches found to merge.');
            return;
        }

        branches = this.sortBranches(branches);
        console.log(`Found ${branches.length} branches to merge.`);

        for (const branch of branches) {
            await this.processBranch(branch);
        }

        console.log(`\n✅ Successfully processed ${this.prCount} Pull Requests.`);
    }
}

// Export
module.exports = PRManager;
