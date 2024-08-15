import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HouseSvg } from '../SVG/HouseSvg';
import { ShopSvg } from '../SVG/ShopSvg';
import { EarnSvg } from '../SVG/EarnSvg';
import { FriendsSvg } from '../SVG/FriendsSvg';

function Footer() {
    const location = useLocation()
    const getColor = (path) => location.pathname.includes(path) ? '#9654FF' : '#888888';

    return (
        <nav className='flex justify-between max-w-[325px] mx-auto items-center w-full p-2 sticky bottom-0 z-10 bg-ft-gradient'>
            <Link to="/house" className='text-white flex flex-col items-center cursor-pointer'>
                <HouseSvg color={getColor('/house')} />
                <span>House</span>
            </Link>
            <Link to="/shop/product" className='text-white flex flex-col items-center cursor-pointer'>
                <ShopSvg color={getColor('/shop')} />
                <span>Shop</span>
            </Link>
            <Link to="/earn" className='text-white flex flex-col items-center cursor-pointer'>
                <EarnSvg color={getColor('/earn')} />
                <span>Earn</span>
            </Link>
            <Link to="/friends" className='text-white flex flex-col items-center cursor-pointer'>
                <FriendsSvg color={getColor('/friends')} />
                <span>Friends</span>
            </Link>
        </nav>
    )
}

export default Footer