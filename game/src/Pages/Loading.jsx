import React from 'react'

function Loading() {
    return (
        <div className='bg-gradient'>
            <div className='h-screen relative flex flex-col'>
                <img src='/assets/creature 1.png' alt="creature" className='absolute top-14' />
                <img src='/assets/creature 2.png' alt="creature" className='absolute top-56' />
                <img src='/assets/creature 3.png' alt="creature" className='absolute right-0' />
                <img src='/assets/creature 4.png' alt="creature" className='absolute right-0 top-60' />
                <div className="flex flex-col items-center text-center gap-5 flex-[0.8] justify-center z-10">
                    <img src="/assets/monpark logo.svg" alt="monpark" />
                    <h1 className="text-white font-bold text-2xl">Take care of your pet in MonPark</h1>
                </div>
            </div>
        </div>
    )
}

export default Loading