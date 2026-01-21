import { useState, useEffect } from 'react';
import { generatedTasksApi } from '../services/api';
import type { GeneratedTask } from '../types';


interface ParsedTask {
  content: string;
  answers: string[];
  correctAnswer: string;
  solution: string;
  source: string;
}

interface Filters {
  level?: string;
  subject?: string;
  dateFilter?: string;
}

const TaskHistory: React.FC = () => {
  const [tasks, setTasks] = useState<GeneratedTask[]>([]);  // ← Już jest []
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search and Sort
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'prompt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filters
  const [filters, setFilters] = useState<Filters>({});
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [page, pageSize, search, sortBy, sortOrder, filters]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await generatedTasksApi.getAll(
        page,
        pageSize,
        search || undefined,
        sortBy,
        sortOrder,
        filters.level || undefined,
        filters.subject || undefined,
        filters.dateFilter || undefined
      );

      console.log('📦 Pełna odpowiedź z API:', response);
      
      // Backend zwraca 'tasks', nie 'items'
      setTasks(response.tasks || response.items || []);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
      
    } catch (err: any) {
      console.error('❌ Błąd pobierania historii:', err);
      setError(err.response?.data?.message || 'Nie udało się pobrać historii zadań');
    } finally {
      setLoading(false);
    }
  };

  const parseGeneratedText = (generatedText: string): ParsedTask[] => {
    try {
      const parsed = JSON.parse(generatedText);
      return parsed.tasks || [];
    } catch {
      return [];
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value || undefined,
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearch('');
    setPage(1);
  };

  const toggleTaskDetails = (taskId: number) => {
    setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
  };

  const handleDelete = async (taskId: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      return;
    }

    try {
      await generatedTasksApi.delete(taskId);
      fetchTasks();
    } catch (err: any) {
      console.error('❌ Błąd usuwania:', err);
      alert(err.response?.data?.message || 'Nie udało się usunąć zadania');
    }
  };

  const handleExportPdf = async (taskId: number) => {
    try {
      const blob = await generatedTasksApi.exportPdf(taskId, true);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zadanie_${taskId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('❌ Błąd eksportu PDF:', err);
      alert(err.response?.data?.message || 'Nie udało się wygenerować PDF');
    }
  };

  return (
    <div className="task-history">
      <div className="task-history-header">
        <h1>Historia Wygenerowanych Zadań</h1>
        <p className="task-count">Znaleziono: {totalCount} zadań</p>
      </div>

      {/* Filters and Search */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Szukaj w promptach i zadaniach..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={filters.level || ''}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="filter-select"
          >
            <option value="">Wszystkie poziomy</option>
            <option value="podstawowy">Podstawowy</option>
            <option value="rozszerzony">Rozszerzony</option>
          </select>

          <select
            value={filters.subject || ''}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            className="filter-select"
          >
            <option value="">Wszystkie tematy</option>
            <option value="mechanika">Mechanika</option>
            <option value="kinematyka">Kinematyka</option>
            <option value="dynamika">Dynamika</option>
            <option value="termodynamika">Termodynamika</option>
            <option value="elektryczność">Elektryczność</option>
            <option value="grawitacja">Grawitacja</option>
          </select>

          <select
            value={filters.dateFilter || ''}
            onChange={(e) => handleFilterChange('dateFilter', e.target.value)}
            className="filter-select"
          >
            <option value="">Cały okres</option>
            <option value="today">Dzisiaj</option>
            <option value="week">Ostatni tydzień</option>
            <option value="month">Ostatni miesiąc</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'prompt')}
            className="filter-select"
          >
            <option value="createdAt">Data utworzenia</option>
            <option value="prompt">Prompt</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="filter-select"
          >
            <option value="desc">Malejąco</option>
            <option value="asc">Rosnąco</option>
          </select>

          <button onClick={clearFilters} className="clear-btn">
            Wyczyść filtry
          </button>
        </div>

        <div className="page-size-control">
          <label>
            Wyników na stronę:
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="page-size-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="loading">Ładowanie...</div>}

      {/* Error State */}
      {error && <div className="error">Błąd: {error}</div>}

      {/* Tasks List */}
      {!loading && !error && (
        <>
          <div className="tasks-list">
            {!tasks || tasks.length === 0 ? (
              <div className="no-tasks">Brak zadań do wyświetlenia</div>
            ) : (
              tasks.map((generatedTask) => {
                const parsedTasks = parseGeneratedText(generatedTask.generatedText);
                const isExpanded = selectedTaskId === generatedTask.id;

                return (
                  <div key={generatedTask.id} className="task-card">
                    <div className="task-card-header" onClick={() => toggleTaskDetails(generatedTask.id)}>
                      <div className="task-info">
                        <h3 className="task-prompt">{generatedTask.prompt}</h3>
                        <p className="task-date">{formatDate(generatedTask.createdAt)}</p>
                        <p className="task-count-badge">
                          Liczba zadań: {parsedTasks.length}
                        </p>
                      </div>
                      <div className="task-actions">
                        <button
                          className="btn-action btn-pdf"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportPdf(generatedTask.id);
                          }}
                          title="Eksportuj do PDF"
                        >
                          📄 PDF
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(generatedTask.id);
                          }}
                          title="Usuń zadanie"
                        >
                          🗑️
                        </button>
                        <button className="expand-btn">
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="task-details">
                        {parsedTasks.map((task, index) => (
                          <div key={index} className="task-item">
                            <div className="task-content">
                              <h4>Treść zadania {index + 1}:</h4>
                              <p>{task.content}</p>
                            </div>

                            <div className="task-answers">
                              <h4>Odpowiedzi:</h4>
                              <ul>
                                {task.answers.map((answer, ansIndex) => (
                                  <li
                                    key={ansIndex}
                                    className={
                                      answer.startsWith(task.correctAnswer)
                                        ? 'correct-answer'
                                        : ''
                                    }
                                  >
                                    {answer}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="task-solution">
                              <h4>Rozwiązanie:</h4>
                              <p>{task.solution}</p>
                            </div>

                            <div className="task-source">
                              <strong>Źródło:</strong> {task.source}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="pagination-btn"
              >
                ««
              </button>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="pagination-btn"
              >
                «
              </button>

              <span className="page-info">
                Strona {page} z {totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                »
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                »»
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskHistory;