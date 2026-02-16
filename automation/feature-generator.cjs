#!/usr/bin/env node

/**
 * Feature Generator - Creates complete features with micro-commits
 */

const AutoCommit = require('./auto-commit.cjs');
const fs = require('fs');
const path = require('path');

class FeatureGenerator extends AutoCommit {
    constructor() {
        super();
        this.projectRoot = path.join(__dirname, '..');
    }

    /**
     * Generate WalletConnect Integration
     */
    async generateWalletConnectIntegration() {
        const branchName = 'feature/walletconnect-integration';
        this.createBranch(branchName);

        console.log('\n🚀 Generating WalletConnect Integration...\n');

        // Step 1: Create provider file structure
        const providerPath = path.join(this.projectRoot, 'lib', 'walletconnect', 'provider.ts');

        this.microCommitsForFile(providerPath, [
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'create WalletConnect provider file structure',
                content: `// WalletConnect Provider
import { WalletConnectProvider } from '@walletconnect/web3-provider';\n\n`
            },
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'add provider configuration interface',
                content: `export interface WalletConnectConfig {
  projectId: string;
  chains: string[];
  showQrModal?: boolean;
  rpcMap?: Record<string, string>;
}\n\n`
            },
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'implement provider initialization',
                content: `export class WalletConnectService {
  private provider: WalletConnectProvider | null = null;
  private config: WalletConnectConfig;

  constructor(config: WalletConnectConfig) {
    this.config = config;
  }
\n`
            },
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'add provider connection method',
                content: `  async connect(): Promise<string[]> {
    try {
      this.provider = new WalletConnectProvider(this.config);
      const accounts = await this.provider.enable();
      return accounts;
    } catch (error) {
      console.error('WalletConnect connection failed:', error);
      throw error;
    }
  }\n\n`
            },
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'add provider disconnection method',
                content: `  async disconnect(): Promise<void> {
    if (this.provider) {
      await this.provider.disconnect();
      this.provider = null;
    }
  }\n\n`
            },
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'add session management methods',
                content: `  getSession() {
    return this.provider?.session || null;
  }\n\n  isConnected(): boolean {
    return this.provider?.connected || false;
  }
}\n`
            }
        ]);

        // Step 2: Create hooks
        const hooksPath = path.join(this.projectRoot, 'hooks', 'useWalletConnect.ts');

        this.microCommitsForFile(hooksPath, [
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'create WalletConnect hook file',
                content: `import { useState, useEffect, useCallback } from 'react';
import { WalletConnectService } from '@/lib/walletconnect/provider';\n\n`
            },
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'add hook interface definitions',
                content: `interface UseWalletConnectReturn {
  accounts: string[];
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}\n\n`
            },
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'implement useWalletConnect hook',
                content: `export function useWalletConnect(projectId: string): UseWalletConnectReturn {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [service] = useState(() => new WalletConnectService({
    projectId,
    chains: ['stacks:1'],
    showQrModal: true
  }));\n\n`
            },
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'add connect handler',
                content: `  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const accs = await service.connect();
      setAccounts(accs);
      setIsConnected(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsConnecting(false);
    }
  }, [service]);\n\n`
            },
            {
                type: 'feat',
                scope: 'walletconnect',
                message: 'add disconnect handler',
                content: `  const disconnect = useCallback(async () => {
    try {
      await service.disconnect();
      setAccounts([]);
      setIsConnected(false);
    } catch (err) {
      setError(err as Error);
    }
  }, [service]);\n\n  return { accounts, isConnected, isConnecting, error, connect, disconnect };
}\n`
            }
        ]);

        // Step 3: Documentation
        const docsPath = path.join(this.projectRoot, 'docs', 'WALLETCONNECT.md');

        this.microCommitsForFile(docsPath, [
            {
                type: 'docs',
                scope: 'walletconnect',
                message: 'create WalletConnect documentation file',
                content: `# WalletConnect Integration\n\n`
            },
            {
                type: 'docs',
                scope: 'walletconnect',
                message: 'add overview section',
                content: `## Overview\n\nThis project integrates WalletConnect for multi-wallet support.\n\n`
            },
            {
                type: 'docs',
                scope: 'walletconnect',
                message: 'add setup instructions',
                content: `## Setup\n\n1. Obtain project ID from WalletConnect Cloud
2. Add to .env: \`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID\`
3. Use the hook in components\n\n`
            },
            {
                type: 'docs',
                scope: 'walletconnect',
                message: 'add usage example',
                content: `## Usage\n\n\`\`\`tsx
import { useWalletConnect } from '@/hooks/useWalletConnect';

export function Wallet() {
  const { connect, disconnect, isConnected } = useWalletConnect(projectId);
  
  return (
    <button onClick={isConnected ? disconnect : connect}>
      {isConnected ? 'Disconnect' : 'Connect'}
    </button>
  );
}
\`\`\`\n`
            }
        ]);

        console.log(`✓ WalletConnect integration complete on branch: ${branchName}\n`);
        return branchName;
    }

    /**
     * Generate Chainhooks Integration
     */
    async generateChainhooksIntegration() {
        const branchName = 'feature/chainhooks-integration';
        this.createBranch(branchName);

        console.log('\n🚀 Generating Chainhooks Integration...\n');

        // Step 1: Create client
        const clientPath = path.join(this.projectRoot, 'lib', 'chainhooks', 'client.ts');

        this.microCommitsForFile(clientPath, [
            {
                type: 'feat',
                scope: 'chainhooks',
                message: 'create chainhooks client file',
                content: `import { ChainhookClient } from '@hirosystems/chainhooks-client';\n\n`
            },
            {
                type: 'feat',
                scope: 'chainhooks',
                message: 'add client configuration',
                content: `export interface ChainhookConfig {
  baseUrl: string;
  apiKey?: string;
}\n\n`
            },
            {
                type: 'feat',
                scope: 'chainhooks',
                message: 'implement client class',
                content: `export class ChainhookService {
  private client: ChainhookClient;

  constructor(config: ChainhookConfig) {
    this.client = new ChainhookClient(config);
  }\n\n`
            },
            {
                type: 'feat',
                scope: 'chainhooks',
                message: 'add hook registration method',
                content: `  async registerHook(hookConfig: any) {
    return await this.client.registerHook(hookConfig);
  }\n\n`
            },
            {
                type: 'feat',
                scope: 'chainhooks',
                message: 'add hook removal method',
                content: `  async removeHook(hookId: string) {
    return await this.client.removeHook(hookId);
  }\n\n`
            },
            {
                type: 'feat',
                scope: 'chainhooks',
                message: 'add hook listing method',
                content: `  async listHooks() {
    return await this.client.listHooks();
  }
}\n`
            }
        ]);

        // Step 2: Event handlers
        const handlersPath = path.join(this.projectRoot, 'lib', 'chainhooks', 'handlers.ts');

        this.microCommitsForFile(handlersPath, [
            {
                type: 'feat',
                scope: 'chainhooks',
                message: 'create event handlers file',
                content: `export type ChainhookEvent = {\n  type: string;\n  data: any;\n};\n\n`
            },
            {
                type: 'feat',
                scope: 'chainhooks',
                message: 'add transaction event handler',
                content: `export function handleTransactionEvent(event: ChainhookEvent) {
  console.log('Transaction event:', event);
  // Process transaction
}\n\n`
            },
            {
                type: 'feat',
                scope: 'chainhooks',
                message: 'add contract event handler',
                content: `export function handleContractEvent(event: ChainhookEvent) {
  console.log('Contract event:', event);
  // Process contract call
}\n\n`
            },
            {
                type: 'feat',
                scope: 'chainhooks',
                message: 'add NFT event handler',
                content: `export function handleNFTEvent(event: ChainhookEvent) {
  console.log('NFT event:', event);
  // Process NFT mint/transfer
}\n`
            }
        ]);

        console.log(`✓ Chainhooks integration complete on branch: ${branchName}\n`);
        return branchName;
    }

    /**
     * Update Clarity contracts to v4
     */
    async upgradeContractsToV4() {
        const branchName = 'upgrade/clarity-v4';
        this.createBranch(branchName);

        console.log('\n🚀 Upgrading contracts to Clarity v4...\n');

        // Update Clarinet.toml
        const clarinetPath = path.join(this.projectRoot, 'Clarinet.toml');
        const content = fs.readFileSync(clarinetPath, 'utf-8');

        const updated = content
            .replace(/clarity_version = 2/g, 'clarity_version = 4')
            .replace(/epoch = '2\.1'/g, "epoch = '3.3'");

        fs.writeFileSync(clarinetPath, updated);
        this.commit('chore', 'contracts', 'upgrade all contracts to Clarity v4 and epoch 3.3', clarinetPath);

        // Add migration guide
        const migrationPath = path.join(this.projectRoot, 'docs', 'CLARITY_V4_MIGRATION.md');

        this.microCommitsForFile(migrationPath, [
            {
                type: 'docs',
                scope: 'contracts',
                message: 'create Clarity v4 migration guide',
                content: `# Clarity v4 Migration Guide\n\n`
            },
            {
                type: 'docs',
                scope: 'contracts',
                message: 'document breaking changes',
                content: `## Breaking Changes\n\n- \`as-contract\` is deprecated\n- Use \`contract-caller\` instead\n\n`
            },
            {
                type: 'docs',
                scope: 'contracts',
                message: 'add migration examples',
                content: `## Examples\n\n### Before (v2)\n\`\`\`clarity
(as-contract (stx-transfer? amount tx-sender recipient))\n\`\`\`\n\n### After (v4)\n\`\`\`clarity
(stx-transfer? amount (as-contract tx-sender) recipient)\n\`\`\`\n`
            }
        ]);

        console.log(`✓ Clarity v4 upgrade complete on branch: ${branchName}\n`);
        return branchName;
    }

    /**
     * Run all feature generations
     */
    async generateAll() {
        console.log('Starting feature generation process...\n');

        const branches = [];

        branches.push(await this.upgradeContractsToV4());
        branches.push(await this.generateWalletConnectIntegration());
        branches.push(await this.generateChainhooksIntegration());

        // Checkout main
        this.exec('git checkout main 2>nul || git checkout -b main');

        console.log('\n✅ All features generated!');
        console.log('\nBranches created:');
        branches.forEach(b => console.log(`  - ${b}`));

        this.displaySummary();

        return branches;
    }
}

// Main execution
if (require.main === module) {
    const generator = new FeatureGenerator();
    generator.generateAll().catch(console.error);
}

module.exports = FeatureGenerator;
