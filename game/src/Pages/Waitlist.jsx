import React, { useState } from 'react'
import firebase from 'firebase/compat/app';
import db from '../firebase'
import { useNavigate } from 'react-router-dom';

function Waitlist() {

  const [email, setEmail] = useState();
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    // Simple email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try{
      if (validateEmail(email)) {
        setEmailError('');
        setIsLoading(true);
  
        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        await db.collection('waitlist').doc(email).set({
          email,
          timestamp,
          status: 'waiting',
        });
  
        setTimeout(() => {
          navigate('/thankyou')
        }, 1000);
  
        console.log('test')
  
      } else {
        setEmailError('Please enter a valid email address');
      }
    } catch(err){
      console.log(err)
    }
    
  }


  return (
    <div className='bg-gradient'>
      <div className="flex flex-col h-screen relative">
        <img src='assets/creature 1.png' alt="creature" className='absolute top-14'/>
        <img src='assets/creature 2.png' alt="creature" className='absolute top-56'/>
        <img src='assets/creature 3.png' alt="creature" className='absolute right-0'/>
        <img src='assets/creature 4.png' alt="creature" className='absolute right-0 top-60'/>
      <div className="flex flex-col items-center text-center gap-5 flex-[0.8] justify-center z-10">
        <img src="assets/monpark logo.svg" alt="monpark" />
        <h1 className="text-white font-bold text-2xl">Moo!</h1>
        <h1 className="text-white font-bold text-2xl">Welcome to the MonPark</h1>
      </div>

     
        <div className='flex flex-col gap-8 items-center z-10'>
          <form className="flex flex-col px-5 gap-5 max-w-96 w-full" onSubmit={(e) => handleJoin(e)}>
            <input
              type="email"
              className="text-white rounded-lg px-3 py-2 text-base bg-[#150A27] border border-[#282828]"
              placeholder="Enter your email"

              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
            <button className="bg-white text-black px-3 py-2 rounded-lg border hover:bg-opacity-90" type='submit'>
              {isLoading ? 'Loading...':'Join the waitlist'}
            </button>
          </form>
          <div className='flex flex-col text-white items-center'>
            <span>Coming on Monad Blockchain</span>
            <span>Stay tuned</span>
          </div>
          <div className='flex gap-4 justify-center'>
            <a href="https:/x.com/MonPark_bot?t=S20KhU3Nc3Y4NHY-XHL8rg&s=09" target='_blank'>

            <img src='assets/twitter logo.svg' alt="twitter" />
            </a>
            <a href='https://t.me/monpark' target='_blank' >

            <img src='assets/telegram logo.svg' alt="telegram" />
            </a>
          </div>
        </div>
    </div>
    </div>
  );
}

export default Waitlist