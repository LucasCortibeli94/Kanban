import React from 'react';
import { useTasks } from '../context/TaskContext';

const Navbar = () => {
  const { openModal } = useTasks();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-700">Kanban Board</h1>
      <ul className="flex space-x-6 text-sm font-medium text-gray-700">
        <li><a href="#">Início</a></li>
        <li><button onClick={openModal}>Nova Tarefa</button></li>
        <li><a href="#">Filtro por Tags</a></li>
        <li><a href="#">Minhas Tarefas</a></li>
        <li><a href="#">Tema</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
