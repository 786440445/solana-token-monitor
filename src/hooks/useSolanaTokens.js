import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { birdeyeApi } from '../services/birdeyeApi';

export const useSolanaTokens = (options = {}) => {
  const { 
    limit = 50, 
    sortBy = 'volume', 
    filterNew = false,
    searchQuery = '' 
  } = options;

  const fetchTokens = useCallback(async () => {
    const data = await birdeyeApi.getTopTokens(limit);
    let tokens = data.tokens || [];
    
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
        tokens.sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0));
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
        tokens.sort((a, b) => ((b.marketCap || 0) - (a.marketCap || 0)));
        break;
      default:
        break;
    }

    return tokens;
  }, [limit, filterNew, searchQuery, sortBy]);

  return useQuery({
    queryKey: ['tokens', { limit, sortBy, filterNew, searchQuery }],
    queryFn: fetchTokens,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useTokenDetails = (tokenAddress) => {
  return useQuery({
    queryKey: ['tokenDetails', tokenAddress],
    queryFn: async () => {
      if (!tokenAddress) return null;
      const data = await birdeyeApi.searchToken(tokenAddress);
      return data;
    },
    enabled: !!tokenAddress,
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

export const useTokenPriceHistory = (tokenAddress, duration = '24h') => {
  return useQuery({
    queryKey: ['priceHistory', tokenAddress, duration],
    queryFn: async () => {
      if (!tokenAddress) return [];
      const data = await birdeyeApi.getPriceHistory(tokenAddress, duration);
      return data;
    },
    enabled: !!tokenAddress,
    staleTime: 300000, // 5 minutes
  });
};

export const useTokenRefresh = () => {
  const queryClient = useQueryClient();

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tokens'] });
    queryClient.invalidateQueries({ queryKey: ['tokenDetails'] });
    queryClient.invalidateQueries({ queryKey: ['priceHistory'] });
  }, [queryClient]);

  return { refresh };
};

export default useSolanaTokens;
