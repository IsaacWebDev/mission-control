import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import LiveFeed from "@/components/livefeed";
import { Toaster } from "@/components/toaster";
import QueryProvider from "./providers/QueryProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mission Control",
  description: "OpenClaw System Monitoring Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white bg-[#0a0e17]`}
      >
        <QueryProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar with error boundary */}
            <ErrorBoundary 
              fallback={
                <div className="w-[240px] fixed left-0 top-0 h-screen glass-sidebar p-4 flex items-center justify-center">
                  <p className="text-red-400 text-sm">Sidebar error</p>
                </div>
              }
            >
              <Sidebar />
            </ErrorBoundary>

            <div className="flex-1 flex flex-col ml-[240px] mr-80">
              {/* Header with error boundary */}
              <ErrorBoundary 
                fallback={
                  <div className="h-14 glass-header flex items-center px-6">
                    <p className="text-red-400 text-sm">Header error</p>
                  </div>
                }
              >
                <Header />
              </ErrorBoundary>

              {/* Main content with error boundary */}
              <main className="flex-1 overflow-auto">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
            </div>

            {/* LiveFeed with error boundary */}
            <ErrorBoundary 
              fallback={
                <div className="w-80 glass-sidebar fixed right-0 top-0 h-screen p-4 flex items-center justify-center">
                  <p className="text-red-400 text-sm">Live feed unavailable</p>
                </div>
              }
            >
              <LiveFeed />
            </ErrorBoundary>
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
