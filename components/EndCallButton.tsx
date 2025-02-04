'use client' // must use client if we are using hooks

import React from 'react'
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { PhoneOff } from 'lucide-react';

const EndCallButton = () => {

    // access to information about the call bu using the 'UseCall' hook
    const call = useCall();
    // renavigagte to the home page by accessing router; once meeting has ended
    const router = useRouter()

    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant(); // access to the hook easily

    // checks meeting owner by comparing id
    const isMeetingOwner = localParticipant && call?.state.createdBy && 
    localParticipant.userId === call.state.createdBy.id

    // will not show button if not meeting owner
    if(!isMeetingOwner) return null 


  return ( // return end call button if meeting owner
    <Button title='End for everyone'className='bg-red-200 rounded hover:bg-red-600' onClick={async () => {
        await call.endCall();
        router.push('/')
    }}>
        <PhoneOff/>
    </Button>
  )
}

export default EndCallButton