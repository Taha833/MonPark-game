import React from 'react'
import useUserData from '../Hooks/useUserData'

function Header() {
    const { userData } = useUserData()

    return (
        <div>
            <div className='text-white flex justify-center gap-3 pt-16 w-full max-w-[325px] mx-auto text-[12px] text-center'>
                <div className='bg-[#421F78] rounded-2xl p-3'>
                    <span>
                        Feed per tap
                    </span>
                    <div className='flex gap-2 justify-center'><img src="/assets/game/pajamas_food.svg" alt="feed" />+{userData.foodPerTap}</div>
                </div>
                <div className='bg-[#421F78] rounded-2xl p-3'>
                    <span>
                        Feed to {userData.level === 0 ? 'hatch' : 'grow'}
                    </span>
                    <div className='flex gap-2 justify-center'><img src="/assets/game/pajamas_food.svg" alt="feed" />{userData.feedToNextLevel}</div>
                </div>
                <div className='bg-[#421F78] rounded-2xl p-3'>
                    <span>
                        Income per hour
                    </span>
                    <div className='flex gap-2 justify-center'><img src="/assets/game/tabler_coin-filled.svg" alt="feed" />+{userData.incomePerHour}</div>
                </div>
            </div>

            <div className='text-3xl text-white flex mt-6 justify-between max-w-[325px] mx-auto w-full'>
                <div>
                    <div className='flex items-center gap-4'><img src="assets/game/pajamas_food.svg" alt="feed" width='50' />{userData.foodLeft}</div>
                </div>
                <div>
                    <div className='flex items-center gap-4'><img src="/assets/game/tabler_coin-filled.svg" alt="feed" width='50' />{userData.totalIncome}</div>
                </div>
            </div>
        </div>
    )
}

export default Header