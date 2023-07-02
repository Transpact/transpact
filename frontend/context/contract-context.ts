import { Wallet } from "@/near-wallet";
import { createContext } from "react";

export type ContractContextType = {
  contracts: Contract[];
  setContracts: (val: Contract[]) => void;
};

export const ContractContext = createContext<ContractContextType | null>(null);
