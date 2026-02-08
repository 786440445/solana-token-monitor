// 价格格式化
export const formatPrice = (price, decimals = 2) => {
  if (!price && price !== 0) return '-';
  
  if (price < 0.0001) {
    return `$${price.toFixed(8)}`;
  } else if (price < 1) {
    return `$${price.toFixed(6)}`;
  } else {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  }
};

// 百分比格式化
export const formatPercent = (percent) => {
  if (!percent && percent !== 0) return '-';
  
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

// 金额格式化
export const formatAmount = (amount, decimals = 2) => {
  if (!amount && amount !== 0) return '-';
  
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(decimals)}B`;
  } else if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(decimals)}M`;
  } else if (amount >= 1e3) {
    return `${(amount / 1e3).toFixed(decimals)}K`;
  } else {
    return amount.toFixed(decimals);
  }
};

// USD 金额格式化
export const formatUSD = (amount) => {
  if (!amount && amount !== 0) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// 时间格式化
export const formatTime = (timestamp) => {
  if (!timestamp) return '-';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  // 小于 1 分钟
  if (diff < 60000) {
    return 'Just now';
  }
  
  // 小于 1 小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // 小于 24 小时
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // 小于 7 天
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
  
  // 更早
  return date.toLocaleDateString();
};

// 地址格式化（截断）
export const formatAddress = (address, start = 4, end = 4) => {
  if (!address || address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

// 代币名称/符号格式化
export const formatTokenName = (name, symbol, maxLength = 20) => {
  const displayName = symbol ? `${name} (${symbol})` : name;
  if (displayName.length > maxLength) {
    return displayName.slice(0, maxLength) + '...';
  }
  return displayName;
};

// 计算价格变化颜色
export const getPriceChangeClass = (percent) => {
  if (percent > 0) return 'price-up';
  if (percent < 0) return 'price-down';
  return 'price-neutral';
};

// 复制到剪贴板
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

// 生成随机颜色（用于代币图标背景）
export const getRandomColor = () => {
  const colors = [
    '#58a6ff', '#3fb950', '#f85149', '#d29922',
    '#a371f7', '#db61a2', '#79c0ff', '#7ee787',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Debounce 函数
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 过滤有效代币
export const filterValidTokens = (tokens) => {
  return tokens.filter(token => {
    return token && 
           token.address && 
           token.priceUSD && 
           (token.volumeUSD || 0) > 100 &&
           (token.liquidity?.usd || 0) > 1000;
  });
};
