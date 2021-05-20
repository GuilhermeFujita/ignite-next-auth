import { createContext, ReactNode, useState } from 'react';
import { api } from '../services/api';
import { setCookie } from 'nookies';
import Router from 'next/router';

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>,
  user: User;
  IsAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const IsAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/sessions', {
        email,
        password
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30 //30 days
      });

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30 //30 days
      });

      setUser({
        email,
        permissions,
        roles,
      });

      Router.push('/dashboard')

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, IsAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}