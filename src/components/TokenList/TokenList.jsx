import { useState } from 'react';
import TokenCard from '../TokenCard/TokenCard.jsx';
import { LoadingSpinner } from '../common';

const TokenList = ({ 
  tokens, 
  isLoading, 
  error, 
  onRefresh, 
  onSelectToken,
  onFavorite,
  favorites 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [favoriteTokens, setFavoriteTokens] = useState(favorites || []);

  const handleFavorite = (token) => {
    const isFav = favoriteTokens.some(t => t.address === token.address);
    if (isFav) {
      setFavoriteTokens(prev => prev.filter(t => t.address !== token.address));
    } else {
      setFavoriteTokens(prev => [...prev, token]);
    }
    onFavorite?.(token, !isFav);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-danger text-lg mb-2">❌ 获取数据失败</div>
        <div className="text-secondary text-sm mb-4">{error.message}</div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-primary text-background rounded-lg font-medium
                   hover:bg-blue-600 transition-colors cursor-pointer"
        >
          重试
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!tokens || tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <div className="text-primary text-lg mb-2">没有找到代币</div>
        <div className="text-secondary text-sm">
          尝试调整搜索条件或刷新数据
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 视图切换 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-secondary">
          共 <span className="text-primary font-medium">{tokens.length}</span> 个代币
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid' 
                ? 'bg-primary text-background' 
                : 'bg-surface text-secondary hover:text-primary'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list' 
                ? 'bg-primary text-background' 
                : 'bg-surface text-secondary hover:text-primary'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 代币网格/列表 */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tokens.map((token, index) => (
            <TokenCard
              key={token.address}
              token={token}
              rank={index + 1}
              onFavorite={handleFavorite}
              isFavorite={favoriteTokens.some(t => t.address === token.address)}
              onClick={onSelectToken}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {tokens.map((token, index) => (
            <TokenCard
              key={token.address}
              token={token}
              rank={index + 1}
              onFavorite={handleFavorite}
              isFavorite={favoriteTokens.some(t => t.address === token.address)}
              onClick={onSelectToken}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenList;
