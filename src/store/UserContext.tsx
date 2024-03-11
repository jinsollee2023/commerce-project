import { IUser } from "@/types/types";
import React, { createContext, useState } from "react";

interface UserContextProps {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isSeller: boolean | null;
  setIsSeller: (user: boolean | null) => void;
}

const contextDefaultValues: UserContextProps = {
  user: null,
  setUser: () => {},
  isSeller: null,
  setIsSeller: () => {},
};

const UserContext = createContext(contextDefaultValues);

export const useUser = () => React.useContext(UserContext);

const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState(contextDefaultValues.user);
  const [isSeller, setIsSeller] = useState(contextDefaultValues.isSeller);

  const contextValue: UserContextProps = {
    user,
    setUser,
    isSeller,
    setIsSeller,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
