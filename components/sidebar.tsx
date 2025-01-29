import React, { FC } from 'react'; // FC stands for Functional Component
import Link from 'next/link';
import { Home, Calendar, Video, FileText, PlusCircle } from 'lucide-react';
// import UpcomingPage from '@/app/(root)/(home)/Upcoming/UpcomingPage';


// Sidebar Component
const Sidebar: FC = () => {
  return (
    <section
      className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]"
    >
      <div className="sticky flex flex-col gap-6">
        <Link href="/" className="flex gap-4 items-center p-4 rounded-lg justify-start text-white hover:bg-sky-700">
          <Home className="w-6 h-6" /> Home
        </Link>
        <Link href="/Upcoming" className="flex gap-4 items-center p-4 rounded-lg justify-start text-white hover:bg-sky-700">
          <Calendar className="w-6 h-6" /> Upcoming
        </Link>
        <Link href="/Previous" className="flex gap-4 items-center p-4 rounded-lg justify-start text-white hover:bg-sky-700">
          <Video className="w-6 h-6" /> Previous
        </Link>
        <Link href="/Recordings" className="flex gap-4 items-center p-4 rounded-lg justify-start text-white hover:bg-sky-700">
          <FileText className="w-6 h-6" /> Recordings
        </Link>
        <Link href="/Personal_Room" className="flex gap-4 items-center p-4 rounded-lg justify-start text-white hover:bg-sky-700">
          <PlusCircle className="w-6 h-6" /> Personal Room
        </Link>
      </div>
      
    </section>

  );
};

export default Sidebar;
