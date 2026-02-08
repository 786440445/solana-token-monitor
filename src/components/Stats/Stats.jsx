import { TrendingUp, TrendingDown, Coins, Activity, Zap, DollarSign } from 'lucide-react';
import { formatUSD, formatPercent } from '../../utils/formatters';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-secondary text-sm">{title}</p>
          <p className="text-2xl font-bold text-primary mt-1">{value}</p>
          
          {trend && (
            <div className={`flex items-center space-x-1 mt-2 text-sm ${
              trend === 'up' ? 'text-success' : 'text-danger'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trendValue || formatPercent(trend === 'up' ? 5.2 : -3.1)}</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

const Stats = ({ tokens, totalVolume, marketStats }) => {
  // 计算统计数据
  const stats = {
    tokenCount: tokens?.length || 0,
    avgPriceChange: 0,
    topGainer: null,
    topLoser: null,
    totalLiquidity: 0,
  };

  if (tokens && tokens.length > 0) {
    let totalChange = 0;
    let maxGain = -Infinity;
    let maxLoss = Infinity;
    let totalLiq = 0;

    tokens.forEach(token => {
      const change = token.priceChange24h || 0;
      totalChange += change;
      
      if (change > maxGain) {
        maxGain = change;
        stats.topGainer = token;
      }
      
      if (change < maxLoss) {
        maxLoss = change;
        stats.topLoser = token;
      }
      
      totalLiq += token.liquidity?.usd || 0;
    });

    stats.avgPriceChange = totalChange / tokens.length;
    stats.totalLiquidity = totalLiq;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="监控代币"
        value={stats.tokenCount}
        icon={Coins}
        color="primary"
      />
      
      <StatsCard
        title="24h 交易量"
        value={formatUSD(totalVolume || 0)}
        icon={Activity}
        trend="up"
        trendValue="+12.5%"
        color="success"
      />
      
      <StatsCard
        title="平均涨幅"
        value={formatPercent(stats.avgPriceChange)}
        icon={Zap}
        trend={stats.avgPriceChange >= 0 ? 'up' : 'down'}
        color={stats.avgPriceChange >= 0 ? 'success' : 'danger'}
      />
      
      <StatsCard
        title="总流动性"
        value={formatUSD(stats.totalLiquidity)}
        icon={DollarSign}
        color="warning"
      />
    </div>
  );
};

export default Stats;
