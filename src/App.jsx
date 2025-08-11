import React from 'react';
import Navbar from './components/Navbar';
import Board from './components/Board';
import NovaTarefaModal from './components/NovaTarefaModal';
import { TaskProvider } from './context/TaskContext';

const App = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Board />
        <NovaTarefaModal />
      </div>
    </TaskProvider>
  );
};

export default App;
