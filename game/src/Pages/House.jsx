import React, { useEffect, useRef, useState } from 'react'

function House({ progress }) {

    progress = 20
    const progressValue = Math.min(Math.max(progress, 0), 100);

    const [data, setData] = useState(0);
    const dataRef = useRef(0)
    // Update local data
    const handleDataChange = () => {
        dataRef.current = dataRef.current + 1

    };

    useEffect(() => {
        const handleBeforeUnload = (event, type) => {
            event.preventDefault();
            event.returnValue = ''; // Required for Chrome
            const txt = document.createElement('div')
            txt.innerText = 'Service Worker'
            console.log('reload')
            // Send data to the service worker
            if (navigator.serviceWorker) {
                navigator.serviceWorker.controller.postMessage({ type, data: dataRef.current });
                console.log('nav')
            }
        };

        fetch('https://monpark-game-production.up.railway.app/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data
            }),
        });


        document.addEventListener('visibilitychange', e => {
            if (document.visibilityState === "hidden") {
                handleBeforeUnload(e, 'visibility')
            } else {
                handleBeforeUnload(e, 'still active')

            }
        })


        window.addEventListener('beforeunload', e => handleBeforeUnload(e, 'beforeunload'));

        window.addEventListener('pagehide', e => handleBeforeUnload(e, 'pagehide'))
        window.addEventListener('unload', e => handleBeforeUnload(e, 'unload'))

        return () => {
            window.removeEventListener('beforeunload', e => handleBeforeUnload(e, 'visibility'));
            document.removeEventListener('visibilitychange', e => handleBeforeUnload(e, 'beforeunload'))
            window.removeEventListener('pagehide', e => handleBeforeUnload(e, 'pagehide'))
            window.removeEventListener('unload', e => handleBeforeUnload(e, 'unload'))
        };
    }, [data]);


    useEffect(() => {
        console.log(dataRef.current)
    }, [])

    useEffect(() => {
        const egg = document.getElementById('egg')

        egg.addEventListener('touchstart', e => {
            console.log("touches", e.touches.length)
            console.log("targets", e.targetTouches.length)
            console.log("changed", e.changedTouches.length)
            handleDataChange()
            setData(prev => prev + 1)
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
                    <span>{dataRef.current} / 500</span>
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