import { useState, useEffect } from 'react';
import { reviewsApi } from '../services/api';
import type { Review, ReviewStats } from '../types';

interface LandingPageProps {
  onNavigate: (view: 'login' | 'register') => void;
}

function LandingPage({ onNavigate }: LandingPageProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const [reviewsResponse, statsData] = await Promise.all([
        reviewsApi.getAll(1, 6), // Pobierz 6 najnowszych recenzji
        reviewsApi.getStats(),
      ]);
      
      setReviews(reviewsResponse.reviews);
      setStats(statsData);
    } catch (err) {
      console.error('Błąd podczas ładowania recenzji:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🎓 Exam Task Generator
          </h1>
          <p className="hero-subtitle">
            Generuj profesjonalne zadania maturalne z fizyki w kilka sekund!
          </p>
          <p className="hero-description">
            Zaawansowany generator zadań wykorzystujący AI do tworzenia unikalnych pytań egzaminacyjnych 
            dostosowanych do poziomu podstawowego i rozszerzonego.
          </p>
          
          <div className="hero-buttons">
            <button onClick={() => onNavigate('register')} className="btn-hero-primary">
              🚀 Rozpocznij za darmo
            </button>
            <button onClick={() => onNavigate('login')} className="btn-hero-secondary">
              🔑 Zaloguj się
            </button>
          </div>

          {stats && (
            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-number">⭐ {stats.averageRating.toFixed(1)}</div>
                <div className="hero-stat-label">Średnia ocena</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-number">💬 {stats.totalReviews}</div>
                <div className="hero-stat-label">Zadowolonych użytkowników</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">✨ Funkcje aplikacji</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Generowanie AI</h3>
            <p>Wykorzystujemy zaawansowaną sztuczną inteligencję do tworzenia unikalnych zadań</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Różne poziomy</h3>
            <p>Zadania podstawowe i rozszerzone dostosowane do wymagań maturalnych</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Błyskawiczna generacja</h3>
            <p>Otrzymaj kompletne zadania z rozwiązaniami w kilka sekund</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Export do PDF</h3>
            <p>Pobieraj zadania w formie profesjonalnych plików PDF</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Historia i statystyki</h3>
            <p>Przeglądaj wygenerowane zadania i analizuj statystyki</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalizacja</h3>
            <p>Wybieraj tematy, poziom trudności i liczbę zadań</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 className="section-title">⭐ Co mówią nasi użytkownicy?</h2>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Ładowanie recenzji...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="landing-reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="landing-review-card">
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
                <p className="review-comment">"{review.comment}"</p>
                <div className="review-author">
                  <span className="author-icon">👤</span>
                  <span className="author-name">{review.userName}</span>
                </div>
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('pl-PL', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>📭 Brak recenzji</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Gotowy na start?</h2>
        <p className="cta-description">
          Dołącz do grona zadowolonych nauczycieli i uczniów!
        </p>
        <div className="cta-buttons">
          <button onClick={() => onNavigate('register')} className="btn-cta-primary">
            🚀 Zarejestruj się za darmo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 Exam Task Generator. Wszystkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
}

export default LandingPage;