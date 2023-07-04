import { createContext, useState } from 'react';
import { User } from '../config/Interface';

export const UserContext = createContext({
  user: null as User | null,
  setUser: (user: User) => {}
});

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  const value = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
