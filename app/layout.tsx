import Providers from "../components/providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Play } from "next/font/google";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SessionProvider from "@/components/SessionProvider";
import { authOptions } from "@/lib/auth"; // Import NextAuth config
import { Session } from "next-auth";

const play = Play({ subsets: ["latin"], weight: ["400", "700"] });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hildam Couture",
  description: "A Fashion Stylist Website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the user's session on the server
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-black bg-[#f9f7f7]`}
      >
        <SessionProvider session={session}>
          <div className={`w-full flex flex-row bg-[#f9f7f7] ${play.className}`}>
            <Providers>{children}</Providers>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
