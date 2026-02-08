// DEX Screener API - 获取代币数据
const DEX_SCREENER_BASE_URL = 'https://api.dexscreener.com/latest/dex';

export const dexScreenerApi = {
  // 获取所有代币
  async getAllTokens() {
    try {
      const response = await fetch(`${DEX_SCREENER_BASE_URL}/tokens`);
      if (!response.ok) throw new Error('Failed to fetch tokens');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw error;
    }
  },

  // 按交易对搜索代币
  async searchToken(pairAddress) {
    try {
      const response = await fetch(`${DEX_SCREENER_BASE_URL}/pairs/solana/${pairAddress}`);
      if (!response.ok) throw new Error('Token not found');
      return await response.json();
    } catch (error) {
      console.error('Error searching token:', error);
      throw error;
    }
  },

  // 获取代币详情
  async getTokenDetails(tokenAddress) {
    try {
      const response = await fetch(`${DEX_SCREENER_BASE_URL}/tokens/${tokenAddress}`);
      if (!response.ok) throw new Error('Token not found');
      return await response.json();
    } catch (error) {
      console.error('Error getting token details:', error);
      throw error;
    }
  },

  // 按交易量排序获取代币
  async getTopTokens(limit = 50) {
    try {
      const response = await fetch(`${DEX_SCREENER_BASE_URL}/tokens`);
      if (!response.ok) throw new Error('Failed to fetch tokens');
      const data = await response.json();
      
      // 按交易量排序
      const sortedTokens = data.tokens
        .sort((a, b) => (b.volumeUSD || 0) - (a.volumeUSD || 0))
        .slice(0, limit);
      
      return { tokens: sortedTokens };
    } catch (error) {
      console.error('Error getting top tokens:', error);
      throw error;
    }
  },

  // 获取最近新币
  async getNewTokens(limit = 20) {
    try {
      const response = await fetch(`${DEX_SCREENER_BASE_URL}/tokens`);
      if (!response.ok) throw new Error('Failed to fetch tokens');
      const data = await response.json();
      
      // 按创建时间排序（如果有的话）
      // DEX Screener API 没有直接的创建时间，我们用交易量来筛选
      const recentTokens = data.tokens
        .filter(token => (token.volumeUSD || 0) > 1000) // 至少有一定交易量
        .slice(0, limit);
      
      return { tokens: recentTokens };
    } catch (error) {
      console.error('Error getting new tokens:', error);
      throw error;
    }
  },
};

export default dexScreenerApi;
