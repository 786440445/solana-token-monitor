import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '../components/Header/Header.jsx';
import TokenList from '../components/TokenList/TokenList.jsx';
import TokenDetail from '../components/TokenDetail/TokenDetail.jsx';
import FilterPanel from '../components/FilterPanel/FilterPanel.jsx';
import Stats from '../components/Stats/Stats.jsx';
import { useSolanaTokens, useTokenRefresh } from '../hooks/useSolanaTokens.js';
import { LoadingGrid } from '../components/common/index.jsx';

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

// 本地存储 key
const FAVORITES_KEY = 'solana-token-monitor-favorites';

const Home = () => {
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedToken, setSelectedToken] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: 'volume',
    filterNew: false,
    showFavoritesOnly: false,
    priceRange: 'all',
    minVolume: '',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  // 从本地存储加载收藏
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
  }, []);

  // 保存收藏到本地存储
  const saveFavorites = (newFavorites) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  // 添加/移除收藏
  const handleFavorite = (token, isFavorite) => {
    if (isFavorite) {
      const newFavorites = [...favorites, token];
      saveFavorites(newFavorites);
    } else {
      const newFavorites = favorites.filter(t => t.address !== token.address);
      saveFavorites(newFavorites);
    }
  };

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

  // 选择代币查看详情
  const handleSelectToken = (token) => {
    setSelectedToken(token);
    setView('detail');
  };

  // 返回列表
  const handleBack = () => {
    setSelectedToken(null);
    setView('list');
  };

  // 过滤收藏
  const displayTokens = filters.showFavoritesOnly && tokens
    ? tokens.filter(token => favorites.some(f => f.address === token.address))
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
        favoritesCount={favorites.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'detail' ? (
          <TokenDetail
            token={selectedToken}
            onBack={handleBack}
          />
        ) : (
          <>
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
                onSelectToken={handleSelectToken}
                onFavorite={handleFavorite}
                favorites={favorites}
              />
            )}
          </>
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
