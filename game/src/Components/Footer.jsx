import React from 'react'

function Footer() {
    return (
        <nav className='flex justify-between max-w-[325px] mx-auto items-center w-full mt-auto p-2'>
            <div className='text-white flex flex-col items-center cursor-pointer'>
                <img src="assets/game/house.svg" alt="house" />
                <span>House</span>
            </div>
            <div className='text-white flex flex-col items-center cursor-pointer'>
                <img src="assets/game/shop.svg" alt="shop" />
                <span>Shop</span>
            </div>
            <div className='text-white flex flex-col items-center cursor-pointer'>
                <img src="assets/game/earn-coin.svg" alt="earn-coin" />
                <span>Earn</span>
            </div>
            <div className='text-white flex flex-col items-center cursor-pointer'>
                <img src="assets/game/friends.svg" alt="friends" />
                <span>Friends</span>
            </div>
        </nav>
    )
}

export default Footer