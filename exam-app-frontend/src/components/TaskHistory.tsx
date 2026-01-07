import { useState, useEffect } from 'react';
import { generatedTasksApi } from '../services/api';
import type { GeneratedTask } from '../types';
import TaskHistoryItem from './TaskHistoryItem';
import ConfirmModal from './ConfirmModal';

function TaskHistory() {
  const [tasks, setTasks] = useState<GeneratedTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // SFWP
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  
  // ✅ FILTRY
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const pageSize = 10;

  useEffect(() => {
    loadTasks();
  }, [page, searchQuery, sortBy, sortOrder, levelFilter, subjectFilter, dateFilter]); // ✅ Dodane filtry

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await generatedTasksApi.getAll(
        page, 
        pageSize,
        searchQuery,
        sortBy,
        sortOrder,
        levelFilter,    // ✅ F
        subjectFilter,  // ✅ F
        dateFilter      // ✅ F
      );
      setTasks(response.tasks);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (err: any) {
      setError('Nie udało się pobrać historii zadań');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadTasks();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLevelFilter('');
    setSubjectFilter('');
    setDateFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const handleDeleteClick = (id: number) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete === null) return;

    try {
      await generatedTasksApi.delete(taskToDelete);
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      setTotalCount(totalCount - 1);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (err: any) {
      setError('Nie udało się usunąć zadania');
      console.error(err);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleExportPdf = async (id: number) => {
    try {
      const blob = await generatedTasksApi.exportPdf(id, true);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zadanie-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('PDF export error:', err);
    }
  };

  if (loading) {
    return (
      <div className="task-history">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Ładowanie historii...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-history">
      <div className="history-header">
        <h2>📚 Historia wygenerowanych zadań</h2>
        <p className="history-subtitle">
          Łącznie wygenerowano: <strong>{totalCount}</strong> {totalCount === 1 ? 'zadanie' : 'zadań'}
        </p>
      </div>

      {/* ✅ PEŁNY SFWP */}
      <div className="sfwp-controls">
        {/* W - WYSZUKIWANIE */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="🔍 Szukaj po temacie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-search">
              Szukaj
            </button>
          </form>
        </div>

        {/* F - FILTROWANIE */}
        <div className="filter-section">
          <label>📊 Filtry:</label>
          
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setPage(1);
            }}
            className="filter-select"
          >
            <option value="">Wszystkie poziomy</option>
            <option value="podstawowy">Podstawowy</option>
            <option value="rozszerzony">Rozszerzony</option>
          </select>

          <select
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value);
              setPage(1);
            }}
            className="filter-select"
          >
            <option value="">Wszystkie działy</option>
            <option value="mechanika">Mechanika</option>
            <option value="dynamika">Dynamika</option>
            <option value="elektryczność">Elektryczność</option>
            <option value="optyka">Optyka</option>
            <option value="termodynamika">Termodynamika</option>
            <option value="fizyka nowoczesna">Fizyka nowoczesna</option>
            <option value="fale">Fale</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            className="filter-select"
          >
            <option value="">Cały czas</option>
            <option value="today">Dzisiaj</option>
            <option value="week">Ostatni tydzień</option>
            <option value="month">Ostatni miesiąc</option>
          </select>
        </div>

        {/* S - SORTOWANIE */}
        <div className="sort-section">
          <label>🔀 Sortuj:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="sort-select"
          >
            <option value="createdAt">Data</option>
            <option value="prompt">Temat</option>
          </select>

          <button
            onClick={() => {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              setPage(1);
            }}
            className="btn-sort-order"
            title={sortOrder === 'asc' ? 'Rosnąco' : 'Malejąco'}
          >
            {sortOrder === 'asc' ? '⬆️' : '⬇️'}
          </button>
        </div>

        {/* Przycisk czyszczenia */}
        {(searchQuery || levelFilter || subjectFilter || dateFilter) && (
          <button onClick={clearFilters} className="btn-clear-all">
            🔄 Wyczyść filtry
          </button>
        )}
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>📭 Nie znaleziono zadań spełniających kryteria.</p>
          <button onClick={clearFilters} className="btn-secondary">
            Wyczyść filtry
          </button>
        </div>
      ) : (
        <>
          <div className="tasks-list">
            {tasks.map((task) => (
              <TaskHistoryItem
                key={task.id}
                task={task}
                onDelete={handleDeleteClick}
                onExportPdf={handleExportPdf}
              />
            ))}
          </div>

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
        </>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="🗑️ Usuwanie zadania"
        message="Czy na pewno chcesz usunąć to zadanie? Tej operacji nie można cofnąć."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default TaskHistory;
