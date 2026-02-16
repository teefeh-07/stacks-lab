#!/usr/bin/env node

/**
 * Auto-Commit Automation Script
 * Creates micro-commits with conventional commit messages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoCommit {
  constructor() {
    this.commitTypes = ['feat', 'fix', 'docs', 'test', 'refactor', 'style', 'chore', 'perf'];
    this.commitCount = 0;
    this.logFile = path.join(__dirname, '..', 'ACTIVITY_LOG.md');
  }

  /**
   * Execute git command
   */
  exec(command) {
    try {
      return execSync(command, {
        encoding: 'utf-8',
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      }).trim();
    } catch (error) {
      console.error(`Error executing: ${command}`);
      console.error(error.message);
      return null;
    }
  }

  /**
   * Get current branch name
   */
  getCurrentBranch() {
    return this.exec('git branch --show-current');
  }

  /**
   * Create a new branch
   */
  createBranch(branchName) {
    const current = this.getCurrentBranch();
    if (current === branchName) {
      console.log(`Already on branch: ${branchName}`);
      return true;
    }

    const exists = this.exec(`git branch --list ${branchName}`);
    if (exists) {
      this.exec(`git checkout ${branchName}`);
      console.log(`Switched to existing branch: ${branchName}`);
    } else {
      this.exec(`git checkout -b ${branchName}`);
      console.log(`Created and switched to new branch: ${branchName}`);
    }
    return true;
  }

  /**
   * Stage files
   */
  stageFiles(files) {
    if (Array.isArray(files)) {
      files.forEach(file => {
        const normalized = file.replace(/\\/g, '/');
        this.exec(`git add "${normalized}"`);
      });
    } else {
      const normalized = files.replace(/\\/g, '/');
      this.exec(`git add "${normalized}"`);
    }
  }

  /**
   * Create commit
   */
  commit(type, scope, message, files = '.') {
    this.stageFiles(files);

    const commitMsg = scope
      ? `${type}(${scope}): ${message}`
      : `${type}: ${message}`;

    const result = this.exec(`git commit -m "${commitMsg}"`);
    if (result !== null) {
      this.commitCount++;
      this.logCommit(commitMsg);
      console.log(`✓ Commit #${this.commitCount}: ${commitMsg}`);
      return true;
    }
    return false;
  }

  /**
   * Log commit to activity log
   */
  logCommit(message) {
    const timestamp = new Date().toISOString();
    const branch = this.getCurrentBranch();
    const entry = `- [${timestamp}] [${branch}] ${message}\n`;

    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '# Activity Log\n\n');
    }

    fs.appendFileSync(this.logFile, entry);
  }

  /**
   * Get total commit count
   */
  getTotalCommits() {
    const count = this.exec('git rev-list --count HEAD');
    return parseInt(count) || 0;
  }

  /**
   * Push to remote
   */
  push(branch = null) {
    const currentBranch = branch || this.getCurrentBranch();
    console.log(`Pushing ${currentBranch} to remote...`);
    return this.exec(`git push -u origin ${currentBranch}`);
  }

  /**
   * Merge branch into main
   */
  mergeBranch(sourceBranch, targetBranch = 'main') {
    this.exec(`git checkout ${targetBranch}`);
    this.exec(`git merge ${sourceBranch} --no-ff -m "Merge branch '${sourceBranch}' into ${targetBranch}"`);
    console.log(`✓ Merged ${sourceBranch} into ${targetBranch}`);
  }

  /**
   * Delete branch
   */
  deleteBranch(branchName, force = false) {
    const flag = force ? '-D' : '-d';
    this.exec(`git branch ${flag} ${branchName}`);
    console.log(`✓ Deleted branch: ${branchName}`);
  }

  /**
   * Create multiple commits for a file
   */
  microCommitsForFile(filePath, changes) {
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(filePath);

    changes.forEach((change, index) => {
      const { type, scope, message, content } = change;

      // Ensure directory exists
      if (content) {
        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir, { recursive: true });
        }

        // Update file content
        if (fs.existsSync(filePath)) {
          fs.appendFileSync(filePath, content);
        } else {
          fs.writeFileSync(filePath, content);
        }
      }

      // Commit the change
      this.commit(type, scope, message, filePath);

      // Small delay to ensure unique timestamps
      if (index < changes.length - 1) {
        execSync('timeout /t 1 > nul 2>&1', { shell: true });
      }
    });
  }

  /**
   * Display summary
   */
  displaySummary() {
    const totalCommits = this.getTotalCommits();
    const branches = this.exec('git branch').split('\n').length;

    console.log('\n' + '='.repeat(50));
    console.log('COMMIT SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Commits: ${totalCommits}`);
    console.log(`Session Commits: ${this.commitCount}`);
    console.log(`Total Branches: ${branches}`);
    console.log('='.repeat(50) + '\n');
  }
}

// Export for use in other scripts
module.exports = AutoCommit;

// If run directly
if (require.main === module) {
  const autoCommit = new AutoCommit();
  console.log('Auto-commit automation initialized');
  console.log('Import this module to use in your scripts\n');
  autoCommit.displaySummary();
}
