import type { ExamTask } from '../types';

interface TaskDisplayProps {
  task: ExamTask;
  index: number;
}

function TaskDisplay({ task, index }: TaskDisplayProps) {
  const getAnswerClass = (answer: string) => {
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
          <p className="correct-indicator">
            ✅ Poprawna odpowiedź: <strong>{task.correctAnswer}</strong>
          </p>
        </div>
      )}

      <div className="task-solution">
        <h5>💡 Rozwiązanie:</h5>
        <div className="solution-content">
          <p>{task.solution}</p>
        </div>
      </div>

      <div className="task-meta">
        <small>📚 {task.source}</small>
      </div>
    </div>
  );
}

export default TaskDisplay;