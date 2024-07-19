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

