import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Sidebar from "@/components/storeManager/Sidebar";
import Topbar from "@/components/storeManager/Topbar";
import { Play } from "next/font/google";

const play = Play({ subsets: ["latin"], weight: ["400", "700"] });


export const metadata: Metadata = {
  title: "Hildam Couture",
  description: "A Fashion Stylist App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return ( 
    <html lang="en">
      <body
        className={`antialiased text-black`}
      >
        <div className={`w-full flex flex-col lg:flex-row bg-[#f9f7f7] ${play.className}`}>
            <div className="lg:max-w-[250px] max-w-full w-full lg:w-1/4">
              <div className=""> <Sidebar /> </div>
            </div>
            <div className="lg:mx-10 mx-0 px-5 lg:px-0 h-full w-full lg:w-3/4">
              <div className="mb-10 lg:mt-0 mt-20">
                <Topbar />
              </div>
              <div className="mb-40">{children}</div>
              <div>
                <Footer />
              </div>
            </div>
        </div>
      </body>
    </html>
  );
}
