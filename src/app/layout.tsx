import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { UserProvider } from "@/contexts/UserContext";
import Navbar from "@/components/layout/Navbar";
import { AgeVerificationWrapper } from "@/components/AgeVerificationWrapper";

// Import required CSS for Solana wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HotCams - Premium Adult Live Cam Platform | 18+ Only",
  description: "Premium adult entertainment platform with live cam shows, private sessions, and crypto tipping. Join thousands of verified 18+ performers earning with ETH, SOL, and USDC. Secure, anonymous, and decentralized.",
  keywords: "adult cams, live cam girls, private shows, crypto tips, adult entertainment, cam models, 18+, ethereum, solana, USDC",
  robots: "noindex, nofollow", // Prevent search engine indexing for adult content
  other: {
    "rating": "RTA-5042-1996-1400-1577-RTA",
    "content-rating": "adult"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Adult content meta tags */}
        <meta name="rating" content="adult" />
        <meta name="adult" content="yes" />
        <meta name="mature" content="true" />
        <meta httpEquiv="Content-Rating" content="adult" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-white dark:bg-gray-900`}>
        <WalletProvider>
          <UserProvider>
            <AgeVerificationWrapper>
              <div className="min-h-full flex flex-col">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
              
              {/* Footer with legal disclaimers */}
              <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <span className="bg-red-600 px-3 py-1 rounded-full font-bold">18+ ONLY</span>
                      <span>All models are 18 years of age or older</span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                      <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                      <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                      <a href="/age-verification" className="hover:text-white transition-colors">Age Verification</a>
                      <a href="/dmca" className="hover:text-white transition-colors">DMCA</a>
                      <a href="/support" className="hover:text-white transition-colors">Support</a>
                    </div>
                    
                    <div className="text-xs text-gray-500 max-w-4xl mx-auto">
                      <p className="mb-2">
                        WARNING: This website contains adult material intended for viewers over 18 years of age. 
                        By entering this site, you acknowledge that you are of legal age and agree to our terms.
                      </p>
                      <p>
                        HotCams is a decentralized adult entertainment platform. All transactions are processed 
                        on blockchain networks. We do not store payment information or personal data.
                      </p>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      © 2024 HotCams. All rights reserved. | Powered by Web3 Technology
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </AgeVerificationWrapper>
          </UserProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
