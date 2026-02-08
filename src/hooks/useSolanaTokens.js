import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dexScreenerApi } from '../services/dexScreenerApi';
import { filterValidTokens } from '../utils/formatters';

export const useSolanaTokens = (options = {}) => {
  const { 
    limit = 50, 
    sortBy = 'volume', 
    filterNew = false,
    searchQuery = '' 
  } = options;

  const fetchTokens = useCallback(async () => {
    let data;
    
    if (filterNew) {
      data = await dexScreenerApi.getNewTokens(limit);
    } else {
      data = await dexScreenerApi.getTopTokens(limit);
    }

    let tokens = data.tokens || [];
    
    // 过滤无效代币
    tokens = filterValidTokens(tokens);

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tokens = tokens.filter(token => 
        token.symbol?.toLowerCase().includes(query) ||
        token.name?.toLowerCase().includes(query) ||
        token.address?.toLowerCase().includes(query)
      );
    }

    // 排序
    switch (sortBy) {
      case 'volume':
        tokens.sort((a, b) => (b.volumeUSD || 0) - (a.volumeUSD || 0));
        break;
      case 'price':
        tokens.sort((a, b) => (b.priceUSD || 0) - (a.priceUSD || 0));
        break;
      case 'priceChange':
        tokens.sort((a, b) => (b.priceChange24h || 0) - (a.priceChange24h || 0));
        break;
      case 'liquidity':
        tokens.sort((a, b) => ((b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)));
        break;
      case 'marketCap':
        tokens.sort((a, b) => ((b.fdv || 0) - (a.fdv || 0)));
        break;
      default:
        break;
    }

    return tokens;
  }, [limit, filterNew, searchQuery, sortBy]);

  return useQuery({
    queryKey: ['tokens', { limit, sortBy, filterNew, searchQuery }],
    queryFn: fetchTokens,
    staleTime: 30000, // 30 秒内不重新获取
    refetchInterval: 60000, // 每 60 秒自动刷新
    retry: 3,
    retryDelay: 1000,
  });
};

export const useTokenDetails = (tokenAddress) => {
  return useQuery({
    queryKey: ['tokenDetails', tokenAddress],
    queryFn: async () => {
      if (!tokenAddress) return null;
      const data = await dexScreenerApi.searchToken(tokenAddress);
      return data;
    },
    enabled: !!tokenAddress,
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

export const useTokenRefresh = () => {
  const queryClient = useQueryClient();

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tokens'] });
    queryClient.invalidateQueries({ queryKey: ['tokenDetails'] });
  }, [queryClient]);

  return { refresh };
};

export default useSolanaTokens;
