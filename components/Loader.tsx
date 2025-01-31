import React from 'react'
import Image from 'next/image'




const Loader = () => {
  return (
    <div className='flex-center h-screen w-full'>
      hello world
      <Image
        src="/icons/Gray_circles_rotate.gif"
        alt="Loading"
        width={50}
        height={50}
      />
    </div>
  )
}

export default Loader