import { WalletContext, WalletContextType } from "@/context/wallet-context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

import { Wallet } from "@/lib/near-wallet";
import { SAMPLE_CONTRACT } from "@/lib/data";
import { ContractContext } from "@/context/contract-context";
import { GlobalLoading } from "react-global-loading";
import { Toaster } from "@/components/ui/toaster";
const CONTRACT_ADDRESS = "dev-1688285985299-62443913276139";

export default function App({ Component, pageProps }: AppProps) {
  const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS });
  const isSignedIn = wallet.startUp();
  const [contract, setContract] = useState(SAMPLE_CONTRACT);

  const [walletContext, setWalletContext] = useState<WalletContextType>({
    isSignedIn: false,
    contractId: CONTRACT_ADDRESS,
    wallet: wallet,
  });

  useEffect(() => {
    const init = async () => {
      const isSignedIn = await wallet.startUp();

      setWalletContext((prev) => ({
        ...prev,
        isSignedIn: isSignedIn,
      }));
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WalletContext.Provider value={walletContext}>
      <ContractContext.Provider
        value={{
          contracts: contract,
          setContracts: setContract,
        }}
      >
        <Component {...pageProps} />

        <GlobalLoading zIndex={50} />
        <Toaster />
      </ContractContext.Provider>
    </WalletContext.Provider>
  );
}
