import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Sidebar from "@/components/client-manager/Sidebar";
import Topbar from "@/components/client-manager/Topbar";
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
      <body className={`antialiased text-black`}>
        <div
          className={`w-full flex flex-col lg:flex-row bg-[#f9f7f7] ${play.className}`}
        >
          <div className="lg:max-w-[250px] max-w-full w-full lg:w-1/4">
            <div className="">
              {" "}
              <Sidebar />{" "}
            </div>
          </div>
          <div className="lg:mx-10 mx-0 px-5 lg:px-0 min-h-screen h-full flex flex-col justify-between  w-full lg:w-3/4">
            <div className="mb-5 lg:mt-0 mt-20 h-1/6">
              <Topbar />
            </div>
            <div className="pb-10 h-4/6">{children}</div>
            <div className="1/6">
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
