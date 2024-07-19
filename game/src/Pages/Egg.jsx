import React from 'react'

function Egg() {
    return (
        <div className='bg-gradient'>
            <div className='h-screen relative flex flex-col justify-center'>
                <div className="flex flex-col items-center text-center gap-5 h-fit py-20 z-10 ">
                    <h1 className="text-white font-bold text-2xl">You got an Egg</h1>
                </div>
                <div className='mx-auto flex justify-center h-full' id="egg ">
                    <img src="assets/game/egg.svg" alt="egg" />
                </div>
                <div className='py-10'>
                    <div className='flex flex-col text-white items-center'>
                        <span>Coming on Monad Blockchain</span>
                        <span>Stay tuned</span>
                    </div>
                    <div className='flex gap-4 justify-center'>
                        <a href="https://x.com/MonPark_bot?t=S20KhU3Nc3Y4NHY-XHL8rg&s=09" target='_blank' rel="noreferrer">

                            <img src='assets/twitter logo.svg' alt="twitter" />
                        </a>
                        <a href='https://t.me/monpark' target='_blank' rel="noreferrer">

                            <img src='assets/telegram logo.svg' alt="telegram" />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Egg