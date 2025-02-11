// import { Section } from 'lucide-react'
'use client'; // must use client if we are using hooks

import { CallParticipantsList, PaginatedGridLayout, SpeakerLayout, CallControls, CallStatsButton, useCallStateHooks, CallingState } from '@stream-io/video-react-sdk'
import React, { use, useState } from 'react'
import EndCallButton from './EndCallButton'

import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { LayoutList, User, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Loader from './Loader';
import '@stream-io/video-react-sdk/dist/css/styles.css' // base style for StreamTheme, allowing for end call,pin, etc.
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/navigation';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
import NotesPage from './NotesPage';


type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'


const MeetingRoom = () => {
    // Search params for isPersonalRoom
    const searchParams = useSearchParams() // imported as well

    // Button that will allow to end meeting for everyone, IF you are meeting owner
    // 'personal' => !'personal' => false => !false => true
    // undefined => !undefined => true => false
    const isPersonalRoom = !!searchParams.get('personal')

    // If we do have access to the personal (meaning it is the metting owner), true- yes ; false-no



    //layout component, that is dependent on layout state
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left')

    //To show participants actively
    const [showParticipants, setShowParticipants] = useState(false)

    const router = useRouter();

    // Access calling state;
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState(); // access to the hook easily

    if (callingState !== CallingState.JOINED) return <Loader />

    //Since we know the type, create a function component
    // function that will render specific layout, depedning on lalyout state
    const CallLayout = () => {
        switch (layout) {
            case 'grid': // if type is grid
                return <PaginatedGridLayout /> // return layout from stream
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition='right' />
            default:
            case 'speaker-left':
                return <SpeakerLayout participantsBarPosition='left' />
        }
    }

    return (
        <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
             <ResizablePanelGroup direction="horizontal">
             <ResizablePanel defaultSize={35} minSize={25} maxSize={100} className="relative">
            <div className='relative flex size-ful items-center justify-center'>

                <div className='flex size-full max-w-[1000px] items-center'>
                    <CallLayout />
                </div>
                {/* Render all the participants ↓ */}
                <div className={cn('h-[calc(100vh-86px)] hidden ml-2', { 'show-block': showParticipants })}>
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
            </div>

            {/* Video layout & Call controls */}
            <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
                <CallControls onLeave={() => router.push('/')} />

                {/* Drop down menue to change layout */}
                <DropdownMenu>
                    <div className='flex items-center'>
                        <DropdownMenuTrigger className=' cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
                            <LayoutList size={20} className='text-white' />
                        </DropdownMenuTrigger>
                    </div>

                    {/* Menue Types : grid, speaker left OR right */}
                    <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
                        {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) =>
                            <div key={index}>
                                <DropdownMenuItem className='cursor-pointer' onClick={() => {
                                    setLayout(item.toLowerCase() as CallLayoutType)
                                }}>
                                    {item}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className='border-dark-1' />
                            </div>
                        )}

                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Shows stats on the call - wifi, call latency, region, etc. */}
                <CallStatsButton />
                <button onClick={() => setShowParticipants((prev) => !prev)}>
                    <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
                        <Users size={20} className='text-white' />
                    </div>
                </button>


                {/* To end the call if personal room */}
                {!isPersonalRoom && <EndCallButton />}


            </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
                <ResizablePanel defaultSize={65} minSize={25}>
                    <NotesPage/>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    )
}

export default MeetingRoom