'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import React from 'react';

interface HomeCardProps {
  className?: string;
  img: string | React.ReactNode; // updated to allow a string or React element (in our case we want the lucid-react icon ot appear); string is there jic
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ className, img, title, description, handleClick }: HomeCardProps) => {
  return (
    <section
      className={cn(
        'px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      {/* div allows the image source to be accepted as a string or react nod efor the icon to render*/}
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        {typeof img === 'string' ? (
          <Image src={img} alt="meeting" width={27} height={27} />
        ) : (
          img
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </section>
  );
};

export default HomeCard;