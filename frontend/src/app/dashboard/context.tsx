// auth-provider.tsx
"use client";

import { Profile } from "@/lib/auth";
import { createContext, useContext, ReactNode } from "react";

type AuthContextType = {
  token: string;
  profile: Profile | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider = ({
  children,
  token,
  profile,
}: {
  children: ReactNode;
  token: string;
  profile: Profile | undefined;
}) => {
  return (
    <AuthContext.Provider value={{ token, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
