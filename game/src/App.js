import { Routes, Route } from 'react-router-dom'
import Waitlist from './Pages/Waitlist';
import Thankyou from './Pages/Thankyou';
import Header from './Components/Header';
import Footer from './Components/Footer';
import House from './Pages/House';
import { useEffect, useRef } from 'react';
import Start from './Pages/Start';
import useUserData from './Hooks/useUserData';
import deepEqual from 'deep-equal';
import Shop from './Pages/Shop';
import Kitchen from './Pages/Kitchen';
import Friends from './Pages/Friends';
import Earn from './Pages/Earn';
const tg = window.Telegram.WebApp



function App() {

  const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SERVER : 'http://localhost:8000'
  const { userData, setInitLoad } = useUserData()
  const userDataRef = useRef(userData)
  const hasBackgroundEventTriggeredRef = useRef(false);

  useEffect(() => {
    window.addEventListener('load', () => {
      setInitLoad(true)
    })

    return () => {
      window.removeEventListener('load', () => {
        setInitLoad(true)
      })
    }
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
      navigator.serviceWorker.controller.postMessage({ type, data: userDataRef.current });

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
    const startParam = tg.initDataUnsafe.start_param
    const tgId = tg.initDataUnsafe.user.id
    if (startParam) {
      const refUserId = startParam.split('_')[1]
      console.log(refUserId)

      fetch(server + '/ref', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refUserId: refUserId, tgId })
      })

    }

    //eslint-disable-next-line
  }, [])

  return (
    <>
      <div className='bg-gradient max-h-screen h-screen overflow-x-auto'>

        <div className='flex flex-col h-full'>
          {!['/', '/friends', '/thankyou', '/waitlist'].some(route => route === window.location.pathname) &&
            !/^\/ref\/[^/]+$/.test(window.location.pathname) &&
            <Header />}

          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/ref/:refUserId" element={<Start />} />
            <Route path="/waitlist" element={<Waitlist />} exact />
            <Route path="/thankyou" element={<Thankyou />} exact />
            <Route path="/house" element={<House server={server} />} exact />
            <Route path="/shop/:section" element={<Shop server={server} />} />
            <Route path="/kitchen" element={<Kitchen server={server} />} />
            <Route path="/friends" element={<Friends server={server} />} />
            <Route path="/earn" element={<Earn />} />
          </Routes>
          {!['/', '/waitlist'].some(route => route === window.location.pathname) &&
            !/^\/ref\/[^/]+$/.test(window.location.pathname) &&
            <Footer />}
        </div>
      </div>

    </>
  );
}

export default App;
