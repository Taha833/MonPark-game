import React from 'react'

function House({ progress }) {

    progress = 20
    const progressValue = Math.min(Math.max(progress, 0), 100);
    return (
        <div>
            <div className='max-w-[325px] mx-auto mt-8 w-full'>
                <div className='text-white flex justify-between'>
                    <span>Egg</span>
                    <span>Hatch</span>
                </div>
                <progress
                    className=" w-full h-2"
                    value={progressValue}
                    max="100"

                />
            </div>

            <div className='flex max-w-[325px] mx-auto justify-between w-full'>
                <div className='text-white flex gap-3'>
                    <img src="assets/game/tabler_bowl-spoon.svg" alt="bowl" />
                    <span>124 / 500</span>
                </div>
                <div className='text-white flex gap-3'>
                    <img src="assets/game/kitchen.svg" alt="kitchen" />
                    <span>Kitchen</span>
                </div>
            </div>
        </div>
    )
}

export default House