import React, { useState, useEffect } from 'react';
import Generator from './components/Generator';
import Gallery from './components/Gallery';
import Login from './components/Login';
import Signup from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState('login'); 
  const [user, setUser] = useState(null);


  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      const userData = JSON.parse(savedUser);
      
   
      verifyToken(token).then(isValid => {
        if (isValid) {
          setUser(userData);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setShowAuth(true);
        }
      });
    } else {
      setShowAuth(true);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth(false);
    setAuthView('login');
  };

  const handleSignup = (userData) => {
    
    setAuthView('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowAuth(true);
    setAuthView('login');
  };

  if (showAuth) {
    return (
      <div className="app">
        {authView === 'login' && (
          <Login 
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthView('signup')}
            onForgotPassword={() => setAuthView('forgot-password')}
          />
        )}
        
        {authView === 'signup' && (
          <Signup 
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthView('login')}
            onResendVerification={(email) => {
            
              console.log('Resend verification for:', email);
            }}
          />
        )}
        
        {authView === 'forgot-password' && (
          <ForgotPassword 
            onBackToLogin={() => setAuthView('login')}
            onResetRequested={(email) => {
              console.log('Password reset requested for:', email);
            }}
          />
        )}
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Prompt2Pixel</h1>
        {user && (
          <div className="user-info">
            <span className="user-welcome">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </header>
      
      <Generator 
        onImageGenerated={(newImage) => setImages([newImage, ...images])}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      
      <Gallery images={images} />
      <Footer />
    </div>
  );
}

export default App;