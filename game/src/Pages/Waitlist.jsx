import React from 'react'

function Waitlist() {
  return (
    <div className='bg-gradient'>
      <div className="flex flex-col h-screen relative">
        <img src='assets/creature 1.png' alt="creature" className='absolute top-14'/>
        <img src='assets/creature 2.png' alt="creature" className='absolute top-56'/>
        <img src='assets/creature 3.png' alt="creature" className='absolute right-0'/>
        <img src='assets/creature 4.png' alt="creature" className='absolute right-0 top-60'/>
      <div className="flex flex-col items-center text-center gap-5 flex-[0.8] justify-center z-10">
        <img src="assets/monpark logo.svg" alt="monpark" />
        <h1 className="text-white font-bold text-2xl">Moo!</h1>
        <h1 className="text-white font-bold text-2xl">Welcom to the MonPark</h1>
      </div>

     
        <div className='flex flex-col gap-8 z-10'>
          <div className="flex flex-col px-5 gap-5">
            <input
              type="email"
              className="text-[rgba(255,255,255, 80)] rounded-lg px-3 py-2 text-base bg-[#150A27] border border-[#282828]"
              placeholder="Enter your email"
              required
            />
            <button className="bg-white text-black px-3 py-2 rounded-lg border">
              Join the waitlist
            </button>
          </div>
          <div className='flex flex-col text-white items-center'>
            <span>Coming on Monad Blockchain</span>
            <span>Stay tuned</span>
          </div>
          <div className='flex gap-4 justify-center'>
            <img src='assets/twitter logo.svg' alt="twitter" />
            <img src='assets/telegram logo.svg' alt="telegram" />
          </div>
        </div>
    </div>
    </div>
  );
}

export default Waitlist