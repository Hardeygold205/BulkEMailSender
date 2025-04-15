import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/constants/Navbar";
import BackgroundGrid from "@/components/BackgroundGrid";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bulk Email Sender",
  description: "Send bulk emails to your customers",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}><StackProvider app={stackServerApp}><StackTheme>
        <div className="relative min-h-screen w-full overflow-hidden">
          <BackgroundGrid />
          <div className="relative z-10">
            <Navbar />
            <div className="mx-auto max-w-8xl">{children}</div>
          </div>
        </div>
      </StackTheme></StackProvider></body>
    </html>
  );
}
