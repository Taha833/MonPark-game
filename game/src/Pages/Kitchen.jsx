import React, { useEffect, useState } from 'react'
import useUserData from '../Hooks/useUserData'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
function Kitchen({ server }) {
    const { userData, setUserData } = useUserData()
    const [foodAmt, setFoodAmt] = useState(1)
    const [foodArr, setFoodArr] = useState([])
    const [foodCost, setFoodCost] = useState(0)
    const [boosterModal, setBoosterModal] = useState(false)
    const [booster, setBooster] = useState(null)

    useEffect(() => {
        fetch(server + '/foodPrice/' + userData.tgId).then(res => res.json()).then(data => {
            setFoodArr(data.foodPrice)
            console.log(data)
        })
        //eslint-disable-next-line
    }, [userData])



    const calcFoodCost = (foodUserWant) => {
        const basePrice = 5
        const userAge = userData.level
        const userTotalIncome = userData.totalIncome
        const price = Math.floor(foodUserWant * (basePrice) * (1 + 0.05 * userAge) * (1 + 0.01 * Math.log10(userTotalIncome)))
        return price
    }

    useEffect(() => {
        setFoodCost(calcFoodCost(foodAmt))
        //eslint-disable-next-line
    }, [foodAmt])

    const handleBuyFood = (amt) => {
        amt = typeof amt === 'number' ? amt : foodAmt
        console.log(amt)

        fetch(server + '/buyFood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ food: amt, tgId: userData.tgId })
        }).then(res => res.json()).then(data => {
            console.log(data)
            if (data.message.includes('success')) {
                toast.success(data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    theme: "dark",
                })
                setUserData(data.userData)
            } else {
                toast.error(data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    theme: "dark",
                })
            }
        })
    }

    const handleBoosterSelect = async (boosterItem) => {

        if (boosterItem === 'foodpertap') {
            setBoosterModal(true)
            await fetch(server + '/feedpertap/' + userData.tgId)
                .then(res => res.json()).then(data => setBooster(data))

        }
    }

    const handleBooster = async () => {
        await fetch(server + '/upgrade/feedpertap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tgId: userData.tgId })
        }).then(res => {
            if (res.ok) {
                return res.json()

            } else {
                toast.error('error occured', {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    theme: "dark",
                })
            }
        }).then(data => {
            if(data.userData){
                setBoosterModal(false)
                setBooster(null)
                setUserData(data.userData)
            } else {
                toast.error(data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    theme: "dark",
                })
            }
        })
    }

    return (
        <div className='max-w-[325px] mx-auto w-full h-full'>
            <ToastContainer />
            {!boosterModal &&
                <>
                    <h1 className='text-white mt-2'>Kitchen</h1>
                    <div className='text-white flex justify-between mt-2 gap-2'>
                        {foodArr.map((item, index) => (

                            <div className='bg-[#321B55] rounded-xl w-full' onClick={() => setFoodAmt(Number(Object.keys(item)[0]))}>
                                <div className='text-center text-xl p-4'>{Object.keys(item)[0]}</div>
                                <div className='text-white flex border-t p-2 justify-center'>
                                    <div className='flex gap-1'>
                                        <img src="/assets/game/coin-light.svg" alt="coin" />
                                        <span>{item[Object.keys(item)[0]]}</span>
                                    </div>
                                </div>


                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col mt-3 gap-2 max-w-[325px]'>
                        <div className='flex flex-col w-full gap-2 text-white'>
                            <div className='flex flex-col'>
                                <label for="food">Food</label>
                                <input type='number' min="1" placeholder='enter food amount' className='rounded-md p-2 bg-[#50347A] text-white flex-1' id="food" value={foodAmt} onChange={(e) => {
                                    if (Number(e.target.value) < 0) {
                                        setFoodAmt(1);
                                    } else {
                                        setFoodAmt(Number(e.target.value))

                                    }

                                }} />
                            </div>
                            <div className='flex flex-col'>
                                <label for="cost">Cost</label>
                                <input type='number' min="1" placeholder='Cost' className='rounded-md p-2 bg-[#50347A] text-white flex-1' value={foodCost} id="cost" readOnly />
                            </div>
                        </div>
                        <button className='text-white bg-[#492188] py-2 px-4 text-xl cursor- rounded-md w-full hover:bg-[#8d5ae0]' onClick={handleBuyFood} >
                            Buy food
                        </button>
                    </div>
                    <div className='mt-5'>
                        <h1 className='text-white mt-2'>Boosters</h1>
                        <div className='flex text-white mt-3 gap-2 bg-[#321B55] rounded-lg p-2' onClick={() => {
                            handleBoosterSelect('foodpertap')
                        }}>
                            <img src="/assets/game/product.svg" alt="booster" width="40px" />
                            <div className='flex flex-col'>
                                <span>feedtap</span>
                                <div className='flex gap-2'>
                                    <img src="/assets/game/pajamas_food.svg" alt="food" />
                                    <span>+{userData.foodPerTap} ,</span>
                                    <span className='text-gray-300'>lvl {userData.foodPerTap - 1}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            }
            {boosterModal && <div className='fixed max-w-[325px] w-full text-white text-center border-[#492188] border-2 flex flex-col gap-2 items-center py-4 mx-auto mt-2' onClick={() => setBoosterModal(false)}>
                <img src='/assets/cross.png' alt="cross" width="25px" className='absolute right-0 cursor-pointer top-0 m-2' />
                <img src="/assets/monpark logo.svg" alt="monpark" width="80px" />
                <h1 className='text-3xl text-white'>FeedTap</h1>
                <div>
                    +1 feed per tap
                </div>
                <div className='flex gap-2 items-center'>
                    <div className='flex items-center'>
                        <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="25px" />
                        <h1 className='text-xl'>{booster?.cost}</h1>
                    </div>
                    <h1 className='text-xl text-gray-400'>&#9679; lvl {userData.foodPerTap}</h1>
                </div>
                <button className='bg-[#492188] py-2 px-4 text-xl cursor- rounded-md w-max hover:bg-[#8d5ae0]' onClick={handleBooster}>
                    Buy Booster
                </button>
            </div>}
        </div>
    )
}

export default Kitchen