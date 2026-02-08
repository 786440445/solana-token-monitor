const FilterPanel = ({ filters, onFilterChange }) => {
  const sortOptions = [
    { value: 'volume', label: '📊 交易量' },
    { value: 'price', label: '💰 价格' },
    { value: 'priceChange', label: '📈 涨幅' },
    { value: 'liquidity', label: '💧 流动性' },
    { value: 'marketCap', label: '🏆 市值' },
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* 排序 */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-secondary">排序:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-1.5
                     text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary
                     cursor-pointer"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 过滤选项 */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-secondary">过滤:</label>
          
          <button
            onClick={() => handleFilterChange('filterNew', !filters.filterNew)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filters.filterNew
                ? 'bg-success/20 text-success border border-success'
                : 'bg-background text-secondary border border-border hover:text-primary'
            }`}
          >
            🆕 新币
          </button>
          
          <button
            onClick={() => handleFilterChange('showFavoritesOnly', !filters.showFavoritesOnly)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filters.showFavoritesOnly
                ? 'bg-warning/20 text-warning border border-warning'
                : 'bg-background text-secondary border border-border hover:text-primary'
            }`}
          >
            ⭐ 收藏
          </button>
        </div>

        {/* 价格范围 */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-secondary">价格:</label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-1.5
                     text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary
                     cursor-pointer"
          >
            <option value="all">全部</option>
            <option value="micro">$0.0001 以下</option>
            <option value="small">$0.0001 - $0.01</option>
            <option value="medium">$0.01 - $1</option>
            <option value="large">$1 以上</option>
          </select>
        </div>

        {/* 交易量最小值 */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-secondary">最小交易量:</label>
          <input
            type="number"
            value={filters.minVolume}
            onChange={(e) => handleFilterChange('minVolume', e.target.value)}
            placeholder="最小值"
            className="w-24 bg-background border border-border rounded-lg px-3 py-1.5
                     text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
