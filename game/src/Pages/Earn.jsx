import React from 'react'

function Earn() {
    return (
        <div className='text-white h-full flex flex-col items-center w-full'>
            <div className='max-w-[325px] w-full my-3'>

                <h2 className='text-2xl text-center mb-3'>Earn More!</h2>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-3'>
                        <span>Daily Coin</span>
                        <div className='bg-[#321B55] rounded-lg px-2 py-2'>
                            <img src="#" alt="" />
                            <span>Daily Reward</span>
                            <div className='flex gap-1 items-center'>
                                <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="20px" />
                                <span>+15</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-3'>
                        <span>Social Tasks</span>
                        <div className='flex flex-col gap-2'>
                            <div className='flex bg-[#321B55] rounded-lg px-2 py-2 gap-2 items-center'>
                                <img src="/assets/twitter logo.svg" alt="twitter" width='30px' />
                                <div className='flex-col'>
                                    <span>Follow our X</span>
                                    <div className='flex gap-1 items-center'>
                                        <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="20px" />

                                        <span>+15</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className='bg-[#321B55] rounded-lg px-2 py-2 flex gap-2'>
                                    <img src="/assets/telegram logo.svg" alt="telegram" width='30px' />
                                    <div className='flex-col'>

                                        <span>Join Telegram channel</span>
                                        <div className='flex gap-1 items-center'>
                                            <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="20px" />

                                            <span>+15</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className='bg-[#321B55] rounded-lg px-2 py-2 flex gap-2'>
                                    <img src="#" alt="" />
                                    <div className='flex-col'>

                                        <span>Tweet about us</span>
                                        <div className='flex gap-1 items-center'>
                                            <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="20px" />

                                            <span>+15</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className='bg-[#321B55] rounded-lg px-2 py-2 flex gap-2'>
                                    <img src="#" alt="" />
                                    <div className='flex-col'>

                                        <span>Invite 2 friends</span>
                                        <div className='flex gap-1 items-center'>
                                            <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="20px" />

                                            <span>+15</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Earn