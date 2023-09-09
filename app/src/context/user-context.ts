import { createContext } from "react";
import { User } from "~/types/models";

export type UserContextType = {
  user: User | undefined;
  setUser: (val: User) => void;
};

export const UserContext = createContext<UserContextType | null>(null);
