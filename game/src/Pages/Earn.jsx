import React, { useEffect, useState } from 'react'
import useUserData from '../Hooks/useUserData'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import {Link} from 'react-router-dom'

function Earn({ server }) {
    const { userData, setUserData } = useUserData()
    const [twitterFollow, setTwitterFollow] = useState(null)
    const [telegramFollow, setTelegramFollow] = useState(null)
    const [tweetTask, setTweetTask] = useState(null)
    const [friendsTask, setFriendsTask] = useState(null)

    useEffect(() => {
        if(userData?.friendsTask) {
            setFriendsTask(userData.friendsTask)
        } else {
            setFriendsTask(false)
        }
    }, [userData.friendsTask])

    useEffect(() => {
        if (userData?.twtFollow) {
            setTwitterFollow(userData.twtFollow)
        } else {
            setTwitterFollow(false)
        }


    }, [userData.twtFollow])

    useEffect(() => {
        console.log(userData.tgFollow)
        if (userData?.tgFollow) {
            setTelegramFollow(userData.tgFollow)
        } else {
            setTelegramFollow(false)
        }
    }, [userData.tgFollow])

    useEffect(() => {
        console.log(twitterFollow)
    }, [twitterFollow])


    const socialConfig = {
        twitter: {
            socialKey: 'twtFollow',
            socialState: twitterFollow,
            setSocialState: setTwitterFollow
        },
        telegram: {
            socialKey: 'tgFollow',
            socialState: telegramFollow,
            setSocialState: setTelegramFollow
        },
        tweetTask: {
            socialKey: 'twtTask',
            socialState: tweetTask,
            setSocialState: setTweetTask
        }
    }


    const handleSocialTask = (social) => {

        const { socialKey, socialState, setSocialState } = socialConfig[social]

        if (socialState === false || !userData[socialKey]) {
            fetch(`${server}/follow/${social}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tgId: userData.tgId })
            }).then(res => res.json())
                .then(data => {
                    setUserData(prev => ({
                        ...prev,
                        [socialKey]: data[socialKey],
                        totalIncome: data.totalIncome
                    }))
                    setSocialState(true)
                    toast.success('You got 15 coins!', {
                        position: "top-right",
                        autoClose: 5000,
                        closeOnClick: true,
                        theme: "dark",
                    })
                })
        }
    }

    const handleFriendsReward = async () => {
        if(userData['friends'].length < 2) {
            toast.error('Invalid', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                theme: "dark",
            })

            return;
        }

        if(friendsTask === false || userData['friendsTask']){
           const response = await fetch(`${server}/earn/friends`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tgId: userData.tgId })
            })
            const data = await response.json()
            if(response.ok){
                console.log(data)
                setUserData(prev => ({
                    ...prev,
                    friendsTask: data.friendsTask,
                    totalIncome:data.totalIncome
                }))
                setFriendsTask(true)
                toast.success('You got 15 coins!', {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    theme: "dark",
                })
            } else {
                console.log(data.error)
                toast.error(data.error, {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    theme: "dark",
                })
            }
        }
    }


    return (
        <div className='text-white h-full flex flex-col items-center w-full'>
            <ToastContainer />
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
                            <div className='flex bg-[#321B55] rounded-lg px-2 py-2 gap-2 items-center justify-between' >
                                <div className='flex gap-2 w-full' onClick={() => {
                                    window.Telegram.WebApp.openLink('https://twitter.com/intent/follow?screen_name=MonPark_bot')
                                }}>
                                    <img src="/assets/twitter logo.svg" alt="twitter" width='30px' />
                                    <div className='flex-col'>
                                        <span>Follow our X</span>
                                        <div className='flex gap-1 items-center'>
                                            <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="20px" />

                                            <span>+15</span>
                                        </div>
                                    </div>
                                </div>
                                {twitterFollow === false || !userData.twtFollow ? <div onClick={() => handleSocialTask('twitter')}>Check</div> : '✅'}
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className='bg-[#321B55] rounded-lg px-2 py-2 flex gap-2 items-center justify-between'>
                                    <div className='flex gap-2 w-full' onClick={() => {
                                        window.Telegram.WebApp.openLink('https://t.me/monpark')
                                    }}>
                                        <img src="/assets/telegram logo.svg" alt="telegram" width='30px' />
                                        <div className='flex-col'>

                                            <span >Join Telegram channel</span>
                                            <div className='flex gap-1 items-center'>
                                                <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="20px" />

                                                <span>+15</span>
                                            </div>
                                        </div>
                                    </div>
                                    {telegramFollow === false || !userData.tgFollow ? <div onClick={() => handleSocialTask('telegram')}>Check</div> : '✅'}


                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className='bg-[#321B55] rounded-lg px-2 py-2 flex gap-2 items-center justify-between'>
                                    <div className='flex gap-2 w-full' onClick={() => {

                                        window.Telegram.WebApp.openLink('https://twitter.com/intent/tweet?text=Your%20message%20here')
                                    }}>
                                        <img src="#" alt="" />
                                        <div className='flex-col'>

                                            <span>Tweet about us</span>
                                            <div className='flex gap-1 items-center'>
                                                <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="20px" />

                                                <span>+15</span>
                                            </div>
                                        </div>
                                    </div>
                                    {tweetTask === false || !userData.twtTask ? <div onClick={() => handleSocialTask('tweetTask')}>Check</div> : '✅'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className='bg-[#321B55] rounded-lg px-2 py-2 flex gap-2 items-center justify-between'>
                                    <Link className='flex gap-2 w-full' to="/friends">
                                        <img src="#" alt="" />
                                        <div className='flex-col'>

                                            <span>Invite 2 friends</span>
                                            <div className='flex gap-1 items-center'>
                                                <img src="/assets/game/tabler_coin-filled.svg" alt="coin" width="20px" />

                                                <span>+15</span>
                                            </div>
                                        </div>
                                    </Link>
                                    {friendsTask === false || !userData.friendsTask ? <div onClick={handleFriendsReward}>Check</div> : '✅'}

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