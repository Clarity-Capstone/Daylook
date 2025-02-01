'use client'
import React from 'react'
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import { useState } from 'react'

//syncronous code and the app expects params to be avaliable imediatly
// if we use a prmoise it makes it so coide is asynronous, so if param is not avalibe the app will run other code  


const Meeting = ({ params }: { params: { id: string } }) => {
  const { user, isLoaded } = useUser()
  const [isSetUpComplete, setIsSetupComplete] = useState(false)
  return (


    <main className="h-screen w-full">
      <StreamCall>
        <StreamTheme>
          {!isSetUpComplete ?
            'Meeting Setup' : ('Meeting Room')}
        </StreamTheme>
      </StreamCall>
    </main>

  )

}

export default Meeting