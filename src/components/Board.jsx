import React from 'react';
import TaskCard from './TaskCard';
import { useTasks } from '../context/TaskContext';

const Board = () => {
  const { tasks, COLUNAS } = useTasks();

  return (
    <section className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUNAS.map((coluna) => (
        <div key={coluna} className="bg-slate-900 text-white rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">{coluna}</h2>
          <div>
            {tasks.filter(t => t.coluna === coluna).length === 0 && (
              <p className="text-sm text-slate-300">Sem tarefas.</p>
            )}
            {tasks
              .filter((t) => t.coluna === coluna)
              .map((t) => <TaskCard key={t.id} tarefa={t} />)}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Board;

