import React, { createContext, useContext, useReducer, useEffect, useState, useMemo, useRef } from 'react';
import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import { createPortal } from 'react-dom';

// --- CONSTANTES DO DOMÍNIO ---
const COLUNAS = ["A Fazer", "Em Progresso", "Concluído"];
const STATUS_DETALHADO = ["Solicitado", "Em Análise", "Aguardando Peças", "Programado", "Em Execução", "Inspeção", "Finalizado"];
const PRIORIDADES = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};
const PEOPLE = Array.from({ length: 30 }, (_, i) => ({
  id: `user-${i + 1}`,
  nome: `Membro ${i + 1}`,
}));
const RETENTION_DAYS = 30;
const LOCAL_STORAGE_KEY = 'kanban_tasks';

// --- LÓGICA DO CONTEXTO (State Management) ---
const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload, updatedAt: new Date().toISOString() } : task
        ),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS':
      return { ...state, filters: { responsibleId: '', status: '', priority: '', tags: '' } };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    filters: { responsibleId: '', status: '', priority: '', tags: '' },
    loading: true,
  });

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];

      if (tasks.length === 0) {
        tasks = [
          { id: 'task-1', title: 'Corrigir vazamento na linha 5', description: 'Vazamento de água identificado próximo ao setor de embalagem.', column: 'A Fazer', status: 'Solicitado', responsible: PEOPLE[0].nome, responsibleId: PEOPLE[0].id, priority: 'alta', dueDate: '2025-09-15T00:00:00.000Z', tags: ['hidráulica', 'urgente'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 'task-2', title: 'Manutenção preventiva motor X', description: 'Realizar lubrificação e troca de filtros conforme plano.', column: 'Em Progresso', status: 'Em Execução', responsible: PEOPLE[2].nome, responsibleId: PEOPLE[2].id, priority: 'media', dueDate: '2025-09-20T00:00:00.000Z', tags: ['mecânica', 'preventiva'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
      }
      
      const retentionDate = new Date();
      retentionDate.setDate(retentionDate.getDate() - RETENTION_DAYS);
      const cleanedTasks = tasks.filter(task => {
        if (task.column === 'Concluído') {
          return new Date(task.updatedAt) > retentionDate;
        }
        return true;
      });

      dispatch({ type: 'LOAD_TASKS', payload: cleanedTasks });
    } catch (error) {
      console.error("Falha ao carregar ou processar tarefas:", error);
      dispatch({ type: 'LOAD_TASKS', payload: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.tasks));
    }
  }, [state.tasks, state.loading]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

const useTasks = () => useContext(TaskContext);

// --- HELPERS ---
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const getPriorityClass = (priority) => ({
  alta: 'border-l-4 border-red-500',
  media: 'border-l-4 border-amber-500',
  baixa: 'border-l-4 border-green-500',
}[priority] || 'border-l-4 border-gray-300');

const getStatusClass = (status) => ({
  'Solicitado': 'bg-gray-200 text-gray-800', 'Em Análise': 'bg-yellow-200 text-yellow-800', 'Aguardando Peças': 'bg-orange-200 text-orange-800', 'Programado': 'bg-blue-200 text-blue-800', 'Em Execução': 'bg-indigo-200 text-indigo-800', 'Inspeção': 'bg-purple-200 text-purple-800', 'Finalizado': 'bg-green-200 text-green-800',
}[status] || 'bg-gray-200 text-gray-800');

const normalizeText = (text) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");


// --- COMPONENTES ---

const Navbar = ({ onOpenModal }) => {
  const { state, dispatch } = useTasks();
  const { filters } = state;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FILTER', payload: { [name]: value } });
  };
  
  const handleClearFilters = () => dispatch({ type: 'CLEAR_FILTERS' });
  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  return (
    <nav className="bg-white shadow-md p-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
      <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
      <div className="flex flex-wrap items-center gap-2">
        <select name="responsibleId" value={filters.responsibleId} onChange={handleFilterChange} className="p-2 border rounded-md bg-gray-50 text-sm"><option value="">Todos Responsáveis</option>{PEOPLE.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}</select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded-md bg-gray-50 text-sm"><option value="">Todos Status</option>{STATUS_DETALHADO.map(s => <option key={s} value={s}>{s}</option>)}</select>
        <select name="priority" value={filters.priority} onChange={handleFilterChange} className="p-2 border rounded-md bg-gray-50 text-sm"><option value="">Todas Prioridades</option>{Object.entries(PRIORIDADES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <input type="text" name="tags" placeholder="Filtrar por tag..." value={filters.tags} onChange={handleFilterChange} className="p-2 border rounded-md text-sm" />
        {hasActiveFilters && <button onClick={handleClearFilters} className="p-2 text-sm text-blue-600 hover:underline">Limpar Filtros</button>}
        <button onClick={() => onOpenModal()} className="ml-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">Nova Tarefa</button>
      </div>
    </nav>
  );
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    visibility: isDragging ? 'hidden' : 'visible',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={setNodeRef} style={style} className={`bg-blue-100 text-gray-800 p-4 mb-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col ${getPriorityClass(task.priority)}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-bold pr-2 cursor-grab flex-grow" {...attributes} {...listeners}>{task.title}</h3>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(prev => !prev)} className="text-gray-500 hover:text-gray-900 p-1 rounded-full flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
              <a href="#" onClick={(e) => { e.preventDefault(); onEdit(task); setMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onDelete(task); setMenuOpen(false); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Excluir</a>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm my-2">{task.description}</p>
      <div className="flex items-center justify-between text-xs mt-3">
        <span className={`px-2 py-1 rounded-full font-semibold ${getStatusClass(task.status)}`}>{task.status}</span>
        <span className="font-semibold">{task.responsible}</span>
      </div>
      <div className="flex flex-wrap gap-1 mt-3">
        {task.tags.map((tag, index) => <span key={index} className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">{tag}</span>)}
      </div>
      <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-blue-200 flex justify-between">
        <span>Prazo: {formatDate(task.dueDate)}</span>
        <span>Criado: {formatDate(task.createdAt)}</span>
      </div>
    </div>
  );
};


const Column = ({ title, tasks, onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: title });
  return (
    <div ref={setNodeRef} className={`bg-gray-800 rounded-lg p-4 w-full md:flex-1 transition-colors duration-300 ${isOver ? 'bg-blue-900' : ''}`}>
      <h2 className="text-lg font-bold text-white mb-4 tracking-wider uppercase">{title} ({tasks.length})</h2>
      <div className="space-y-4 h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {tasks.map(task => <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />)}
        {tasks.length === 0 && <p className="text-sm text-gray-400 text-center mt-8">Nenhuma tarefa aqui.</p>}
      </div>
    </div>
  );
};

const Board = ({ onEdit, onDelete }) => {
  const { state } = useTasks();
  const { tasks, filters } = state;

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const normalizedFilterTags = normalizeText(filters.tags);
      const tagMatch = filters.tags ? task.tags.some(tag => normalizeText(tag).includes(normalizedFilterTags)) : true;
      const responsibleMatch = filters.responsibleId ? task.responsibleId === filters.responsibleId : true;
      const statusMatch = filters.status ? task.status === filters.status : true;
      const priorityMatch = filters.priority ? task.priority === filters.priority : true;
      return tagMatch && responsibleMatch && statusMatch && priorityMatch;
    });
  }, [tasks, filters]);

  return (
    <main className="p-4 md:p-8 bg-gray-200 flex-grow">
      <div className="flex flex-col md:flex-row gap-6">
        {COLUNAS.map(column => <Column key={column} title={column} tasks={filteredTasks.filter(task => task.column === column)} onEdit={onEdit} onDelete={onDelete} />)}
      </div>
    </main>
  );
};

const TaskModal = ({ isOpen, onClose, taskToEdit }) => {
    if (!isOpen) return null;
    const { dispatch } = useTasks();
    const [formData, setFormData] = useState({
        title: taskToEdit?.title || '', description: taskToEdit?.description || '', column: taskToEdit?.column || 'A Fazer', status: taskToEdit?.status || 'Solicitado', responsibleId: taskToEdit?.responsibleId || '', priority: taskToEdit?.priority || 'media', dueDate: taskToEdit?.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '', tags: taskToEdit?.tags?.join(', ') || '',
    });
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => {
        e.preventDefault();
        const responsible = PEOPLE.find(p => p.id === formData.responsibleId)?.nome || '';
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        const taskData = { ...formData, responsible, tags: tagsArray, dueDate: new Date(formData.dueDate).toISOString(), updatedAt: new Date().toISOString() };
        if (taskToEdit) {
            dispatch({ type: 'UPDATE_TASK', payload: { ...taskToEdit, ...taskData } });
        } else {
            dispatch({ type: 'ADD_TASK', payload: { ...taskData, id: crypto.randomUUID(), createdAt: new Date().toISOString() } });
        }
        onClose();
    };
    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg"><h2 className="text-2xl font-bold mb-6">{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</h2><form onSubmit={handleSubmit} className="space-y-4"><input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título da Tarefa" className="w-full p-2 border rounded" required /><textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrição" className="w-full p-2 border rounded"></textarea><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><select name="column" value={formData.column} onChange={handleChange} className="w-full p-2 border rounded">{COLUNAS.map(col => <option key={col} value={col}>{col}</option>)}</select><select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">{STATUS_DETALHADO.map(stat => <option key={stat} value={stat}>{stat}</option>)}</select><select name="responsibleId" value={formData.responsibleId} onChange={handleChange} className="w-full p-2 border rounded" required><option value="">Selecione o Responsável</option>{PEOPLE.map(person => <option key={person.id} value={person.id}>{person.nome}</option>)}</select><select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded">{Object.entries(PRIORIDADES).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></div><input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full p-2 border rounded" required /><input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (separadas por vírgula)" className="w-full p-2 border rounded" /><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button><button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">{taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}</button></div></form></div></div>, document.body
    );
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, task }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm"><h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2><p>Você tem certeza que deseja excluir a tarefa "{task?.title}"?</p><div className="flex justify-end gap-4 mt-6"><button onClick={onClose} className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button><button onClick={onConfirm} className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700">Excluir</button></div></div></div>, document.body
    );
};

export default function App() {
  const { state, dispatch } = useTasks();
  const [activeId, setActiveId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleOpenModal = (task = null) => { setTaskToEdit(task); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setTaskToEdit(null); };
  const handleOpenDeleteModal = (task) => { setTaskToDelete(task); setIsDeleteModalOpen(true); };
  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setTaskToDelete(null); };
  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      dispatch({ type: 'DELETE_TASK', payload: taskToDelete.id });
      handleCloseDeleteModal();
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        const activeTask = active.data.current.task;
        const targetColumn = over.id;
        if (activeTask && activeTask.column !== targetColumn) {
          dispatch({ type: 'UPDATE_TASK', payload: { ...activeTask, column: targetColumn } });
        }
    }
    setActiveId(null);
  };
  
  const activeTask = activeId ? state.tasks.find(t => t.id === activeId) : null;
  
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col h-screen font-sans bg-gray-200">
            <Navbar onOpenModal={handleOpenModal} />
            <Board onEdit={handleOpenModal} onDelete={handleOpenDeleteModal} />
            <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} taskToEdit={taskToEdit} />
            <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleDeleteConfirm} task={taskToDelete} />
        
            {createPortal(
                <DragOverlay>
                    {activeTask ? <TaskCard task={activeTask} /> : null}
                </DragOverlay>,
                document.body
            )}
        </div>
    </DndContext>
  );
}
