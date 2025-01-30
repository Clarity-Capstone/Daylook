// import StreamVideoProvider from '@/providers/StreamClientProvider'
import React, { ReactNode } from 'react'

export const root = ({ children }: { children: ReactNode }) => {
  return (
    <main>

      {/* <StreamVideoProvider> */}
      {children}
      {/* </StreamVideoProvider> */}

    </main>
  )
}

export default root
