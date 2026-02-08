import { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Search, Menu, X, Sun, Moon, RefreshCw, Star } from 'lucide-react';

const Header = ({ 
  onSearch, 
  onRefresh, 
  isRefreshing,
  onShowFavorites,
  favoritesCount = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div 
              className="flex-shrink-0 cursor-pointer"
              onClick={() => onShowFavorites?.(false)}
            >
              <h1 className="text-xl font-bold text-primary">
                🚀 Solana Token Monitor
              </h1>
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-secondary" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg
                           bg-surface text-primary placeholder-secondary
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           transition-all duration-200"
                  placeholder="搜索代币地址、名称或符号..."
                />
              </div>
            </form>
          </div>

          {/* 右侧操作 */}
          <div className="flex items-center space-x-4">
            {/* 收藏按钮 */}
            {onShowFavorites && (
              <button
                onClick={() => onShowFavorites(true)}
                className="relative p-2 rounded-lg hover:bg-surfaceHover transition-colors cursor-pointer"
                title="查看收藏"
              >
                <Star className="h-5 w-5 text-warning" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-warning text-background 
                                   text-xs rounded-full flex items-center justify-center">
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* 刷新按钮 */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-surfaceHover transition-colors
                       disabled:opacity-50 cursor-pointer"
              title="刷新数据"
            >
              <RefreshCw className={`h-5 w-5 text-secondary ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surfaceHover transition-colors cursor-pointer"
              title="切换主题"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-secondary" />
              ) : (
                <Moon className="h-5 w-5 text-secondary" />
              )}
            </button>

            {/* 钱包连接 */}
            <div className="hidden sm:block">
              <WalletMultiButton 
                className="!bg-primary !text-background !font-semibold
                         hover:!bg-blue-600 transition-colors cursor-pointer"
              />
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surfaceHover cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-primary" />
              ) : (
                <Menu className="h-6 w-6 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            {/* 移动端搜索 */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-secondary" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg
                           bg-surface text-primary placeholder-secondary
                           focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="搜索代币..."
                />
              </div>
            </form>

            {/* 收藏按钮 */}
            {onShowFavorites && (
              <button
                onClick={() => {
                  onShowFavorites(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg 
                         hover:bg-surfaceHover transition-colors mb-2 cursor-pointer"
              >
                <Star className="h-5 w-5 text-warning" />
                <span>我的收藏 ({favoritesCount})</span>
              </button>
            )}

            {/* 移动端钱包按钮 */}
            <div className="block sm:hidden mb-4">
              <WalletMultiButton 
                className="!w-full !bg-primary !text-background !font-semibold"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
