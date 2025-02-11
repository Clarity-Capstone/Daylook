//@ts-nocheck
'use client'

import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import MeetingCard from './MeetingCard'
import { Loader } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {

  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls()

  // to figure where we are in the route
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const { toast } = useToast();


  // get the exact type of calls 
  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls
      case 'recordings':
        return recordings
      case 'upcoming':
        return upcomingCalls
      default:
        return [];
    }
  }

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls'
      case 'recordings':
        return 'No Recordings'
      case 'upcoming':
        return 'No Upcoming'
      default:
        return '';
    }
  }

  // ---Rashell---RECORDING PAGE------------

  // useEffect to fetch recordings for each specific call
  //useEffect where we look for the type and call

  useEffect(() => {
    // function is equal to a async function 
    const fetchRecordings = async () => {
      try {
        // How do we fetch recordings for each diff call?
        // first: get access to meetings
        const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings()))

        const recordings = callData
          .filter(call => call.recordings.length > 0)
          .flatMap(call => call.recordings)

        setRecordings(recordings);

      } catch (error) {
        toast({ title: 'Try again later' })
      }
    }

    if (type === 'recordings') fetchRecordings();
  }, [type, callRecordings]);

  // ----------------- 


  // storing return message for getCalls in constant
  const calls = getCalls()
  // storing return message for getCalls in constant
  const noCallsMessage = getNoCallsMessage()

  if (isLoading) return <Loader />

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
      {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
        <MeetingCard
          // key={(meeting as Call).id}
          key={'id' in meeting ? meeting.id : meeting.url} //better option since you are checking if meeting object has an id, and if it does its a call, and if not it will refrence the url as the key
          icon={
            type === 'ended'
              ? '/icons/previous.svg'
              : type === 'upcoming'
                ? '/icons/upcoming.svg'
                : '/icons/recordings.svg'
          }

          // title={(meeting as Call).state.custom.description.substring(0, 25) || 'No description'}
          title={meeting.state?.custom?.description?.substring(0, 25) || meeting?.filename?.substring(0, 20) || 'Personal Meeting'}
          date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
          isPreviousMeeting={type === 'ended'}
          buttonIcon1={type === 'recordings' ? 'icons/play.svg' : undefined}
          handleClick={type === 'recordings' ? () => router.push(`${meeting.url}`) : () => router.push(`/meeting/${meeting.id}`)}
          
          /* Thought that if i added a target the handleClick would allow the recording to be opened inline , but that had osmething to do with Content-Disposition on server side
          handleClick={
            type === 'recordings'
              ? () => window.open(meeting.url, '_blank')
              : () => router.push(`/meeting/${meeting.id}`)
          }
          */
          
          // creating a new meeting link so it works for deployed project
          link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
          buttonText={type === 'recordings' ? 'Download' : 'Start'}
        />
      )) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  )
}

export default CallList


// 'use client';

// import { Call, CallRecording } from '@stream-io/video-react-sdk';

// import Loader from './Loader';
// import { useGetCalls } from '@/hooks/useGetCalls';
// import MeetingCard from './MeetingCard';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
//   const router = useRouter();
//   const { endedCalls, upcomingCalls, callRecordings, isLoading } =
//     useGetCalls();
//   const [recordings, setRecordings] = useState<CallRecording[]>([]);

//   const getCalls = () => {
//     switch (type) {
//       case 'ended':
//         return endedCalls;
//       case 'recordings':
//         return recordings;
//       case 'upcoming':
//         return upcomingCalls;
//       default:
//         return [];
//     }
//   };

//   const getNoCallsMessage = () => {
//     switch (type) {
//       case 'ended':
//         return 'No Previous Calls';
//       case 'upcoming':
//         return 'No Upcoming Calls';
//       case 'recordings':
//         return 'No Recordings';
//       default:
//         return '';
//     }
//   };

//   useEffect(() => {
//     const fetchRecordings = async () => {
//       const callData = await Promise.all(
//         callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
//       );

//       const recordings = callData
//         .filter((call) => call.recordings.length > 0)
//         .flatMap((call) => call.recordings);

//       setRecordings(recordings);
//     };

//     if (type === 'recordings') {
//       fetchRecordings();
//     }
//   }, [type, callRecordings]);

//   if (isLoading) return <Loader />;

//   const calls = getCalls();
//   const noCallsMessage = getNoCallsMessage();

//   return (
//     <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
//       {calls && calls.length > 0 ? (
//         calls.map((meeting: Call | CallRecording) => (
//           <MeetingCard
//             key={(meeting as Call).id}//
//key={'id' in meeting ? meeting.id : meeting.url} --> add if uncommented

//             icon={
//               type === 'ended'
//                 ? '/icons/previous.svg'
//                 : type === 'upcoming'
//                   ? '/icons/upcoming.svg'
//                   : '/icons/recordings.svg'
//             }
//             title={
//               (meeting as Call).state?.custom?.description ||
//               (meeting as CallRecording).filename?.substring(0, 20) ||
//               'No Description'
//             }
//             date={
//               (meeting as Call).state?.startsAt?.toLocaleString() ||
//               (meeting as CallRecording).start_time?.toLocaleString()
//             }
//             isPreviousMeeting={type === 'ended'}
//             link={
//               type === 'recordings'
//                 ? (meeting as CallRecording).url
//                 : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
//             }
//             buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
//             buttonText={type === 'recordings' ? 'Play' : 'Start'}
//             handleClick={
//               type === 'recordings'
//                 ? () => router.push(`${(meeting as CallRecording).url}`)
//                 : () => router.push(`/meeting/${(meeting as Call).id}`)
//             }
//           />
//         ))
//       ) : (
//         <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
//       )}
//     </div>
//   );
// };

// export default CallList;