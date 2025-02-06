"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from '../Loader';
import { useToast } from "@/hooks/use-toast"
import { Plus,UserPlus, CalendarPlus, LibraryBig, Copy, CheckCircle } from 'lucide-react';
import { Textarea } from './textarea';
import ReactDatePicker from 'react-datepicker'

const MeetingType = () => {

  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });

  const [callDetail, setCallDetail] = useState<Call>();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('Failed to create meeting');

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'Meeting Created',
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Meeting' });
    }
  };
  if (!client || !user) return <Loader />;

  // currently local host, but when deployed it will be current domain name
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`; // this uses the currentID
  // const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${crypto.randomUUID()}`; // this generates a random anonymous link everytime

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        className='bg-pink-400'
        img={<Plus />}
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img={<UserPlus/>}
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img={<CalendarPlus/>}
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-400"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img={<LibraryBig/>}
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-zinc-600"
        handleClick={() => router.push('/recordings')}
      />


      {!callDetail ? (
        <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Create Meeting"
        handleClick={createMeeting}
      >
        <div className='flex flex-col gap-2.5'>
          <label className='text-base text-normal leading-[22px] text-sky-400'>Add a description</label>
          <Textarea className='bg-gray-800 rounded border-none focus-visible:ring-0 focus-visible:ring-offset-0'
          onChange={(e) => {
            setValues({...values, description: e.target.value})
          }}/>
        </div>
        <div className='flex w-full flex-col gap-2.5'></div>
          <label className='text-base text-normal leading-[22px] text-sky-400'>Select Date & Time:</label>
         {/* property of date */}
          <ReactDatePicker 
          selected={values.dateTime}
          onChange={(date) => setValues({...values, dateTime: date! })}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          timeCaption='time'
          dateFormat={'MMMM d, yyyy h:mm aa'}
          className='w-full rounded bg-gray-800 p=2 focus:outline-none'
          />
      </MeetingModal>


        ) : (
       <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Meeting Created"
        className="text-center"
        handleClick={() => {
          navigator.clipboard.writeText(meetingLink)
          toast({ title : 'Link copied' })
        }}
        // image={<CheckCircle className="w-10 h-10 text-green-500" />}  // not showing up
        // buttonIcon={<Copy />}       // not showing up
        image='/icons/checked.svg'  // not showing up --> it workedddd ; FIXED
        buttonIcon='icons/copy.svg'    // not showing up --> it workeddddd ; FIXED
        buttonText='Copy Meeting Link'        
      />
        )}


      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      />
      
      
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
      
    </section>

  );
};


export default MeetingType