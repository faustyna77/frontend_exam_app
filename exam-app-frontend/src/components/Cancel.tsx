function Cancel() {
  return (
    <div className="cancel-page">
      <div className="cancel-card">
        <div className="cancel-icon">❌</div>
        <h2>Płatność anulowana</h2>
        <p>Nie martw się, możesz spróbować ponownie w każdej chwili.</p>
        <p className="cancel-details">
          Twoje dane są bezpieczne i nie zostały pobrane żadne opłaty.
        </p>
        <div className="cancel-actions">
          <button onClick={() => window.location.href = '/'} className="btn-secondary">
            Wróć do aplikacji
          </button>
          <button onClick={() => window.location.href = '/#premium'} className="btn-primary">
            Spróbuj ponownie
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cancel;