import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout: () => void;
}

function Navbar({ user, currentView, onNavigate, onLogout }: NavbarProps) {
  // Navbar dla niezalogowanych użytkowników (Landing Page)
  if (!user) {
    return (
      <header className="app-header landing-header">
        <div className="header-content">
          <h1 className="app-title">🎓 Exam Task Generator</h1>
          
          <div className="auth-buttons">
            <button
              onClick={() => onNavigate('login')}
              className="nav-button"
            >
              🔑 Zaloguj się
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="nav-button nav-button-primary"
            >
              🚀 Zarejestruj się
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Navbar dla zalogowanych użytkowników
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">🎓 Exam Task Generator</h1>
        
        <div className="user-section">
          <nav className="nav-menu">
            <button
              onClick={() => onNavigate('generator')}
              className={`nav-button ${currentView === 'generator' ? 'active' : ''}`}
            >
              ⚡ Generator
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`nav-button ${currentView === 'history' ? 'active' : ''}`}
            >
              📚 Historia
            </button>
            <button
              onClick={() => onNavigate('statistics')}
              className={`nav-button ${currentView === 'statistics' ? 'active' : ''}`}
            >
              📊 Statystyki
            </button>
            <button
              onClick={() => onNavigate('reviews')}
              className={`nav-button ${currentView === 'reviews' ? 'active' : ''}`}
            >
              ⭐ Recenzje
            </button>
            <button
              onClick={() => onNavigate('premium')}
              className={`nav-button ${currentView === 'premium' ? 'active' : ''}`}
            >
              💎 Premium
            </button>
          </nav>
          
          <div className="user-info">
            <span className="user-greeting">
              Siema, {user.firstName || user.username}! 👋
            </span>
            <button onClick={onLogout} className="btn-logout">
              🚪 Wyloguj się
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;