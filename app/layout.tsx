import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AuthSessionProvider from "@/components/SessionProvider"
import Providers from "@/components/providers"
import { KeyboardShortcutsProvider } from "@/components/KeyboardShortcutsProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hildam Couture",
  description: "Tailoring Management System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthSessionProvider>
          <Providers>
            <KeyboardShortcutsProvider>
              {children}
            </KeyboardShortcutsProvider>
          </Providers>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
