import React, { useEffect, useRef, useState } from 'react'
import useUserData from '../Hooks/useUserData';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
function House({ server, refMsg }) {

    const { userData, setUserData, initLoad, setInitLoad } = useUserData()
    const [incomeModal, setIncomeModal] = useState(false)
    const [income, setIncome] = useState(0)
    const [upgrading, setUpgrading] = useState(false)
    const [poop, setPoop] = useState(0)
    const userDataRef = useRef({})

    useEffect(() => {
        userDataRef.current = userData;
    }, [userData]);

    useEffect(() => {
        if (refMsg.length !== 0) {
            toast.info(refMsg, {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                theme: "dark",
            })
        }
    }, [refMsg])

    // Update local data
    const handleDataChange = () => {
        const currentUserData = userDataRef.current
        if (currentUserData.foodLeft > 0 && currentUserData.foodPerTap <= currentUserData.foodLeft) {
            setUserData(prev => ({
                ...prev, foodEaten: prev.foodEaten + prev.foodPerTap, foodLeft: prev.foodLeft - prev.foodPerTap
            }))

            // when value becomes 0, update the db

        } else {
            toast.error('Please buy food', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                theme: "dark",
            })
        }
    };

    const notify = (content) => {
        toast.success('Your pet is now! ' + content + ' old', {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            theme: "dark",
        });

    }
    const handleIncome = async () => {
        await fetch(server + '/income', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userData })
        }).then(res => res.json()).then(data => {
            if (data.incomeGenerated > 0) {
                console.log(data)
                setIncomeModal(true)
                setIncome(data.incomeGenerated)
                setPoop(data.totalTestPoop)
                if (data.level) {
                    setUserData({
                        ...userData,
                        level: data.level
                    })

                    toast.info('Age Decreased! - ' + data.level, {
                        position: "top-right",
                        autoClose: 5000,
                        closeOnClick: true,
                        theme: "dark",
                    })
                }
            }
        })
    }

    useEffect(() => {
        console.log('loaddata ', initLoad)
        if (initLoad) {
            console.log('income working!')
            handleIncome()
            setInitLoad(false)
        }
        //eslint-disable-next-line
    }, [initLoad])

    useEffect(() => {
        if (userData.foodEaten !== undefined && userData.feedToNextLevel !== undefined && userData.foodEaten >= userData.feedToNextLevel && upgrading === false) {
            setUpgrading(true)
            fetch(server + '/upgradeLevel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            }).then(res => res.json()).then((data) => {
                console.log(data)
                setUpgrading(false)
                setUserData(data.mergedData)
                notify(data.mergedData.level)
            })
        }

        //eslint-disable-next-line
    }, [userData.feedToNextLevel, userData.foodEaten])

    const handlePoop = () => {
        toast.info(poop + ' poop claimed! Feed your pet.', {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            theme: "dark",
        })
    }


    useEffect(() => {
        console.log(poop)
        const egg = document.getElementById('egg')
        const creature = document.getElementById('creature')
        const handleTouch = (e) => {
            egg.classList.add('scale-95')
            console.log("touches", e.touches.length)
            console.log("targets", e.targetTouches.length)
            console.log("changed", e.changedTouches.length)
            if (poop === 0) {

                handleDataChange()
            }
            if (poop > 0) {
                console.log('poop')
                console.log(poop)
                handlePoop()
                setPoop(0)

            }
            console.log('this is data', userData)
        }
        if ((!incomeModal && egg) || (!incomeModal && creature)) {
            console.log('event init')

            egg.addEventListener('touchstart', handleTouch)

            egg.addEventListener('touchend', e => {
                egg.classList.remove('scale-95')

            })

            document.addEventListener('touchstart', e => {
                ;[...e.changedTouches].forEach(touch => {
                    const dot = document.createElement('div')
                    dot.classList.add('bg-red-500')
                    dot.classList.add('w-3')
                    dot.classList.add('h-3')
                    dot.classList.add('absolute')
                    dot.style.top = `${touch.pageY}px`
                    dot.style.left = `${touch.pageX}px`
                    dot.id = touch.identifier

                    document.body.append(dot)
                })
            })

            document.addEventListener('touchend', e => {
                ;[...e.changedTouches].forEach(touch => {
                    const dot = document.getElementById(touch.identifier)
                    dot.remove()
                })
            })

            document.addEventListener('touchcancel', e => {
                ;[...e.changedTouches].forEach(touch => {
                    const dot = document.getElementById(touch.identifier)
                    dot && dot.remove()
                })
            })

        }

        return () => {
            egg?.removeEventListener('touchstart', handleTouch)
        }
        //eslint-disable-next-line
    }, [incomeModal, poop])

    const handleIncomeUpdate = () => {
        setUserData({ ...userData, totalIncome: userData.totalIncome + income })
        setIncomeModal(false)
    }

    return (

        // SHOW ERROR IF THE FEED === 0
        // SHOW ERROR IF MONEY === 0
        // ALSO ASK IF THE SHOP ITEMS WILL BE ACCESSIBLE IF THE LEVEL DECREASE DUE TO POOP CONDITIONS
        // REMOVE DOTS

        <div className={`h-full justify-between flex flex-col ${incomeModal ? 'items-center' : 'items-start'}`}>
            <ToastContainer />
            {!incomeModal &&
                <>
                    <div className='max-w-[325px] mx-auto mt-8 w-full relative'>
                        <div className='text-white flex justify-between mb-1'>
                            <span>{userData.level === 0 ? 'Egg' : userData.level + ' years old'}</span>
                            <span>{userData.level === 0 ? 'Hatch' : '+1'}</span>
                        </div>
                        <div className="relative w-full h-3">
                            <progress
                                className="absolute top-0 left-0 w-full h-full"
                                value={userData.foodEaten}
                                max={userData.feedToNextLevel}
                            />
                            <span className="absolute left-1/2 text-white z-50 text-[12px]" style={{ top: '50%', transform: 'translate(-50%, -50%)' }}>
                                {userData.foodEaten}/{userData.feedToNextLevel}
                            </span>
                        </div>
                    </div>
                    <div className='mx-auto flex justify-center transition-transform duration-200' id="egg">
                        {userData.level === 0 ? <img src="/assets/game/egg.svg" alt="egg" /> :
                            <img src={poop === 0 ? `assets/game/pets/${userData.petAssigned}.svg` : `assets/game/pets/messy/${userData.petAssigned}.1.jpeg`} alt="creature" id="creature" />
                        }
                    </div>

                    <div className='flex max-w-[325px] mx-auto justify-between w-full'>
                        <div className='text-white flex gap-3'>
                            <img src="assets/game/kitchen.svg" alt="bowl" />
                            <Link to="/kitchen">Kitchen</Link>
                        </div>
                    </div>
                </>
            }
            {incomeModal && <div className='fixed max-w-[325px] text-white text-center border-[#492188] border-2 flex flex-col gap-3 items-center py-4 w-full mt-2' onClick={handleIncomeUpdate}>
                <img src='/assets/cross.png' alt="cross" width="25px" className='absolute right-0 cursor-pointer top-0 m-2' />
                <img src="/assets/monpark logo.svg" alt="monpark" width="80px" />
                <div className='flex'>
                    <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="40px" />
                    <h1 className='text-4xl'>{income}</h1>
                </div>
                <div>
                    You are earning money!
                </div>
                <button className='bg-[#492188] py-2 px-4 text-xl cursor- rounded-md w-max hover:bg-[#8d5ae0]' onClick={handleIncomeUpdate}>
                    Thank you, MonPark ♥
                </button>
            </div>}
        </div>
    )
}

export default House