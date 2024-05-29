import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import Providers from "@/components/Providers";
import Script from 'next/script'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agu Brothers",
  description: "Official Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Remove the unnecessary import statement here

  return (
    <html lang="en">
      <body className={inter.className}>
        <Script src="https://sdk.monnify.com/plugin/monnify.js" />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            {children}
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
              <p>Copyright © 2024 - All right reserved by Agu Brothers</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}

