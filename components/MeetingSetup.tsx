'use client'

import React from 'react'
import { VideoPreview, useCall, DeviceSettings } from '@stream-io/video-react-sdk'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'

const MeetingSetup = ({setIsSetupComplete} : {setIsSetupComplete : (value: boolean) => void}) => {
// we want to acces the call too
const call = useCall(); 

//if we can not connect, throw error
if(!call) {
    throw new Error('call not able to connect. Make sure UseStreamCall is being used withing StreamCall component🤑')
}
//Allowing for camera & microphone

    const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)
    useEffect(() => {
        //if Mic & camera are on , you may disable, ELSE enable
        if(isMicCamToggledOn) {
            call?.camera.disable()
            call?.microphone.disable()
        } else {
            call?.camera.enable()
            call?.microphone.enable()
        }
    }, [isMicCamToggledOn, call?.camera, call?.microphone])
    


  return (
    <div className='flex h-screen w-full flex-col items center justify-center gap-3 text-white'>
        <h1 className='text-2xl font-bold'>Setup</h1>
        <VideoPreview />
        {/* modify camera/mic */}
        <div className='flex h-16 items-center justify-center gap-3'>
            <label className="flex items-center justify-center gap-2 font-medium">
                <input type="checkbox" 
                checked={isMicCamToggledOn}
                onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
                />
                Join with camera & microphone OFF yee yee
            </label>
        <DeviceSettings /> {/* Added just as a stretch feature ;) */}
        </div>
        <Button className='rounded-md bg-green-500 px-4 py-2.5' onClick={() => {
            call.join();
            setIsSetupComplete(true) // taking in boolean, passing it up as a prop in params
        }}>
            Join Meeting
        </Button>
    </div>
  )
}

export default MeetingSetup