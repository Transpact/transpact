import "regenerator-runtime/runtime";
import React, { useState } from "react";

import { Wallet } from "./near-wallet";

import { Toaster } from "@/components/ui/toaster";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import { SignInPrompt } from "@/ui-components";
import StartPage from "./pages/start";
import { WalletContext, WalletContextType } from "./context/wallet-context";

interface AppProps {
  isSignedIn: boolean;
  contractId?: string;
  wallet: Wallet;
}

const App: React.FC<AppProps> = ({ isSignedIn, contractId, wallet }) => {
  const [walletContext, setWalletContext] = useState<WalletContextType>({
    isSignedIn: isSignedIn,
    contractId: contractId,
    wallet: wallet,
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <HomePage
          isSignedIn={isSignedIn}
          contractId={contractId}
          wallet={wallet}
        />
      ),
    },
    {
      path: "/start",
      element: (
        <StartPage
          isSignedIn={isSignedIn}
          contractId={contractId}
          wallet={wallet}
        />
      ),
    },
    {
      path: "/start",
      element: <h1>Hello Near</h1>,
    },
  ]);

  return (
    <WalletContext.Provider value={walletContext}>
      <RouterProvider router={router} />
      <Toaster />
    </WalletContext.Provider>
  );
};

export default App;
