import React, { ReactNode } from 'react'

export const root = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      {children}
    </main>
  )
}

export default root
