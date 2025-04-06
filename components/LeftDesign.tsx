import React from 'react'
import Image from 'next/image'

function LeftDesign() {
  return (
    <div className="w-1/2 hidden lg:flex justify-center items-center h-[91.5vh]">
        <Image src="/leftis.avif" alt="Bulk Email Sender" className="h-full w-full" width={1000} height={1000} />
    </div>
  );
}

export default LeftDesign
