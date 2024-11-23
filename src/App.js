import React, { Suspense, lazy } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import store from './store';

// Dynamically import components
const Login = lazy(() => import('./user/Login'));
const SignUp = lazy(() => import('./user/SignUp'));
import MessagingPage from './user/MessagingPage';

// Authentication Guard Component
const RequireAuth = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {

  return (
    <BrowserRouter>
      <Provider store={store}>
          <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/messaging" element={<MessagingPage />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;