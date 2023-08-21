import { createContext } from "react";

export type UserContextType = {
  user: User | undefined;
  setUser: (val: User) => void;
};

export const UserContext = createContext<UserContextType | null>(null);
