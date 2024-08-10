import React from 'react'


function ShopItems({ item, setSelectedItem, setSelected, userData }) {

    const lock = userData.level < item.unlockAge ? true : false
    return (
        <div className="relative bg-[#321B55] rounded-xl text-gray-400 flex flex-col gap-2 cursor-pointer max-w-[150px]" onClick={() => {
            if (!lock) {
                setSelectedItem(item)
                setSelected(true)
            }

        }}>
            <div className="flex gap-4 items-start p-2 flex-1">
                <img src={item.photoURL || '/assets/game/product.svg'} alt="TPS" width="40px" />
                <div>
                    <h3 className="text-white text-[14px]">{item.name}</h3>
                    <span className="text-[12px]">profit per hour</span>
                    <div className="flex gap-1 text-[12px]">
                        <img src="/assets/game/coin-light.svg" alt="coin" width="12px" />
                        <span>{item.upgCost === undefined ? item.baseRev : item.upgIncome}</span>
                    </div>
                </div>
            </div>
            <div className="text-white flex border-t p-2 justify-between">
                <span>lvl {item.currLevel || 0}</span>
                <div className="flex gap-1">
                    <img src="/assets/game/coin-light.svg" alt="coin" />
                    <span>{item.upgCost === undefined ? item.baseCost : item.upgCost}</span>
                </div>
            </div>
            {/* Overlay for locked effect */}
            {lock && <div className="absolute inset-0 bg-[#321B55] bg-opacity-90 flex flex-col items-center justify-center rounded-xl">
                <img src="/assets/game/lock.png" alt="Locked" width="25px" className="mb-2" />
                <p className="text-white text-lg">{item.unlockAge} years old</p>
            </div>}
        </div>
    )
}

export default ShopItems