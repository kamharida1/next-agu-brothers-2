import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Script from "next/script";
import DrawerButton from "@/components/DrawerButton";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import Header from "@/components/header/header";

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  title: {
    default: "Agu Brothers",
    template: "%s | Agu Brothers Electronics",
  },
  description:
    "Delivering top-quality home electronics and appliances to our valued customers. From cutting-edge high-definition televisions to energy-efficient refrigerators, versatile gas cookers, powerful freezers, generators, air conditioners, and a wide range of home essentials—our mission is clear: to offer reliable, innovative, and cost-effective solutions that elevate your everyday living experience.",
  verification: {
    google:
      "google-site-verification=S3WVPpJ9iNLKBaAbgZ2gfw8KwkU4fcHRMWX-ukR2a1U",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Providers>
          <div className="drawer z-150">
            <DrawerButton />
            <div className="drawer-content flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              
              <footer className="footer p-10 bg-base-200 text-base-content">
                <div className="container mx-auto">
                  <aside className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
                    {/* Company Overview */}
                    <div className="flex flex-col items-start gap-2">
                      <p className="text-lg font-bold mb-2">Agu Brothers</p>
                      <p className="text-sm md:max-w-md">
                        From cutting-edge high-definition televisions to
                        energy-efficient refrigerators, versatile gas cookers,
                        powerful freezers, generators, air conditioners, and a
                        wide range of home essentials.
                      </p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:col-span-3">
                      {/* Services Section */}
                      <div className="flex flex-col gap-2">
                        <h6 className="footer-title text-lg font-semibold">
                          Services
                        </h6>
                        <Link href="/blog" className="link link-hover">
                          Blog
                        </Link>
                      </div>

                      {/* Company Section */}
                      <div className="flex flex-col gap-2">
                        <h6 className="footer-title text-lg font-semibold">
                          Company
                        </h6>
                        <ul className="space-y-1">
                          <li>
                            <Link href="/about-us" className="link link-hover">
                              About us
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/contact-us"
                              className="link link-hover"
                            >
                              Contact us
                            </Link>
                          </li>
                          <li>
                            <Link href="/careers" className="link link-hover">
                              Careers
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Legal Section */}
                      <div className="flex flex-col gap-2">
                        <h6 className="footer-title text-lg font-semibold">
                          Legal
                        </h6>
                        <ul className="space-y-1">
                          <li>
                            <Link
                              href="/terms-and-conditions"
                              className="link link-hover"
                            >
                              Terms of use
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/privacy-policy"
                              className="link link-hover"
                            >
                              Privacy Policy
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </aside>
                </div>
              </footer>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <Sidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
