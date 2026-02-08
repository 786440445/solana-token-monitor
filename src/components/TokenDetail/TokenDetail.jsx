import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft, ExternalLink, Copy, TrendingUp, TrendingDown, DollarSign, Activity, Users, RefreshCw } from 'lucide-react';
import { formatPrice, formatPercent, formatUSD, formatAddress, getPriceChangeClass } from '../../utils/formatters';
import { useTokenPriceHistory } from '../../hooks/useSolanaTokens';

const TokenDetail = ({ token, onBack }) => {
  const [duration, setDuration] = useState('24h');
  
  if (!token) return null;

  const {
    address,
    symbol,
    name,
    priceUSD,
    priceChange24h,
    volume24h,
    liquidity,
    marketCap,
    fdv,
    txns,
    pairAddress,
    dexId,
  } = token;

  // 获取价格历史
  const { data: priceHistory, isLoading: historyLoading } = useTokenPriceHistory(
    address,
    duration === '24h' ? '24h' : '7d'
  );

  // 如果没有真实数据，生成模拟数据
  const displayData = priceHistory?.length > 0 ? priceHistory : generateMockPriceHistory();

  // 生成模拟价格历史
  function generateMockPriceHistory() {
    const data = [];
    let currentPrice = priceUSD || 0.001;
    const now = Date.now();
    const hours = duration === '24h' ? 24 : 168;
    
    for (let i = hours; i >= 0; i--) {
      const volatility = duration === '24h' ? 0.02 : 0.05;
      const change = (Math.random() - 0.45) * volatility * currentPrice;
      currentPrice = Math.max(0.0001, currentPrice + change);
      data.push({
        time: new Date(now - i * 3600000).toLocaleTimeString(),
        price: currentPrice,
        volume: Math.random() * 1000000 + 100000,
      });
    }
    
    return data;
  }

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(address);
  };

  const priceClass = getPriceChangeClass(priceChange24h);

  return (
    <div className="animate-slide-up">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-secondary hover:text-primary 
                 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>返回列表</span>
      </button>

      {/* 代币信息头部 */}
      <div className="bg-surface rounded-xl border border-border p-6 mb-6">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">🪙</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">{name || 'Unknown Token'}</h1>
              <div className="flex items-center space-x-2 mt-1 flex-wrap gap-2">
                <span className="text-lg text-secondary">{symbol || 'N/A'}</span>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-surfaceHover rounded transition-colors cursor-pointer"
                  title="复制地址"
                >
                  <Copy className="h-4 w-4 text-secondary" />
                </button>
                <span className="text-sm text-secondary/70 font-mono">
                  {formatAddress(address, 6, 4)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-3xl font-bold ${priceClass}`}>
              {formatPrice(priceUSD)}
            </div>
            <div className={`flex items-center justify-end space-x-2 mt-1 ${priceClass}`}>
              {priceChange24h >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span className="text-xl font-semibold">{formatPercent(priceChange24h)} (24h)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 价格图表 */}
      <div className="bg-surface rounded-xl border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">📈 价格走势</h2>
          <div className="flex space-x-2">
            {['24h', '7d'].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  duration === d
                    ? 'bg-primary text-background'
                    : 'bg-surfaceHover text-secondary hover:text-primary'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-80">
          {historyLoading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis 
                  dataKey="time" 
                  stroke="#8b949e"
                  tick={{ fill: '#8b949e', fontSize: 12 }}
                  interval={Math.floor(displayData.length / 6)}
                />
                <YAxis 
                  stroke="#8b949e"
                  tick={{ fill: '#8b949e', fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(priceUSD < 0.01 ? 6 : 2)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#c9d1d9' }}
                  formatter={(value) => [formatPrice(value), '价格']}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={priceChange24h >= 0 ? '#3fb950' : '#f85149'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 交易量图表 */}
      <div className="bg-surface rounded-xl border border-border p-6 mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">📊 交易量分布</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis 
                  dataKey="time" 
                  stroke="#8b949e"
                  tick={{ fill: '#8b949e', fontSize: 10 }}
                  interval={1}
                />
                <YAxis 
                  stroke="#8b949e"
                  tick={{ fill: '#8b949e', fontSize: 10 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#c9d1d9' }}
                  formatter={(value) => [formatUSD(value), '交易量']}
                />
                <Bar dataKey="volume" fill="#58a6ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-center items-center">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-success/10 rounded-lg p-4 text-center">
                <Users className="h-8 w-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-success">
                  {(txns?.buys || 0).toLocaleString()}
                </div>
                <div className="text-secondary text-sm">买入交易</div>
              </div>
              
              <div className="bg-danger/10 rounded-lg p-4 text-center">
                <Activity className="h-8 w-8 text-danger mx-auto mb-2" />
                <div className="text-2xl font-bold text-danger">
                  {(txns?.sells || 0).toLocaleString()}
                </div>
                <div className="text-secondary text-sm">卖出交易</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center space-x-2 text-secondary mb-2">
            <Activity className="h-5 w-5" />
            <span>24h 交易量</span>
          </div>
          <div className="text-xl font-bold text-primary">{formatUSD(volume24h)}</div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center space-x-2 text-secondary mb-2">
            <DollarSign className="h-5 w-5" />
            <span>流动性</span>
          </div>
          <div className="text-xl font-bold text-primary">{formatUSD(liquidity?.usd || 0)}</div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center space-x-2 text-secondary mb-2">
            <TrendingUp className="h-5 w-5" />
            <span>市值</span>
          </div>
          <div className="text-xl font-bold text-primary">{formatUSD(marketCap || 0)}</div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center space-x-2 text-secondary mb-2">
            <Users className="h-5 w-5" />
            <span>完全稀释市值</span>
          </div>
          <div className="text-xl font-bold text-primary">{formatUSD(fdv || 0)}</div>
        </div>
      </div>

      {/* 外部链接 */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">🔗 外部链接</h3>
        <div className="flex flex-wrap gap-4">
          {pairAddress && (
            <a
              href={`https://dexscreener.com/solana/${pairAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary 
                       rounded-lg hover:bg-primary/30 transition-colors cursor-pointer"
            >
              <span>DEX Screener</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          
          <a
            href={`https://solscan.io/token/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary 
                     rounded-lg hover:bg-primary/30 transition-colors cursor-pointer"
          >
            <span>Solscan</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          <a
            href={`https://birdeye.so/token/${address}?chain=solana`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary 
                     rounded-lg hover:bg-primary/30 transition-colors cursor-pointer"
          >
            <span>Birdeye</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
