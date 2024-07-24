import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'
import UserProviderWrapper from './UserProviderWrapper';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        // Pass environment info to the service worker
        // const server = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER : 'http://localhost:8000'
        const server = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SERVER : 'http://localhost:8000'
        registration.active.postMessage({ server });
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
    <UserProviderWrapper>
      <App />
    </UserProviderWrapper>
  </Router>
  // </React.StrictMode>
);

