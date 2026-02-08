import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '../components/Header/Header';
import TokenList from '../components/TokenList/TokenList';
import FilterPanel from '../components/FilterPanel/FilterPanel';
import Stats from '../components/Stats/Stats';
import { useSolanaTokens, useTokenRefresh } from '../hooks/useSolanaTokens';
import { LoadingGrid } from '../components/common';

// 创建 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const Home = () => {
  const [filters, setFilters] = useState({
    sortBy: 'volume',
    filterNew: false,
    showFavoritesOnly: false,
    priceRange: 'all',
    minVolume: '',
  });
  
  const [searchQuery, setSearchQuery] = useState('');

  // 获取代币数据
  const { 
    data: tokens, 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useSolanaTokens({
    sortBy: filters.sortBy,
    filterNew: filters.filterNew,
    searchQuery: searchQuery,
  });

  // 刷新 hook
  const { refresh } = useTokenRefresh();

  // 处理搜索
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // 处理刷新
  const handleRefresh = () => {
    refresh();
  };

  // 过滤收藏
  const displayTokens = filters.showFavoritesOnly && tokens
    ? tokens.filter(token => {
        // 这里可以集成收藏功能
        return false;
      })
    : tokens;

  // 计算总交易量
  const totalVolume = tokens?.reduce((sum, token) => 
    sum + (token.volumeUSD || 0), 0) || 0;

  return (
    <div className="min-h-screen gradient-bg">
      <Header
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计数据 */}
        <Stats tokens={tokens} totalVolume={totalVolume} />

        {/* 过滤面板 */}
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* 代币列表 */}
        {isLoading ? (
          <LoadingGrid count={8} />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-danger text-lg mb-2">❌ 加载失败</div>
            <div className="text-secondary text-sm mb-4">{error.message}</div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-primary text-background rounded-lg font-medium
                       hover:bg-blue-600 transition-colors cursor-pointer"
            >
              重试
            </button>
          </div>
        ) : (
          <TokenList
            tokens={displayTokens}
            isLoading={isLoading}
            error={error}
            onRefresh={handleRefresh}
          />
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-border mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-secondary text-sm">
          <p>🚀 Solana Token Monitor - 实时监控 Solana 链上热门代币</p>
          <p className="mt-2">
            数据来源: 
            <a 
              href="https://dexscreener.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              DEX Screener
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Home />
  </QueryClientProvider>
);

export default App;
