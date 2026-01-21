import { useState } from 'react';
import { paymentApi } from '../services/api';

function Premium() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    setLoading(true);
    setError('');

    try {
      const response = await paymentApi.createCheckout(planType);
      
      // Przekieruj do Stripe Checkout
      window.location.href = response.checkoutUrl;
    } catch (err: any) {
      setError('Nie udało się utworzyć sesji płatności');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="premium-page">
      <div className="premium-header">
        <h2>⭐ Przejdź na Premium</h2>
        <p className="premium-subtitle">
          Odblokuj nielimitowany dostęp do generatora zadań!
        </p>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="pricing-grid">
        {/* Plan Miesięczny */}
        <div className="pricing-card">
          <div className="plan-header">
            <h3>Miesięczny</h3>
            <div className="price">
              <span className="currency">PLN</span>
              <span className="amount">29</span>
              <span className="period">/miesiąc</span>
            </div>
          </div>

          <ul className="features-list">
            <li>✅ Nielimitowane generowanie zadań</li>
            <li>✅ Nielimitowane pobieranie PDF</li>
            <li>✅ Dostęp do wszystkich poziomów</li>
            <li>✅ Wszystkie działy fizyki</li>
            <li>✅ Wsparcie priorytetowe</li>
          </ul>

          <button
            onClick={() => handleSubscribe('monthly')}
            disabled={loading}
            className="btn-subscribe"
          >
            {loading ? '⏳ Ładowanie...' : 'Subskrybuj miesięcznie'}
          </button>
        </div>

        {/* Plan Roczny */}
        <div className="pricing-card pricing-card-featured">
          <div className="popular-badge">🔥 Najpopularniejszy</div>
          <div className="plan-header">
            <h3>Roczny</h3>
            <div className="price">
              <span className="currency">PLN</span>
              <span className="amount">290</span>
              <span className="period">/rok</span>
            </div>
            <div className="savings">Oszczędzasz 58 PLN rocznie!</div>
          </div>

          <ul className="features-list">
            <li>✅ Nielimitowane generowanie zadań</li>
            <li>✅ Nielimitowane pobieranie PDF</li>
            <li>✅ Dostęp do wszystkich poziomów</li>
            <li>✅ Wszystkie działy fizyki</li>
            <li>✅ Wsparcie priorytetowe</li>
            <li>⭐ 2 miesiące GRATIS</li>
          </ul>

          <button
            onClick={() => handleSubscribe('yearly')}
            disabled={loading}
            className="btn-subscribe btn-subscribe-featured"
          >
            {loading ? '⏳ Ładowanie...' : 'Subskrybuj rocznie'}
          </button>
        </div>
      </div>

      <div className="premium-faq">
        <h3>❓ Często zadawane pytania</h3>
        <div className="faq-grid">
          <div className="faq-item">
            <strong>Czy mogę anulować w każdej chwili?</strong>
            <p>Tak! Możesz anulować subskrypcję w dowolnym momencie.</p>
          </div>
          <div className="faq-item">
            <strong>Czy są ukryte opłaty?</strong>
            <p>Nie. Płacisz tylko za wybrany plan, bez dodatkowych kosztów.</p>
          </div>
          <div className="faq-item">
            <strong>Jakie metody płatności akceptujecie?</strong>
            <p>Visa, Mastercard, Apple Pay, Google Pay i więcej przez Stripe.</p>
          </div>
          <div className="faq-item">
            <strong>Czy dostaję fakturę?</strong>
            <p>Tak, automatyczna faktura na email po każdej płatności.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Premium;