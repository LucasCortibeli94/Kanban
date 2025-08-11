import React, { createContext, useContext, useEffect, useReducer } from "react";

// === Configurações do time / negócio ===
export const PEOPLE = [
  { id: "u-joao", nome: "João" },
  { id: "u-maria", nome: "Maria" },
  { id: "u-carlos", nome: "Carlos" },
  { id: "u-ana", nome: "Ana" },
  { id: "u-paulo", nome: "Paulo" },
  { id: "u-fernanda", nome: "Fernanda" },
  { id: "u-lucas", nome: "Lucas" },
  { id: "u-roberto", nome: "Roberto" },
  // ... complete até ~30 pessoas
];

export const COLUNAS = ["A Fazer", "Em Progresso", "Concluído"];

export const STATUS_DETALHADO = [
  "Solicitado",
  "Em Análise",
  "Aguardando Peças",
  "Programado",
  "Em Execução",
  "Inspeção",
  "Finalizado",
];

export const PRIORIDADES = ["baixa", "media", "alta"];

// Concluídas serão descartadas após X dias
const RETENTION_DAYS = 30;
const ms = (d) => d * 24 * 60 * 60 * 1000;
const cutoffTs = () => Date.now() - ms(RETENTION_DAYS);

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  ui: { isModalOpen: false },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case "MOVE_TASK": {
      const { id, coluna } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, coluna, atualizadoEm: Date.now() } : t
        ),
      };
    }
    case "OPEN_MODAL":
      return { ...state, ui: { ...state.ui, isModalOpen: true } };
    case "CLOSE_MODAL":
      return { ...state, ui: { ...state.ui, isModalOpen: false } };
    default:
      return state;
  }
}

const getPersonName = (id) => PEOPLE.find((p) => p.id === id)?.nome || "";

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hidratar do localStorage com limpeza de concluídas antigas
  useEffect(() => {
    const raw = localStorage.getItem("kanban_tasks");
    let loaded = [];
    if (raw) {
      try {
        loaded = JSON.parse(raw);
      } catch {}
    } else {
      // seed inicial
      loaded = [
        {
          id: `${Date.now()}`,
          titulo: "Trocar servo motor",
          descricao: "necessário trocar o motor",
          coluna: "Em Progresso",
          statusDetalhado: "Aguardando Peças",
          tags: ["engenharia", "urgente"],
          responsavelId: "u-joao",
          responsavel: getPersonName("u-joao"),
          priority: "media",
          dueDate: undefined,
          criadoEm: Date.now(),
          atualizadoEm: Date.now(),
        },
      ];
    }

    // limpeza (retention) de concluídas antigas
    const cut = cutoffTs();
    const cleaned = loaded.filter(
      (t) => !(t.coluna === "Concluído" && (t.atualizadoEm ?? t.criadoEm) < cut)
    );
    dispatch({ type: "SET_TASKS", payload: cleaned });
  }, []);

  // Persistir no localStorage
  useEffect(() => {
    localStorage.setItem("kanban_tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  // Helpers UI
  const openModal = () => dispatch({ type: "OPEN_MODAL" });
  const closeModal = () => dispatch({ type: "CLOSE_MODAL" });

  // Criar task
  const addTask = (data) => {
    const respNome = data.responsavelId ? getPersonName(data.responsavelId) : (data.responsavel || "");
    const task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      titulo: data.titulo.trim(),
      descricao: data.descricao?.trim() || "",
      coluna: data.coluna,
      statusDetalhado: data.statusDetalhado || "",
      tags: (data.tags || []).map((t) => t.trim()).filter(Boolean),
      responsavelId: data.responsavelId || undefined,
      responsavel: respNome,
      priority: data.priority || "baixa",
      dueDate: data.dueDate || undefined,
      criadoEm: Date.now(),
      atualizadoEm: Date.now(),
    };
    dispatch({ type: "ADD_TASK", payload: task });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        ui: state.ui,
        openModal,
        closeModal,
        addTask,
        COLUNAS,
        STATUS_DETALHADO,
        PRIORIDADES,
        PEOPLE, // para dropdown
        dispatch,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks deve ser usado dentro de <TaskProvider />");
  return ctx;
};
