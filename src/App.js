import React, { Suspense, lazy, useEffect} from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import store from './store';
import Notifications from './user/Notification'; // Importer Notifications
// Dynamically import components
const Login = lazy(() => import('./user/Login'));
const SignUp = lazy(() => import('./user/SignUp'));
const MessagingPage = lazy(() => import('./user/MessagingPage'));

// Authentication Guard Component
const RequireAuth = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const isAuthenticated = !!sessionStorage.getItem('token'); // Check if the user is logged in
  window.Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        console.log('Notifications enabled');
    } else {
        console.log('Notifications denied');
    }
});



      useEffect(() => {
        // Assurez-vous que le service worker est disponible
        if ('serviceWorker' in navigator) {
          const sw = navigator.serviceWorker;

          // Écouter le message envoyé depuis le service worker
          sw.onmessage = (event) => {
            console.log('Got event from SW:', event.data);

            // Vous pouvez traiter le message ici. Par exemple, vous pouvez afficher un toast, une alerte ou mettre à jour l'état
            const { title, message } = event.data;  // Assurez-vous que `event.data` contient les bonnes informations
            alert(`New Notification: ${title} - ${message}`);
          };
        }
      }, []);
  return (
    <Notifications> 
        <BrowserRouter>
          <Provider store={store}>
             <Suspense fallback={<div>Loading...</div>}>
          <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/messaging" element={<MessagingPage />} />
        </Routes>
        </Suspense>
      </Provider>
    </BrowserRouter>
    </Notifications>
  );
}

export default App;