import { useState } from 'react';
import type { GeneratedTask, ParsedTask } from '../types';

interface TaskHistoryItemProps {
  task: GeneratedTask;
  onDelete: (id: number) => void;
  onExportPdf: (id: number) => void;
}

function TaskHistoryItem({ task, onDelete, onExportPdf }: TaskHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const parseGeneratedText = (text: string): ParsedTask[] => {
    try {
      const parsed = JSON.parse(text);
      return parsed.tasks || [];
    } catch {
      return [];
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parsedTasks = parseGeneratedText(task.generatedText);

  return (
    <div className="history-item">
      <div className="history-item-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="history-item-info">
          <h4>📝 {task.prompt}</h4>
          <p className="history-item-meta">
            🕒 {formatDate(task.createdAt)} | 📊 {parsedTasks.length} {parsedTasks.length === 1 ? 'zadanie' : 'zadań'}
          </p>
        </div>
        <div className="history-item-actions">
          <button
            className="btn-icon btn-pdf"
            onClick={(e) => {
              e.stopPropagation();
              onExportPdf(task.id);
            }}
            title="Eksportuj do PDF"
          >
            📄 PDF
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            title="Usuń"
          >
            🗑️ Usuń
          </button>
          <button className="btn-icon btn-expand">
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="history-item-content">
          {parsedTasks.map((parsedTask, index) => (
            <div key={index} className="parsed-task">
              <h5>📝 Zadanie {index + 1}</h5>
              <div className="parsed-task-content">
                <p><strong>Treść:</strong></p>
                <p>{parsedTask.content}</p>
              </div>

              {parsedTask.answers && (
                <div className="parsed-task-answers">
                  <p><strong>📋 Odpowiedzi:</strong></p>
                  <ul>
                    {parsedTask.answers.map((answer, i) => (
                      <li key={i} className={answer.startsWith(parsedTask.correctAnswer) ? 'correct' : ''}>
                        {answer}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {parsedTask.solution && (
                <div className="parsed-task-solution">
                  <p><strong>💡 Rozwiązanie:</strong></p>
                  <p>{parsedTask.solution}</p>
                </div>
              )}

              {parsedTask.source && (
                <p className="parsed-task-source">
                  <small>📚 {parsedTask.source}</small>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskHistoryItem;