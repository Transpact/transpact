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
import VerifyUser from "./pages/verify-user";
import AllBidsPage from "./pages/all-bids";
import { GlobalLoading } from "react-global-loading";
import ContractDetailsPage from "./pages/contract-detail";
import {
  ContractContext,
  ContractContextType,
} from "./context/contract-context";
import { SAMPLE_CONTRACT } from "./lib/data";

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

  const [contract, setContract] = useState(SAMPLE_CONTRACT);

  const router = createBrowserRouter(
    [
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
        element: <AllBidsPage />,
      },
      {
        path: "/verify-user",
        element: <VerifyUser />,
      },
      {
        path: "/contract/:id",
        element: <ContractDetailsPage />,
      },
    ],
    {}
  );

  return (
    <WalletContext.Provider value={walletContext}>
      <ContractContext.Provider
        value={{
          contracts: contract,
          setContracts: setContract,
        }}
      >
        <RouterProvider router={router} />

        <GlobalLoading zIndex={50} />
        <Toaster />
      </ContractContext.Provider>
    </WalletContext.Provider>
  );
};

export default App;
