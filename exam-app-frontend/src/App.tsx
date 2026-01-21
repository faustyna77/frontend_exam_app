import { useState, useEffect } from 'react';
import { authApi } from './services/api';
import type { User } from './types';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import TaskGenerator from './components/TaskGenerator';
import TaskHistory from './components/TaskHistory';
import Statistics from './components/Statistics';
import Premium from './components/Premium';
import Reviews from './components/Reviews';
import Success from './components/Success';
import Cancel from './components/Cancel';
import './App.css';
import './components/LandingPage.css';

type View = 'landing' | 'login' | 'register' | 'generator' | 'history' | 'statistics' | 'premium' | 'reviews' | 'success' | 'cancel';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('landing');

  useEffect(() => {
    const savedUser = authApi.getCurrentUser();
    if (savedUser && authApi.isAuthenticated()) {
      setUser(savedUser);
      setCurrentView('history'); // ← Zmienione z 'generator' na 'history'
    } else {
      setCurrentView('landing');
    }

    // Sprawdź URL dla success/cancel
    const hash = window.location.hash;
    if (hash === '#success') {
      setCurrentView('success');
    } else if (hash === '#cancel') {
      setCurrentView('cancel');
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('history'); // ← Zmienione z 'generator' na 'history'
  };

  const handleRegisterSuccess = (registeredUser: User) => {
    setUser(registeredUser);
    setCurrentView('history'); // ← Zmienione z 'generator' na 'history'
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setCurrentView('landing');
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  // Widoki bez layoutu (success/cancel)
  if (currentView === 'success' || currentView === 'cancel') {
    return (
      <div className="App">
        {currentView === 'success' && <Success />}
        {currentView === 'cancel' && <Cancel />}
      </div>
    );
  }

  // Landing Page (niezalogowani użytkownicy)
  if (currentView === 'landing' && !user) {
    return (
      <Layout
        user={null}
        currentView="landing"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        <LandingPage onNavigate={handleNavigate} />
      </Layout>
    );
  }

  // Login Page
  if (currentView === 'login') {
    return (
      <Layout
        user={null}
        currentView="login"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        <div className="app-main">
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        </div>
      </Layout>
    );
  }

  // Register Page
  if (currentView === 'register') {
    return (
      <Layout
        user={null}
        currentView="register"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        <div className="app-main">
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        </div>
      </Layout>
    );
  }

  // Widoki dla zalogowanych użytkowników
  return (
    <Layout
      user={user}
      currentView={currentView}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {currentView === 'generator' && <TaskGenerator />}
      {currentView === 'history' && <TaskHistory />}
      {currentView === 'statistics' && <Statistics />}
      {currentView === 'premium' && <Premium />}
      {currentView === 'reviews' && <Reviews />}
    </Layout>
  );
}

export default App;