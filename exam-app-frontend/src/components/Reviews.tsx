import { useState, useEffect } from 'react';
import { reviewsApi } from '../services/api';
import type { Review, ReviewStats } from '../types';
import { authApi } from '../services/api';

function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Formularz mojej recenzji
  const [showMyReviewForm, setShowMyReviewForm] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const currentUser = authApi.getCurrentUser();
  const isAdmin = currentUser?.role === 'Admin';

  const pageSize = 10;

  useEffect(() => {
    loadAllData();
  }, [page]);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [reviewsResponse, statsData, myReviewData] = await Promise.all([
        reviewsApi.getAll(page, pageSize),
        reviewsApi.getStats(),
        reviewsApi.getMy(),
      ]);
      
      setReviews(reviewsResponse.reviews);
      setTotalPages(reviewsResponse.totalPages);
      setStats(statsData);
      setMyReview(myReviewData);

      if (myReviewData) {
        setRating(myReviewData.rating);
        setComment(myReviewData.comment);
      }
    } catch (err: any) {
      setError('Nie udało się pobrać recenzji');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMyReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (comment.trim().length < 10) {
      setError('Komentarz musi mieć minimum 10 znaków');
      return;
    }

    try {
      if (myReview) {
        // Update
        const updated = await reviewsApi.update({ rating, comment });
        setMyReview(updated);
        setSuccess('Recenzja zaktualizowana!');
      } else {
        // Create
        const created = await reviewsApi.create({ rating, comment });
        setMyReview(created);
        setSuccess('Recenzja dodana!');
      }
      setShowMyReviewForm(false);
      await loadAllData(); // Reload wszystkiego
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nie udało się zapisać recenzji');
    }
  };

  const handleDeleteMyReview = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć swoją recenzję?')) return;

    try {
      await reviewsApi.deleteMy();
      setMyReview(null);
      setRating(5);
      setComment('');
      setSuccess('Recenzja usunięta');
      await loadAllData();
    } catch (err: any) {
      setError('Nie udało się usunąć recenzji');
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę recenzję?')) return;

    try {
      await reviewsApi.delete(id);
      await loadAllData();
      setSuccess('Recenzja usunięta');
    } catch (err: any) {
      setError('Nie udało się usunąć recenzji');
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= currentRating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="reviews">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Ładowanie recenzji...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews">
      <div className="reviews-header">
        <h2>⭐ Recenzje i Opinie</h2>
        <p className="reviews-subtitle">
          Zobacz opinie innych użytkowników i podziel się swoją!
        </p>
      </div>

      {error && <div className="error-message">❌ {error}</div>}
      {success && <div className="success-message">✅ {success}</div>}

      {/* SEKCJA: MOJA RECENZJA */}
      <div className="my-review-section">
        <h3 className="section-title">💬 Twoja opinia</h3>
        
        {myReview && !showMyReviewForm ? (
          // Wyświetl moją recenzję
          <div className="my-review-display">
            <div className="review-card my-review-card">
              <div className="review-badge">Twoja recenzja</div>
              <div className="review-rating">
                {renderStars(myReview.rating)}
                <span className="rating-number">{myReview.rating}/5</span>
              </div>
              <p className="review-comment">{myReview.comment}</p>
              <p className="review-date">
                Dodano: {new Date(myReview.createdAt).toLocaleDateString('pl-PL')}
              </p>
              <div className="review-actions">
                <button onClick={() => setShowMyReviewForm(true)} className="btn-secondary">
                  ✏️ Edytuj
                </button>
                <button onClick={handleDeleteMyReview} className="btn-danger">
                  🗑️ Usuń
                </button>
              </div>
            </div>
          </div>
        ) : showMyReviewForm || !myReview ? (
          // Formularz dodania/edycji
          <form onSubmit={handleSubmitMyReview} className="my-review-form">
            <div className="form-group">
              <label>Ocena *</label>
              {renderStars(rating, true)}
              <p className="rating-text">
                {rating === 5 && '⭐ Doskonale!'}
                {rating === 4 && '👍 Bardzo dobrze'}
                {rating === 3 && '😊 Dobrze'}
                {rating === 2 && '😐 Średnio'}
                {rating === 1 && '👎 Słabo'}
              </p>
            </div>

            <div className="form-group">
              <label>Komentarz * (minimum 10 znaków)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Podziel się swoją opinią o aplikacji..."
                rows={4}
                className="review-textarea"
                required
              />
              <small>{comment.length} / 500 znaków</small>
            </div>

            <div className="form-actions">
              {myReview && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMyReviewForm(false);
                    setRating(myReview.rating);
                    setComment(myReview.comment);
                  }}
                  className="btn-secondary"
                >
                  Anuluj
                </button>
              )}
              <button type="submit" className="btn-primary">
                {myReview ? '💾 Zapisz zmiany' : '✅ Dodaj recenzję'}
              </button>
            </div>
          </form>
        ) : null}
      </div>

      {/* SEKCJA: STATYSTYKI */}
      {stats && (
        <div className="stats-section">
          <h3 className="section-title">📊 Statystyki</h3>
          <div className="review-stats">
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h4>Średnia ocena</h4>
                <div className="stat-number">{stats.averageRating.toFixed(1)}</div>
                {renderStars(Math.round(stats.averageRating))}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <h4>Liczba recenzji</h4>
                <div className="stat-number">{stats.totalReviews}</div>
              </div>
            </div>

            <div className="stat-card stat-card-distribution">
              <h4>Rozkład ocen</h4>
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map((ratingValue) => (
                  <div key={ratingValue} className="rating-bar">
                    <span className="rating-label">{ratingValue}★</span>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${stats.totalReviews > 0 ? ((stats.ratingDistribution[ratingValue] || 0) / stats.totalReviews) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="rating-count">{stats.ratingDistribution[ratingValue] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEKCJA: WSZYSTKIE RECENZJE */}
      <div className="all-reviews-section">
        <h3 className="section-title">📝 Wszystkie opinie ({stats?.totalReviews || 0})</h3>
        
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="empty-state">
              <p>📭 Jeszcze nikt nie dodał recenzji. Bądź pierwszy!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header-item">
                  <div className="review-author">
                    <span className="author-icon">👤</span>
                    <span className="author-name">{review.userName}</span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="btn-icon btn-delete"
                      title="Usuń (Admin)"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <div className="review-rating">
                  {renderStars(review.rating)}
                  <span className="rating-number">{review.rating}/5</span>
                </div>

                <p className="review-comment">{review.comment}</p>

                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('pl-PL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))
          )}
        </div>

        {/* PAGINACJA */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn-pagination"
            >
              ← Poprzednia
            </button>
            <span className="page-info">
              Strona {page} z {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="btn-pagination"
            >
              Następna →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;