import { Routes, Route } from 'react-router-dom'
import Waitlist from './Pages/Waitlist';
import Thankyou from './Pages/Thankyou';
import Header from './Components/Header';
import Footer from './Components/Footer';
import House from './Pages/House';
import { useEffect, useRef, useState } from 'react';
import Start from './Pages/Start';
import useUserData from './Hooks/useUserData';
import deepEqual from 'deep-equal';
import Shop from './Pages/Shop';
import Kitchen from './Pages/Kitchen';
import Friends from './Pages/Friends';
import Earn from './Pages/Earn';
import useImg from './Hooks/useImg';


const tg = window.Telegram.WebApp

// change development to production

function App() {

  // const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SERVER : 'http://localhost:8000'
  const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SERVER : 'http://localhost:8000'

  console.log(process.env.NODE_ENV)

  const { userData, setInitLoad, setUserData, setIsRefUser } = useUserData()
  const userDataRef = useRef(userData)
  const hasBackgroundEventTriggeredRef = useRef(false);
  const [refMsg, setRefMsg] = useState('')
  const { getImgUrl } = useImg()

  useEffect(() => {
    console.log('app load')
    // window.addEventListener('load', () => {
    //   console.log('event load in app')
    //   setInitLoad(true)
    // })

    // if(document.readyState === "complete"){
    //   console.log('ready state')
    //   setInitLoad(true)

    // }

    setInitLoad(true)

    // return () => {
    //   window.removeEventListener('load', () => {
    //     setInitLoad(false)
    //   })
    // }
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    userDataRef.current = userData
    console.log('userData ', userData)
  }, [userData])

  // Telegram Events setup 👇

  useEffect(() => {
    console.log('Touch Points:', navigator.maxTouchPoints);
    console.log('User Agent:', navigator.userAgent);
    console.log('Vibrate support:', 'vibrate' in navigator);
  }, []);



  useEffect(() => {
    tg.onEvent('close', (e) => {
      navigator.serviceWorker.controller.postMessage({ data: userDataRef.current });

    })

    const handleViewportChange = (e) => {
      if (!e.isStateStable && hasBackgroundEventTriggeredRef.current === false && userDataRef !== userData && userDataRef !== undefined) {
        const userDataLS = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {}

        const isEqual = deepEqual(userDataLS, userDataRef.current);
        if (!isEqual) {

          navigator.serviceWorker.controller.postMessage({ type: 'background', data: userDataRef.current });
          localStorage.setItem('userData', JSON.stringify(userDataRef.current));
        }
        console.log('User is in the background');
        // tg.offEvent('viewportChanged', handleViewportChange);
        // hasBackgroundEventTriggeredRef.current = true;
      } else if (e.isStateStable) {
        console.log('User is in the foreground');
        // hasBackgroundEventTriggeredRef.current = false;
      }
    }

    tg.onEvent('viewportChanged', handleViewportChange);

    const backBtnHandle = () => {
      console.log('Back button clicked');
      navigator.serviceWorker.controller.postMessage({ type: 'back', data: userDataRef.current });
      tg.close();
    }

    tg.onEvent('backButtonClicked', backBtnHandle);

    // Enable the back button
    tg.BackButton.show();

    tg.ready();




    const handleBeforeUnload = (event, type) => {
      // event.preventDefault();
      // event.returnValue = ''; // Required for Chrome
      if (window.location.pathname !== "/waitlist") {
        if (navigator && navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type, data: userDataRef.current });
        } else {
          console.log('sw not registered yet')
          console.log(navigator.serviceWorker)
        }

      }

    };

    document.addEventListener('visibilitychange', e => {
      if (document.visibilityState === "hidden") {
        handleBeforeUnload(e, 'visibility')
      } else {
        handleBeforeUnload(e, 'still active')

      }
    })
    window.addEventListener('beforeunload', e => handleBeforeUnload(e, 'beforeunload'));

    return () => {
      tg.offEvent('close', (e) => {
        navigator.serviceWorker.controller.postMessage({ data: userDataRef.current });

      })

      tg.offEvent('viewportChanged', handleViewportChange);

      tg.offEvent('backButtonClicked', backBtnHandle)

      document.removeEventListener('beforeunload', e => handleBeforeUnload(e, 'beforeunload'))

      document.removeEventListener('visibilitychange', e => {
        if (document.visibilityState === "hidden") {
          handleBeforeUnload(e, 'visibility')
        } else {
          handleBeforeUnload(e, 'still active')

        }
      })
    };
    //eslint-disable-next-line
  }, []);


  useEffect(() => {
    console.log(window.location.pathname)
    if (window.location.pathname !== '/waitlist') {

      const startParam = tg.initDataUnsafe.start_param
      const tgId = tg.initDataUnsafe.user.id
      if (startParam) {
        const refUserId = startParam.split('_')[1]
        console.log(refUserId)

        const getData = async () => {
          await fetch(server + '/ref', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refUserId: refUserId, tgId })
          }).then(res => res.json()).then(data => {

            setRefMsg(data.message)
            setIsRefUser(true)
            setUserData(data.userData)
            const petAssigned = data.userData.petAssigned
            if (petAssigned !== "") {
              getImgUrl(`${petAssigned}.png`)
            }

          }).catch(err => console.log(err))
        }
        getData()
      } else {
        setIsRefUser(false)
      }
    }

    //eslint-disable-next-line
  }, [])

  console.log(tg.initDataUnsafe.user.id)

  return (
    <>
      <div className='bg-gradient max-h-screen h-screen overflow-x-auto'>
        <div className='flex flex-col h-full'>
          {!['/', '/friends', '/thankyou', '/waitlist'].some(route => route === window.location.pathname) &&
            !/^\/ref\/[^/]+$/.test(window.location.pathname) && [5941578108, 347557266, 1657939157, 7089063746, 7256386391].some(id => tg.initDataUnsafe.user.id === id) &&
            <Header />}

          <Routes>
            <Route path="/waitlist" element={<Waitlist />} exact />
            {[5941578108, 347557266, 1657939157, 7089063746, 7256386391].some(id => tg.initDataUnsafe.user.id === id) ?
              <>

                <Route path="/" element={<Start />} />
                <Route path="/ref/:refUserId" element={<Start />} />
                <Route path="/thankyou" element={<Thankyou />} exact />
                <Route path="/house" element={<House server={server} refMsg={refMsg} setRefMsg={setRefMsg} />} exact />
                <Route path="/shop/:section" element={<Shop server={server} />} />
                <Route path="/kitchen" element={<Kitchen server={server} />} />
                <Route path="/friends" element={<Friends server={server} />} />
                <Route path="/earn" element={<Earn />} />
              </>
              :
              <Route path="/" element={
                <div className='flex justify-center items-center h-full'>
                  <h1 className='text-white text-xl font-bold'>MonPark coming soon!</h1>
                </div>}
              />
            }
          </Routes>
          {!['/', '/waitlist'].some(route => route === window.location.pathname) &&
            !/^\/ref\/[^/]+$/.test(window.location.pathname) && [5941578108, 347557266, 1657939157, 7089063746, 7256386391].some(id => tg.initDataUnsafe.user.id === id) &&
            <Footer />}
        </div>
      </div>

    </>
  );
}

export default App;
