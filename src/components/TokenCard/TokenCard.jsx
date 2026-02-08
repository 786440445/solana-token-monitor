import { TrendingUp, TrendingDown, ExternalLink, Copy, Star, StarOff } from 'lucide-react';
import { formatPrice, formatPercent, formatUSD, formatTime, formatAddress, getPriceChangeClass } from '../../utils/formatters';

const TokenCard = ({ 
  token, 
  onFavorite, 
  isFavorite, 
  onClick,
  rank 
}) => {
  const {
    address,
    symbol,
    name,
    priceUSD,
    priceChange24h,
    volume24h,
    liquidity,
    marketCap,
    txns24h,
    updates,
  } = token;

  const handleCopy = async (e) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(address);
    // 可以添加 toast 提示
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    onFavorite(token);
  };

  const priceClass = getPriceChangeClass(priceChange24h);

  return (
    <div 
      onClick={() => onClick(token)}
      className="token-card bg-surface rounded-xl border border-border p-4 
               cursor-pointer hover:border-primary transition-all duration-200"
    >
      {/* 头部：排名 + 收藏 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-secondary font-mono">#{rank}</span>
          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
            {symbol || 'Unknown'}
          </span>
        </div>
        
        <button
          onClick={handleFavorite}
          className="p-1 hover:bg-surfaceHover rounded transition-colors cursor-pointer"
        >
          {isFavorite ? (
            <Star className="h-4 w-4 text-warning fill-warning" />
          ) : (
            <StarOff className="h-4 w-4 text-secondary" />
          )}
        </button>
      </div>

      {/* 代币名称 */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-primary truncate">
          {name || 'Unknown Token'}
        </h3>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-secondary">{symbol || 'N/A'}</span>
          <button
            onClick={handleCopy}
            className="text-secondary hover:text-primary transition-colors cursor-pointer"
            title="复制地址"
          >
            <Copy className="h-3 w-3" />
          </button>
          <span className="text-xs text-secondary/70 font-mono">
            {formatAddress(address)}
          </span>
        </div>
      </div>

      {/* 价格 */}
      <div className="mb-3">
        <span className={`text-2xl font-bold ${priceClass}`}>
          {formatPrice(priceUSD)}
        </span>
        <div className={`flex items-center space-x-1 mt-1 ${priceClass}`}>
          {priceChange24h >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {formatPercent(priceChange24h)} (24h)
          </span>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-background rounded-lg p-2">
          <div className="text-secondary text-xs">24h 交易量</div>
          <div className="text-primary font-medium">{formatUSD(volume24h)}</div>
        </div>
        
        <div className="bg-background rounded-lg p-2">
          <div className="text-secondary text-xs">流动性</div>
          <div className="text-primary font-medium">{formatUSD(liquidity?.usd || 0)}</div>
        </div>
        
        <div className="bg-background rounded-lg p-2">
          <div className="text-secondary text-xs">市值</div>
          <div className="text-primary font-medium">{formatUSD(marketCap || 0)}</div>
        </div>
        
        <div className="bg-background rounded-lg p-2">
          <div className="text-secondary text-xs">交易数 (24h)</div>
          <div className="text-primary font-medium">{(txns24h?.buys || 0) + (txns24h?.sells || 0)}</div>
        </div>
      </div>

      {/* 更新时间 */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-secondary">
          更新: {formatTime(updates)}
        </span>
        
        <ExternalLink className="h-4 w-4 text-secondary opacity-0 group-hover:opacity-100 
                               transition-opacity" />
      </div>
    </div>
  );
};

export default TokenCard;
