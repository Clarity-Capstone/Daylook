import { Sidebar } from 'lucide-react';
import './globals.css';
import Navbar from '@/components/Navbar'; // Import Navbar or other global components

// export const metadata = {
//   title: 'DayLook',
//   description: 'A Zoom-like app with modern features.',
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-500 text-black">
      {/* {children} */}
        {/* Global Navbar */}
        <Navbar />
        {/* Content for all pages */}
        <main>{children}</main>
      </body>
    </html>
  );
}

