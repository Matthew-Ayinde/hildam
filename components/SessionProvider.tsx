"use client";

import { SessionProvider as NextAuthProvider } from "next-auth/react";
import type { Session } from "next-auth";
import React from "react";

interface SessionProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function SessionProvider({
  children,
  session,
}: SessionProviderProps) {
  return (
    <NextAuthProvider session={session}>
      {children}
    </NextAuthProvider>
  );
}
