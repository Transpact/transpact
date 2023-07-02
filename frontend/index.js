// React
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// NEAR
import { Wallet } from "./near-wallet";

// const CONTRACT_ADDRESS = process.env.CONTRACT_NAME;
const CONTRACT_ADDRESS = "dev-1688285985299-62443913276139";

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS });

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();

  ReactDOM.render(
    <App
      isSignedIn={isSignedIn}
      wallet={wallet}
      contractId={CONTRACT_ADDRESS}
    />,
    document.getElementById("root")
  );
};
