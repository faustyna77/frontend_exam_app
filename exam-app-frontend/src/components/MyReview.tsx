import { useState, useEffect } from 'react';
import { reviewsApi } from '../services/api';
import type { Review } from '../types';

function MyReview() {
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadMyReview();
  }, []);

  const loadMyReview = async () => {
    setLoading(true);
    try {
      const review = await reviewsApi.getMy();
      setMyReview(review);
      if (review) {
        setRating(review.rating);
        setComment(review.comment);
      }
    } catch (err: any) {
      console.error('Failed to load review', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nie udało się zapisać recenzji');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć swoją recenzję?')) return;

    try {
      await reviewsApi.deleteMy();
      setMyReview(null);
      setRating(5);
      setComment('');
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
      <div className="my-review">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-review">
      <div className="review-header">
        <h2>💬 Moja Recenzja</h2>
        <p className="review-subtitle">
          Podziel się swoją opinią o aplikacji
        </p>
      </div>

      {success && <div className="success-message">✅ {success}</div>}
      {error && <div className="error-message">❌ {error}</div>}

      {myReview && !editing ? (
        <div className="review-display">
          <div className="review-card my-review-card">
            <div className="review-rating">
              {renderStars(myReview.rating)}
              <span className="rating-number">{myReview.rating}/5</span>
            </div>
            <p className="review-comment">{myReview.comment}</p>
            <p className="review-date">
              Dodano: {new Date(myReview.createdAt).toLocaleDateString('pl-PL')}
            </p>
            <div className="review-actions">
              <button onClick={() => setEditing(true)} className="btn-secondary">
                ✏️ Edytuj
              </button>
              <button onClick={handleDelete} className="btn-danger">
                🗑️ Usuń
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="review-form">
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
              placeholder="Opisz swoją opinię..."
              rows={5}
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
                  setEditing(false);
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
      )}
    </div>
  );
}

export default MyReview;