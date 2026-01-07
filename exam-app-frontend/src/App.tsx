import { useState, useEffect } from 'react';
import { authApi } from './services/api';
import type { User } from './types';
import Login from './components/Login';
import Register from './components/Register';
import TaskGenerator from './components/TaskGenerator';
import TaskHistory from './components/TaskHistory';  // ← DODAJ
import './App.css';

type View = 'login' | 'register' | 'generator' | 'history';  // ← Dodaj 'history'

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('login');

  useEffect(() => {
    const savedUser = authApi.getCurrentUser();
    if (savedUser && authApi.isAuthenticated()) {
      setUser(savedUser);
      setCurrentView('generator');
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('generator');
  };

  const handleRegisterSuccess = (registeredUser: User) => {
    setUser(registeredUser);
    setCurrentView('generator');
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setCurrentView('login');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎓 Exam Task Generator</h1>
        {user && (
          <div className="user-info">
            <nav className="nav-menu">
              <button
                onClick={() => setCurrentView('generator')}
                className={`nav-button ${currentView === 'generator' ? 'active' : ''}`}
              >
                ✨ Generator
              </button>
              <button
                onClick={() => setCurrentView('history')}
                className={`nav-button ${currentView === 'history' ? 'active' : ''}`}
              >
                📚 Historia
              </button>
            </nav>
            <span>Witaj, {user.firstName || user.username}! 👋</span>
            <button onClick={handleLogout} className="btn-logout">
              Wyloguj się
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {currentView === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        )}

        {currentView === 'register' && (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'generator' && user && <TaskGenerator />}

        {currentView === 'history' && user && <TaskHistory />}
      </main>
    </div>
  );
}

export default App;