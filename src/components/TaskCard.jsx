import React from "react";

const priorityBorder = (p) => {
  switch (p) {
    case "alta":
      return "border-red-500";
    case "media":
      return "border-amber-500";
    default:
      return "border-green-500";
  }
};

const statusPill = (s) => {
  const base = "text-xs font-medium px-2 py-0.5 rounded";
  switch (s) {
    case "Aguardando Peças":
      return `${base} bg-blue-200 text-blue-800`;
    case "Em Execução":
      return `${base} bg-purple-200 text-purple-800`;
    case "Inspeção":
      return `${base} bg-yellow-200 text-yellow-800`;
    case "Programado":
      return `${base} bg-teal-200 text-teal-800`;
    case "Em Análise":
      return `${base} bg-gray-200 text-gray-800`;
    case "Solicitado":
      return `${base} bg-slate-200 text-slate-800`;
    case "Finalizado":
      return `${base} bg-green-200 text-green-800`;
    default:
      return `${base} bg-slate-200 text-slate-800`;
  }
};

const fmtDate = (ts) => new Date(ts).toLocaleDateString();

const TaskCard = ({ tarefa }) => {
  return (
    <div className={`bg-blue-100 p-4 rounded-md shadow-sm mb-3 border-l-4 ${priorityBorder(tarefa.priority)}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">{tarefa.titulo}</h3>
        {tarefa.priority && (
          <span className="text-[11px] uppercase text-gray-600">{tarefa.priority}</span>
        )}
      </div>

      {tarefa.descricao && <p className="text-sm text-gray-700">{tarefa.descricao}</p>}

      {tarefa.statusDetalhado && (
        <div className="mt-1">
          <span className="text-sm text-gray-600 font-medium mr-1">Status:</span>
          <span className={statusPill(tarefa.statusDetalhado)}>{tarefa.statusDetalhado}</span>
        </div>
      )}

      {!!tarefa.tags?.length && (
        <div className="mt-1 flex flex-wrap gap-1">
          {tarefa.tags.map((tag, i) => (
            <span key={i} className="bg-blue-200 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {(tarefa.responsavel || tarefa.responsavelId) && (
        <div className="mt-1 text-sm text-gray-600">
          <span className="font-medium">Responsável:</span> {tarefa.responsavel}
        </div>
      )}

      <div className="mt-1 text-xs text-gray-500">
        Criado em: {fmtDate(tarefa.criadoEm)}
        {tarefa.dueDate && <> • Prazo: <span className="font-medium">{fmtDate(tarefa.dueDate)}</span></>}
      </div>
    </div>
  );
};

export default TaskCard;
