import { useState, type FormEvent, type ChangeEvent } from 'react';
import { authApi } from '../services/api';
import type { LoginRequest, User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
}

function Login({ onLoginSuccess, onSwitchToRegister }: LoginProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
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
      const result = await authApi.login(formData);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'Logowanie nie powiodło się');
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
        <h2>🎓 Logowanie</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
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
            <label htmlFor="password">Hasło:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">❌ {error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '⏳ Logowanie...' : '🚀 Zaloguj się'}
          </button>
        </form>

        <p className="switch-auth">
          Nie masz konta?{' '}
          <button onClick={onSwitchToRegister} className="link-button">
            Zarejestruj się
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;