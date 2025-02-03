import React from 'react'
import MeetingType from '@/components/ui/meetingType'
import BaseLayout from './layout'
// import BWDaylookBanner from '../../../images/BWDaylookBanner.png'

const Page = () => {
  const now = new Date();

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);

  // return <div>hello</div>

  return (
    <BaseLayout>
      <section className="flex size-full flex-col gap-10 text-white">
        <div className="h-[300px] w-full rounded-[20px] bg-link bg-cover">
          <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
            <h2 className='glassmorphism max-w-[273px] rounded py-2 text-center text-base font-mono'>Upcoming Meeting at: 1:00 PM</h2>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
              <p className="text-lg font-medium text-sky-200 lg:text-2xl">{date}</p>
            </div>
          </div>
        </div>

        <MeetingType />
      </section >
    </BaseLayout>
  );
};

export default Page;
