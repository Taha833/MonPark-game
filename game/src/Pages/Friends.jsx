import React, { useEffect, useRef, useState } from 'react'
import useUserData from '../Hooks/useUserData'
import ClipboardJS from 'clipboard';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// const tg = window.Telegram.WebApp


function Friends({ server }) {
    const copyButtonRef = useRef(null);
    const { userData } = useUserData()
    const [inviteLink, setInviteLink] = useState('')

    useEffect(() => {
        const clipboard = new ClipboardJS(copyButtonRef.current);



        clipboard.on('success', function (e) {
            toast.info('Link copied!', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                theme: "dark",
            })
        });

        clipboard.on('error', function (e) {
            toast.error('Failed to copy link!', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                theme: "dark",
            })
        });

        return () => {
            clipboard.destroy();
        };
    }, []);


    const getInviteLink = async () => {
        if (inviteLink === '') {
            await fetch(server + '/generate-invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tgId: userData.tgId })
            }).then(res => res.json()).then(data => {
                const { inviteLink } = data
                setInviteLink(inviteLink);
                copyToClipboard(inviteLink)
            })

        } else {
            copyButtonRef.current.click();
        }
    }

    const copyToClipboard = (text) => {
        if (copyButtonRef.current) {
            copyButtonRef.current.setAttribute('data-clipboard-text', text);
            copyButtonRef.current.click();
        }
    };

    return (
        <div className='h-full flex flex-col items-center'>
            <ToastContainer />
            <h1 className='text-white text-4xl font-medium text-center pt-5'>Invite Friends!</h1>
            <div className='flex-1 max-w-[325px] w-full flex flex-col justify-center'>

                <div className='flex text-lg text-white mt-3 gap-2 bg-[#321B55] rounded-lg px-2 py-4 justify-between' >
                    <span>Total friends invited</span>
                    <span>0</span>
                </div>
                <button className='flex text-lg text-white mt-3 gap-2 bg-[#321B55] rounded-lg px-2 py-4 justify-between items-center' onClick={getInviteLink} >
                    <div className='flex flex-col max-w-[250px] text-left'>
                        <span>Copy your Ref Link</span>
                        <span className='text-gray-300 text-base text-ellipsis overflow-hidden whitespace-nowrap w-full'>{inviteLink}</span>
                    </div>
                    <span>Copy</span>
                </button>
                <button
                    ref={copyButtonRef}
                    style={{ display: 'none' }} // Hide the button as it only needs to trigger the copy
                >
                    Copy Text
                </button>
                <p className='text-white text-center mt-4'>
                    Referal gives your friend 100 coins and 60 to you.
                </p>

            </div>
        </div>
    )
}

export default Friends