import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DLOGO from '../images/DLOGOO.png'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';



const Navbar = () => {
  return (
    <nav className="flex items-center justify-between fixed z-50 w-full bg-brown-500 px-6 py-4 lg:px-10 text-white">
      <Link href="/" className="sticky flex items-center gap-2">
        <Image
          src={DLOGO}
          style={{width:'auto'}}
          height={42}
          alt="Logo"
          className="Logo"
          
        />
        <p className="sticky font-bold text-lg">DayLook</p>
      </Link>

      <div className='flex-between gap-5'>
        <SignedIn>
          <UserButton />
        </SignedIn>

      </div>



    </nav>
  );
};

export default Navbar;