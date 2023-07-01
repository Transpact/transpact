import "regenerator-runtime/runtime";
import React from "react";

import { Wallet } from "./near-wallet";

import { Toaster } from "@/components/ui/toaster";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import { SignInPrompt } from "@/ui-components";
import StartPage from "./pages/start";

interface AppProps {
  isSignedIn: boolean;
  contractId?: string;
  wallet: Wallet;
}

const App: React.FC<AppProps> = ({ isSignedIn, contractId, wallet }) => {
  // TODO: Save Web3 objects in Context

  // if (!isSignedIn) {
  //   return <SignInPrompt greeting={""} onClick={() => wallet.signIn()} />;
  // }

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
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
