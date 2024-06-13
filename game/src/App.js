import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Waitlist from './Pages/Waitlist';
import Thankyou from './Pages/Thankyou';
import Header from './Components/Header';
import Footer from './Components/Footer';
import House from './Pages/House';
// import { useEffect } from 'react';
// import db from './firebase';
// import firebase from 'firebase/compat/app';

// const tele = window.Telegram.WebApp

function App() {
  // const location = useLocation();
  const showHeader = !['/friends', '/thankyou', '/'].includes(window.location.pathname);;

  // useEffect(() => {
  //   // tele.ready()

  //   const initData = tele.initData;
  //   const query = new URLSearchParams(initData)
  //   const userData = JSON.parse(query.get('user'))
  //   const tgId = String(userData.id)
  //   console.log(userData)
  //   console.log(tgId)

  //   const checkDoc = async () => {
  //     const docRef = db.collection('users').doc(tgId)
  //     const doc = await docRef.get()
  //     return doc.exists
  //   }

  //   checkDoc()
  //     .then(exists => {
  //       if (exists) {
  //         console.log('exists', exists)
  //       } else {
  //         const timestamp = firebase.firestore.FieldValue.serverTimestamp()

  //         db.collection('users').doc(tgId).set({
  //           tgId,
  //           last_active: timestamp,
  //           feed_left: 100,
  //           total_income: 0,
  //           level: 1,
  //           income_per_hour: 0,
  //           shop: []
  //         })
  //       }
  //     })
  //     .catch(err => console.error(err))

  // })

  return (
    <Router>
      <div className='bg-gradient h-screen'>
        <div className='flex flex-col h-full'>
          {showHeader && <Header />}

          <Routes>
            <Route path="/" element={<Waitlist />} exact />
            <Route path="/thankyou" element={<Thankyou />} exact />
            <Route path="/house" element={<House />} exact />
          </Routes>
          <Footer />
        </div>
      </div>

    </Router>
  );
}

export default App;
