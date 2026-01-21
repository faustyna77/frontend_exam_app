import { useState, useEffect } from 'react';
import { physicsApi } from '../services/api';

interface StatisticsData {
  totalTasks: number;
  years: number[];
  levels: Array<{ level: string; count: number }>;
  subjects: Array<{ subject: string; count: number }>;
}

function Statistics() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await physicsApi.getStatistics();
      setStats(data);
    } catch (err: any) {
      setError('Nie udało się pobrać statystyk');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="statistics">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Ładowanie statystyk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics">
        <div className="error-message">❌ {error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="statistics">
        <div className="empty-state">
          <p>Brak dostępnych statystyk</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics">
      <div className="stats-header">
        <h2>📊 Statystyki Bazy Zadań</h2>
        <p className="stats-subtitle">
          Przegląd zadań maturalnych z fizyki w bazie danych
        </p>
      </div>

      <div className="stats-grid">
        {/* Total Tasks */}
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Łącznie zadań</h3>
            <p className="stat-number">{stats.totalTasks}</p>
          </div>
        </div>

        {/* Years */}
        <div className="stat-card stat-card-secondary">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Lata</h3>
            <p className="stat-number">{stats.years.length}</p>
            <p className="stat-detail">
              {stats.years[0]} - {stats.years[stats.years.length - 1]}
            </p>
          </div>
        </div>

        {/* Levels */}
        <div className="stat-card stat-card-success">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>Poziomy</h3>
            {stats.levels.map((level, i) => (
              <div key={i} className="stat-item">
                <span>{level.level}:</span>
                <strong>{level.count}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects */}
        <div className="stat-card stat-card-info">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Działy</h3>
            {stats.subjects.length > 0 ? (
              stats.subjects.map((subject, i) => (
                <div key={i} className="stat-item">
                  <span>{subject.subject || 'Ogólne'}:</span>
                  <strong>{subject.count}</strong>
                </div>
              ))
            ) : (
              <p className="stat-detail">Brak danych</p>
            )}
          </div>
        </div>
      </div>

      {/* Years List */}
      <div className="years-section">
        <h3>🗓️ Dostępne roczniki</h3>
        <div className="years-list">
          {stats.years.map((year) => (
            <div key={year} className="year-badge">
              {year}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistics;