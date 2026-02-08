// Birdeye API - 获取代币数据（免费 tier）
// 申请 API key: https://birdeye.so/

const BIRDEYE_API_URL = 'https://public-api.birdeye.so';

export const birdeyeApi = {
  // 获取所有代币（按交易量排序）
  async getTopTokens(limit = 50) {
    try {
      const response = await fetch(
        `${BIRDEYE_API_URL}/defi/tokenlist?sort_by=volume&sort_type=desc&offset=0&limit=${limit}`,
        {
          headers: {
            'X-API-KEY': '', // 免费 tier 可能不需要 key
          },
        }
      );
      
      if (!response.ok) {
        // 如果失败，返回模拟数据
        return { tokens: generateMockTokens(limit) };
      }
      
      const data = await response.json();
      return { tokens: data.data || [] };
    } catch (error) {
      console.error('Error fetching tokens from Birdeye:', error);
      // 返回模拟数据作为后备
      return { tokens: generateMockTokens(limit) };
    }
  },

  // 搜索代币
  async searchToken(address) {
    try {
      const response = await fetch(
        `${BIRDEYE_API_URL}/defi/token_basic?address=${address}`,
        {
          headers: {
            'X-API-KEY': '',
          },
        }
      );
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error searching token:', error);
      return null;
    }
  },

  // 获取代币价格历史
  async getPriceHistory(address, duration = '24h') {
    try {
      const response = await fetch(
        `${BIRDEYE_API_URL}/defi/token_history?address=${address}&type=${duration}`,
        {
          headers: {
            'X-API-KEY': '',
          },
        }
      );
      
      if (!response.ok) {
        return generateMockPriceHistory();
      }
      
      const data = await response.json();
      return data.data?.items || generateMockPriceHistory();
    } catch (error) {
      console.error('Error fetching price history:', error);
      return generateMockPriceHistory();
    }
  },
};

// 生成模拟代币数据（当 API 失败时使用）
const generateMockTokens = (count) => {
  const tokens = [];
  const mockData = [
    { symbol: 'SOL', name: 'Solana', price: 100.50, change: 5.2, volume: 1500000000 },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.05, volume: 800000000 },
    { symbol: 'BONK', name: 'Bonk', price: 0.000023, change: -2.5, volume: 25000000 },
    { symbol: 'JUP', name: 'Jupiter', price: 0.85, change: 8.3, volume: 45000000 },
    { symbol: 'RAY', name: 'Raydium', price: 3.45, change: -1.2, volume: 12000000 },
    { symbol: 'MNGO', name: 'Mango', price: 0.025, change: 15.8, volume: 8500000 },
    { symbol: 'SRM', name: 'Serum', price: 0.42, change: 3.4, volume: 5200000 },
    { symbol: 'COPE', name: 'Cope', price: 0.012, change: -5.6, volume: 3100000 },
    { symbol: 'TENSOR', name: 'Tensor', price: 0.55, change: 12.3, volume: 6800000 },
    { symbol: 'HNT', name: 'Helium', price: 4.85, change: 0.8, volume: 9200000 },
  ];

  for (let i = 0; i < Math.min(count, mockData.length); i++) {
    const item = mockData[i];
    tokens.push({
      address: `${String(i).repeat(44)}`, // 模拟地址
      symbol: item.symbol,
      name: item.name,
      priceUSD: item.price,
      priceChange24h: item.change + (Math.random() - 0.5) * 2,
      volume24h: item.volume * (0.8 + Math.random() * 0.4),
      liquidity: { usd: item.volume * 0.3 },
      marketCap: item.price * 1000000000 * (0.8 + Math.random() * 0.4),
      fdv: item.price * 1000000000,
      txns: { buys: Math.floor(Math.random() * 1000), sells: Math.floor(Math.random() * 800) },
      updates: Date.now() - Math.random() * 3600000,
      pairAddress: `pair${i}`,
      dexId: 'raydium',
    });
  }

  return tokens;
};

// 生成模拟价格历史
const generateMockPriceHistory = () => {
  const data = [];
  let price = 100;
  const now = Date.now();
  
  for (let i = 24; i >= 0; i--) {
    const change = (Math.random() - 0.48) * 2; // 轻微上涨倾向
    price = Math.max(0.0001, price * (1 + change / 100));
    data.push({
      time: new Date(now - i * 3600000).toISOString(),
      value: price,
      volume: Math.random() * 1000000 + 100000,
    });
  }
  
  return data;
};

export default birdeyeApi;
