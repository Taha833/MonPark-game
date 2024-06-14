import React, { useEffect, useState } from 'react'

function House({ progress }) {

    progress = 20
    const progressValue = Math.min(Math.max(progress, 0), 100);

    const [data, setData] = useState({ val: 0 });

    // Update local data
    const handleDataChange = () => {
        setData({ val: 100 });

    };

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ''; // Required for Chrome
            console.log('reload')
            console.log(data)
            // Send data to the service worker
            if (navigator.serviceWorker) {
                navigator.serviceWorker.controller.postMessage(data);
                console.log('nav')
            }
        };





        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [data]);




    useEffect(() => {
        const egg = document.getElementById('egg')

        egg.addEventListener('touchstart', e => {
            console.log("touches", e.touches.length)
            console.log("targets", e.targetTouches.length)
            console.log("changed", e.changedTouches.length)
            handleDataChange()
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
            // console.log(e)
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

    }, [])
    return (
        <div className='h-full justify-between flex flex-col items-start'>
            <div className='max-w-[325px] mx-auto mt-8 w-full'>
                <div className='text-white flex justify-between'>
                    <span>Egg</span>
                    <span>Hatch</span>
                </div>
                <progress
                    className=" w-full h-2"
                    value={progressValue}
                    max="100"

                />
            </div>

            <div className='mx-auto flex justify-center' id="egg">
                <img src="assets/game/egg.svg" alt="egg" />
            </div>

            <div className='flex max-w-[325px] mx-auto justify-between w-full'>
                <div className='text-white flex gap-3'>
                    <img src="assets/game/tabler_bowl-spoon.svg" alt="bowl" />
                    <span>124 / 500</span>
                </div>
                <div className='text-white flex gap-3'>
                    <img src="assets/game/kitchen.svg" alt="kitchen" />
                    <span>Kitchen</span>
                </div>
            </div>
        </div>
    )
}

export default House