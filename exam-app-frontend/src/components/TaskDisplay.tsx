import type { ExamTask } from '../types';

interface TaskDisplayProps {
  task: ExamTask;
  index: number;
}

function TaskDisplay({ task, index }: TaskDisplayProps) {
  const getAnswerClass = (answer: string) => {
    // ✅ Tylko podświetl jeśli correctAnswer istnieje
    if (!task.correctAnswer) return '';
    
    const answerLetter = answer.charAt(0);
    return answerLetter === task.correctAnswer ? 'correct-answer' : '';
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h4>📝 Zadanie {index}</h4>
      </div>

      <div className="task-content">
        <p>{task.content}</p>
      </div>

      {task.answers && task.answers.length > 0 && (
        <div className="task-answers">
          <h5>Odpowiedzi:</h5>
          <ul>
            {task.answers.map((answer, i) => (
              <li key={i} className={getAnswerClass(answer)}>
                {answer}
              </li>
            ))}
          </ul>

          {/* ✅ Pokaż poprawną odpowiedź tylko jeśli istnieje */}
          {task.correctAnswer && (
            <p className="correct-indicator">
              ✓ Poprawna odpowiedź: <strong>{task.correctAnswer}</strong>
            </p>
          )}
        </div>
      )}

      {/* ✅ Pokaż rozwiązanie tylko jeśli istnieje */}
      {task.solution && (
        <div className="task-solution">
          <h5>💡 Rozwiązanie:</h5>
          <div className="solution-content">
            <p>{task.solution}</p>
          </div>
        </div>
      )}

      {/* ✅ Jeśli brak rozwiązań, pokaż info */}
      {!task.solution && !task.correctAnswer && (
        <div className="no-solution-info">
          <p>🔒 Zadanie bez rozwiązania - idealne do samodzielnej pracy!</p>
        </div>
      )}

    
    </div>
  );
}

export default TaskDisplay;