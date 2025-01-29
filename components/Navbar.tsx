import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DLOGO from '../images/DLOGOO.png'



const Navbar = () => {
  return (
    <nav className="flex items-center justify-between fixed z-50 w-full bg-brown-500 px-6 py-4 lg:px-10 text-white">
      <Link href="/" className="sticky flex items-center gap-2">
        <Image
          src={DLOGO}
          width={36}
          height={36}
          alt="Logo"
          className="Logo" 
        />
        <p className="sticky font-bold text-lg">DayLook</p>
      </Link>
    </nav>
  );
};

export default Navbar;