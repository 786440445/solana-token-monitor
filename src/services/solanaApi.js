import { Connection, PublicKey } from '@solana/web3.js';

// Helius RPC 节点（免费 tier）
const HELIUS_RPC_URL = 'https://api.helius-rpc.com/?api-key=demo-api-key';

const connection = new Connection(HELIUS_RPC_URL, 'confirmed');

export const solanaApi = {
  // 获取连接实例
  getConnection() {
    return connection;
  },

  // 获取账户信息
  async getAccountInfo(address) {
    try {
      const publicKey = new PublicKey(address);
      const accountInfo = await connection.getAccountInfo(publicKey);
      return accountInfo;
    } catch (error) {
      console.error('Error getting account info:', error);
      throw error;
    }
  },

  // 获取代币余额
  async getTokenBalance(walletAddress, tokenMintAddress) {
    try {
      const walletPubkey = new PublicKey(walletAddress);
      const tokenMintPubkey = new PublicKey(tokenMintAddress);
      
      // 获取所有代币账户
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        walletPubkey,
        { mint: tokenMintPubkey }
      );

      if (tokenAccounts.value.length === 0) {
        return { balance: 0, decimals: 0 };
      }

      const account = tokenAccounts.value[0].account;
      const parsedInfo = account.data.parsed.info;
      
      return {
        balance: parsedInfo.tokenAmount.uiAmount,
        decimals: parsedInfo.tokenAmount.decimals,
      };
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  },

  // 获取钱包的所有代币
  async getWalletTokens(walletAddress) {
    try {
      const walletPubkey = new PublicKey(walletAddress);
      
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        walletPubkey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
      );

      const tokens = tokenAccounts.value.map(account => {
        const parsedInfo = account.account.data.parsed.info;
        return {
          mint: parsedInfo.mint,
          balance: parsedInfo.tokenAmount.uiAmount,
          decimals: parsedInfo.tokenAmount.decimals,
        };
      });

      return tokens;
    } catch (error) {
      console.error('Error getting wallet tokens:', error);
      throw error;
    }
  },

  // 获取代币的持仓分布（简化版）
  async getTokenHolderInfo(tokenMintAddress) {
    try {
      // 注意：这需要更大的 Helius 套餐
      // 这里返回一个模拟数据，实际使用需要升级套餐
      return {
        totalSupply: 'Unknown',
        holderCount: 'N/A',
        topHolders: [],
      };
    } catch (error) {
      console.error('Error getting holder info:', error);
      throw error;
    }
  },

  // 获取最近交易
  async getRecentTransactions(tokenMintAddress, limit = 10) {
    try {
      const tokenMintPubkey = new PublicKey(tokenMintAddress);
      
      const signatures = await connection.getSignaturesForAddress(
        tokenMintPubkey,
        { limit }
      );

      return signatures;
    } catch (error) {
      console.error('Error getting recent transactions:', error);
      throw error;
    }
  },
};

export default solanaApi;
