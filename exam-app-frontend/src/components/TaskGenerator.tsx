import { useState, type FormEvent, type ChangeEvent } from 'react';
import { physicsApi } from '../services/api';
import type { TaskGenerationRequest, ExamTask } from '../types';
import TaskDisplay from './TaskDisplay';

function TaskGenerator() {
  const [formData, setFormData] = useState<TaskGenerationRequest>({
    taskTopic: '',
    difficultyLevel: 'podstawowy',
    physicsSubject: 'mechanika',
    taskCount: 1,
    taskType: 'closed',
  });

  const [includeSolutions, setIncludeSolutions] = useState<boolean>(true); // ✅ Nowy stan
  const [tasks, setTasks] = useState<ExamTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'taskCount' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    setTasks([]);

    try {
      // ✅ Przekazujemy includeSolutions do API
      const result = await physicsApi.generateTasks(formData, includeSolutions);

      if (result.tasks && result.tasks.length > 0) {
        setTasks(result.tasks);
        setSuccess(true);
      } else {
        setError('Nie udało się wygenerować zadań. Spróbuj ponownie.');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(
        err.response?.data?.details ||
        err.response?.data?.error ||
        'Błąd połączenia z serwerem. Sprawdź czy backend działa.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-generator">
      <div className="generator-header">
        <h2>Generator Zadań Maturalnych</h2>
        <p className="generator-subtitle">
          Wygeneruj zadania z fizyki dostosowane do poziomu maturalnego
        </p>
      </div>

      <form onSubmit={handleSubmit} className="generator-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="taskTopic">
              Temat zadania: <span className="required">*</span>
            </label>
            <input
              type="text"
              id="taskTopic"
              name="taskTopic"
              value={formData.taskTopic}
              onChange={handleChange}
              placeholder="np. Prędkość średnia, Energia kinetyczna..."
              required
            />
            <small>Opisz temat zadania, które chcesz wygenerować</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="difficultyLevel"> Poziom:</label>
            <select
              id="difficultyLevel"
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
            >
              <option value="podstawowy">Podstawowy</option>
              <option value="rozszerzony">Rozszerzony</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="physicsSubject">Dział fizyki:</label>
            <select
              id="physicsSubject"
              name="physicsSubject"
              value={formData.physicsSubject}
              onChange={handleChange}
            >
              <option value="mechanika">Mechanika</option>
              <option value="dynamika">Dynamika</option>
              <option value="elektryczność">Elektryczność</option>
              <option value="optyka">Optyka</option>
              <option value="termodynamika">Termodynamika</option>
              <option value="fizyka nowoczesna">Fizyka nowoczesna</option>
              <option value="fale">Fale</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="taskType"> Typ zadania:</label>
            <select
              id="taskType"
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
            >
              <option value="closed">Zamknięte (A, B, C, D)</option>
              <option value="open">Otwarte</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="taskCount"> Liczba zadań:</label>
            <input
              type="number"
              id="taskCount"
              name="taskCount"
              value={formData.taskCount}
              onChange={handleChange}
              min="1"
              max="3"
              required
            />
            <small>Maksymalnie 3 zadania</small>
          </div>
        </div>

        {/* ✅ NOWA SEKCJA - Checkbox dla rozwiązań */}
        <div className="form-row">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeSolutions}
                onChange={(e) => setIncludeSolutions(e.target.checked)}
              />
              <span>Pokaż rozwiązania i odpowiedzi</span>
            </label>
            <small>
              {includeSolutions 
                ? '✅ Zadania będą zawierać rozwiązania i poprawne odpowiedzi'
                : '🔒 Zadania bez rozwiązań (idealne do samodzielnej pracy)'}
            </small>
          </div>
        </div>

        {error && (
          <div className="error-message">
             {error}
          </div>
        )}

        {success && tasks.length > 0 && (
          <div className="success-message">
             Wygenerowano {tasks.length} {tasks.length === 1 ? 'zadanie' : 'zadania'}!
            {!includeSolutions && ' (bez rozwiązań)'}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary btn-generate">
          {loading ? ' Generowanie...' : ' Wygeneruj zadania'}
        </button>
      </form>

      {tasks.length > 0 && (
        <div className="tasks-container">
          <div className="tasks-header">
            <h3> Wygenerowane zadania</h3>
            <p>
              Poziom: {formData.difficultyLevel} | Dział: {formData.physicsSubject}
              {!includeSolutions && ' | 🔒 Bez rozwiązań'}
            </p>
          </div>
          {tasks.map((task, index) => (
            <TaskDisplay 
              key={index} 
              task={task} 
              index={index + 1}
              // Backend już usuwa rozwiązania, więc nie musimy przekazywać showSolutions
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskGenerator;