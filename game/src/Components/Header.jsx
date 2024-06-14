import React from 'react'

function Header() {
    return (
        <div>
            <div className='text-white flex justify-center gap-3 pt-16 w-full max-w-[325px] mx-auto text-[12px] text-center'>
                <div className='bg-[#421F78] rounded-2xl p-3'>
                    <span>
                        Feed per tap
                    </span>
                    <div className='flex gap-2 justify-center'><img src="assets/game/pajamas_food.svg" alt="feed" />-3</div>
                </div>
                <div className='bg-[#421F78] rounded-2xl p-3'>
                    <span>
                        Feed to hatch
                    </span>
                    <div className='flex gap-2 justify-center'><img src="assets/game/pajamas_food.svg" alt="feed" />10k</div>
                </div>
                <div className='bg-[#421F78] rounded-2xl p-3'>
                    <span>
                        Income per hour
                    </span>
                    <div className='flex gap-2 justify-center'><img src="assets/game/tabler_coin-filled.svg" alt="feed" />+2.1k</div>
                </div>
            </div>

            <div className='text-3xl text-white flex mt-6 justify-between max-w-[325px] mx-auto w-full'>
                <div>
                    <div className='flex items-center gap-4'><img src="assets/game/pajamas_food.svg" alt="feed" width='50' />7024</div>
                </div>
                <div>
                    <div className='flex items-center gap-4'><img src="assets/game/tabler_coin-filled.svg" alt="feed" width='50' />7024</div>
                </div>
            </div>
        </div>
    )
}

export default Header