'use client'
import React from 'react'
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import { useState } from 'react'
import MeetingSetup from '@/components/MeetingSetup'
import MeetingRoom from '@/components/MeetingRoom'
import useGetCallById from '@/hooks/useGetCallById'
import { Loader } from 'lucide-react'

//syncronous code and the app expects params to be avaliable imediatly
// if we use a prmoise it makes it so coide is asynronous, so if param is not avalibe the app will run other code  


// This unwraps the promise and gives you the resolved object so you can use id normally
const Meeting = ({ params }: { params: Promise<{ id: string }> }) => {
  // Unwrap the promise with React.use()
  const { id } = React.use(params);
  const { user, isLoaded } = useUser();
  const [isSetUpComplete, setIsSetupComplete] = useState(false)
  const { call, isCallLoading } = useGetCallById(id)

  // if call is loading, render loading icon 
  if (!isLoaded || isCallLoading) return <Loader />


  return (
    <main className="h-screen w-full">
      {/* stream call provider ensures which call we are in*/}
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetUpComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} /> // passing setIsSetupComplete as a prop
          ) : (<MeetingRoom />)}
        </StreamTheme>
      </StreamCall>
    </main>

  )

}

export default Meeting
