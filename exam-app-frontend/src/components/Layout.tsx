import type { ReactNode } from 'react';
import Navbar from './Navbar';
import type { User } from '../types';

interface LayoutProps {
  user: User | null;
  currentView: string;
  onNavigate: (view: 'generator' | 'history' | 'statistics' | 'premium' | 'reviews' ) => void;  // ✅ Dodaj reviews
  onLogout: () => void;
  children: ReactNode;
}

function Layout({ user, currentView, onNavigate, onLogout, children }: LayoutProps) {
  return (
    <div className="App">
      <Navbar 
        user={user}
        currentView={currentView}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      
      <main className="app-main">
        {children}
      </main>
      
      {/* Footer */}
      {user && (
        <footer className="app-footer">
          <p>© 2026 Exam Task Generator | Fizyka Maturalna</p>
        </footer>
      )}
    </div>
  );
}

export default Layout;