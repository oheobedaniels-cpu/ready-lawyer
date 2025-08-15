import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Avalanche C-Chain Network IDs
  const AVALANCHE_MAINNET = 43114;
  const AVALANCHE_TESTNET = 43113;

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('MetaMask or other Web3 wallet is required');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        toast.error('No accounts found');
        return;
      }

      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      
      setAccount(accounts[0]);
      setProvider(provider);
      setSigner(signer);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Check if we're on the right network
      if (network.chainId !== BigInt(AVALANCHE_MAINNET) && network.chainId !== BigInt(AVALANCHE_TESTNET)) {
        toast.error('Please switch to Avalanche C-Chain');
        await switchNetwork();
      } else {
        toast.success('Wallet connected successfully!');
      }

    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsConnected(false);
    toast.success('Wallet disconnected');
  };

  const switchNetwork = async () => {
    try {
      if (!window.ethereum) return;

      // Try to switch to Avalanche C-Chain
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${AVALANCHE_MAINNET.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${AVALANCHE_MAINNET.toString(16)}`,
                chainName: 'Avalanche C-Chain',
                nativeCurrency: {
                  name: 'AVAX',
                  symbol: 'AVAX',
                  decimals: 18,
                },
                rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
                blockExplorerUrls: ['https://snowtrace.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast.error('Failed to add Avalanche network');
        }
      } else {
        console.error('Error switching network:', switchError);
        toast.error('Failed to switch network');
      }
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(Number(chainId));
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            
            setAccount(accounts[0]);
            setProvider(provider);
            setSigner(signer);
            setChainId(Number(network.chainId));
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      };

      checkConnection();
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const value: Web3ContextType = {
    account,
    provider,
    signer,
    chainId,
    isConnected,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
