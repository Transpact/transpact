import { Wallet } from "@/near-wallet";
import { createContext } from "react";

export type WalletContextType = {
  isSignedIn: boolean;
  contractId?: string;
  wallet: Wallet;
};

export const WalletContext = createContext<WalletContextType | null>(null);
