import { useEffect, useState } from 'react';

function Success() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h2>Płatność zakończona sukcesem!</h2>
        <p>Twoja subskrypcja Premium została aktywowana.</p>
        <p className="success-details">
          Teraz masz dostęp do nielimitowanego generowania zadań i pobierania PDF!
        </p>
        <p className="countdown">
          Przekierowanie za {countdown} sekund...
        </p>
        <button onClick={() => window.location.href = '/'} className="btn-primary">
          Wróć do aplikacji
        </button>
      </div>
    </div>
  );
}

export default Success;