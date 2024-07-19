import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <nav className='flex justify-between max-w-[325px] mx-auto items-center w-full p-2 sticky bottom-0 z-10 bg-ft-gradient'>
            <Link to="/house" className='text-white flex flex-col items-center cursor-pointer'>
                <img src="/assets/game/house.svg" alt="house" />
                <span>House</span>
            </Link>
            <Link to="/shop/product" className='text-white flex flex-col items-center cursor-pointer'>
                <img src="/assets/game/shop.svg" alt="shop" />
                <span>Shop</span>
            </Link>
            <Link to="/earn" className='text-white flex flex-col items-center cursor-pointer'>
                <img src="/assets/game/earn-coin.svg" alt="earn-coin" />
                <span>Earn</span>
            </Link>
            <Link to="/friends" className='text-white flex flex-col items-center cursor-pointer'>
                <img src="/assets/game/friends.svg" alt="friends" />
                <span>Friends</span>
            </Link>
        </nav>
    )
}

export default Footer