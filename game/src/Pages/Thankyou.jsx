import React from "react";

function Thankyou() {
  return (
    <div className="bg-gradient h-screen">
      <div className="flex flex-col h-screen relative">
        <img
          src="assets/creature 1.png"
          alt="creature"
          className="absolute top-14"
        />
        <img
          src="assets/creature 2.png"
          alt="creature"
          className="absolute top-56"
        />
        <img
          src="assets/creature 3.png"
          alt="creature"
          className="absolute right-0"
        />
        <img
          src="assets/creature 4.png"
          alt="creature"
          className="absolute right-0 top-60"
        />

        <div className="flex flex-col items-center text-center gap-5 flex-[0.8] justify-center z-10">
          <img src="assets/monpark logo.svg" alt="monpark" />
          <h1 className="text-white font-bold text-2xl">MonPark</h1>
          <div>
            <h1 className="text-white font-bold text-2xl">Thank you</h1>
            <h1 className="text-white font-bold text-xl">
              You have been added to the waitlist!
            </h1>
          </div>
        </div>

        <div className="flex flex-col text-white items-center mb-4">
          <span>Coming on Monad Blockchain</span>
          <span>Stay tuned</span>
        </div>
        <div className="flex gap-4 justify-center">
          <a
            href="https:/x.com/MonPark_bot?t=S20KhU3Nc3Y4NHY-XHL8rg&s=09"
            target="_blank"
            rel="noreferrer"
          >
            <img src="assets/twitter logo.svg" alt="twitter" />
          </a>
          <a href="https://t.me/monpark" target="_blank" rel="noreferrer">
            <img src="assets/telegram logo.svg" alt="telegram" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Thankyou;
