import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'
import UserProviderWrapper from './UserProviderWrapper';
import { ImageProvider } from './Context/imgProvider';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SERVER : 'http://localhost:8000'

        if (registration.active) {
          registration.active.postMessage({ server });
        }

      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
} else {
  alert('service worker not reg')
  console.log('no service worker')
}




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Router>
    <ImageProvider>
      <UserProviderWrapper>

        <App />
      </UserProviderWrapper>
    </ImageProvider>
  </Router>
  // </React.StrictMode>
);

