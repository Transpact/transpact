import "regenerator-runtime/runtime";
import React, { useState } from "react";

import { Wallet } from "./near-wallet";

import { Toaster } from "@/components/ui/toaster";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import StartPage from "./pages/start";
import { WalletContext, WalletContextType } from "./context/wallet-context";
import ListerDashboard from "./pages/lister-dashboard";
import NewContract from "./pages/new-contract";
import BidderDashboard from "./pages/bidder-dashboard";

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
      element: <HomePage />,
    },
    {
      path: "/start",
      element: <StartPage />,
    },
    {
      path: "/dashboard/lister",
      element: <ListerDashboard />,
    },
    {
      path: "/dashboard/bidder",
      element: <BidderDashboard />,
    },
    {
      path: "/contract/add",
      element: <NewContract />,
    },
    {
      path: "/bid/all",
      element: <NewContract />,
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
