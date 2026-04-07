'use client'

import { SessionProvider } from 'next-auth/react'

type AuthSessionProviderProps = {
  children: React.ReactNode;
}

const AuthSessionProvider = ({ children }: AuthSessionProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthSessionProvider