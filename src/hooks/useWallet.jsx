import { useState, useEffect, useCallback } from 'react';
import { useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider as SolWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

// 样式
import '@solana/wallet-adapter-react-ui/styles.css';

// 自定义钱包 hook
export const useWalletConnection = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const { 
    wallets, 
    select, 
    connected, 
    connecting, 
    publicKey, 
    disconnect 
  } = useWallet();

  // 连接钱包
  const connectWallet = useCallback(async (walletName = 'Phantom') => {
    try {
      setIsConnecting(true);
      setError(null);
      await select(walletName);
    } catch (err) {
      setError(err.message);
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [select]);

  // 断开连接
  const disconnectWallet = useCallback(() => {
    disconnect();
    setWalletAddress(null);
    setWalletBalance(null);
  }, [disconnect]);

  // 当连接状态变化时更新
  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString());
    } else {
      setWalletAddress(null);
      setWalletBalance(null);
    }
  }, [connected, publicKey]);

  return {
    walletAddress,
    walletBalance,
    isConnecting: connecting || isConnecting,
    isConnected: connected,
    error,
    connectWallet,
    disconnectWallet,
    availableWallets: wallets,
  };
};

// 钱包连接上下文提供者
export const WalletContextProvider = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);

  const wallets = [
    new PhantomWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default useWalletConnection;
