import { useState, type FormEvent, type ChangeEvent } from 'react';
import { authApi } from '../services/api';
import type { RegisterRequest, User } from '../types';

interface RegisterProps {
  onRegisterSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
}

function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authApi.register(formData);
      if (result.success && result.user) {
        onRegisterSuccess(result.user);
      } else {
        setError(result.message || 'Rejestracja nie powiodła się');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>📝 Rejestracja</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email: *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="twoj@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Nazwa użytkownika: *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username123"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Hasło: *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstName">Imię:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Jan"
              autoComplete="given-name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Nazwisko:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Kowalski"
              autoComplete="family-name"
            />
          </div>

          {error && <div className="error-message">❌ {error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '⏳ Rejestracja...' : '✨ Zarejestruj się'}
          </button>
        </form>

        <p className="switch-auth">
          Masz już konto?{' '}
          <button onClick={onSwitchToLogin} className="link-button">
            Zaloguj się
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;