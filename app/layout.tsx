import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar"; // importing the nav bar so that it is located in the MAIN layour
import Sidebar from "@/components/sidebar"; // same for the side bar, essnetial for it to be visible at all times
import '@stream-io/video-react-sdk/dist/css/styles.css' // base style for StreamTheme, allowing for end call,pin, etc.
import './globals.css'
import 'react-datepicker/dist/react-datepicker.css'


// import NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from 
require('dotenv').config()

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the app
export const metadata: Metadata = {
  title: "Daylook",
  description: "Generated by Fiona X Rashell",
  // icons: {
  //   icon: "/images/DLOGOO.png", ////////NOT SHOWING UP
  // }
};


const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <body className={`${geistSans.variable} ${geistMono.variable} bg-dark-2 antialiased`}>

          {/* Global navbar */}
          <main className="relative">
            <Navbar />

            <div className="flex">
              {/* Global Sidebar */}
              <Sidebar />

              {/* Main Content Area */}
              <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
                <div className="w-full">{children}</div>
              </section>
            </div>
          </main>
          <Toaster />

        </body>
      </ClerkProvider>
    </html>
  );
}


export default RootLayout;