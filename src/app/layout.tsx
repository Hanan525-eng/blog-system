import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Navbar />
        {children}
       
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            className: "bg-gray-800 text-white rounded-lg shadow-lg border-color-purple-700",
            style: {
              fontFamily: "var(--font-geist-sans)",
            },
          }}
        />
       
      </body>
    </html>
  );
}
