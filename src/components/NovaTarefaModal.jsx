import React, { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function NovaTarefaModal() {
  const { ui, closeModal, addTask, COLUNAS, STATUS_DETALHADO, PRIORIDADES, PEOPLE } = useTasks();
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    coluna: COLUNAS[0],
    statusDetalhado: "",
    tagsText: "",
    responsavelId: "",
    priority: "baixa",
    dueDate: "", // yyyy-mm-dd
  });

  if (!ui.isModalOpen) return null;

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    const tags = form.tagsText.split(",");
    const dueTs = form.dueDate ? new Date(form.dueDate).getTime() : undefined;

    addTask({
      titulo: form.titulo,
      descricao: form.descricao,
      coluna: form.coluna,
      statusDetalhado: form.statusDetalhado,
      tags,
      responsavelId: form.responsavelId || undefined,
      priority: form.priority,
      dueDate: dueTs,
    });

    closeModal();
    setForm({
      titulo: "",
      descricao: "",
      coluna: COLUNAS[0],
      statusDetalhado: "",
      tagsText: "",
      responsavelId: "",
      priority: "baixa",
      dueDate: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Nova Tarefa</h2>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring"
              placeholder="Ex.: Trocar rolamento da bomba"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring"
              rows={3}
              placeholder="Detalhes da tarefa..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Coluna</label>
              <select name="coluna" value={form.coluna} onChange={onChange} className="w-full border rounded-md px-3 py-2">
                {COLUNAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status detalhado</label>
              <select name="statusDetalhado" value={form.statusDetalhado} onChange={onChange} className="w-full border rounded-md px-3 py-2">
                <option value="">—</option>
                {STATUS_DETALHADO.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Responsável</label>
              <select name="responsavelId" value={form.responsavelId} onChange={onChange} className="w-full border rounded-md px-3 py-2">
                <option value="">—</option>
                {PEOPLE.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prioridade</label>
              <select name="priority" value={form.priority} onChange={onChange} className="w-full border rounded-md px-3 py-2">
                {PRIORIDADES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prazo (due date)</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (separadas por vírgula)</label>
            <input
              name="tagsText"
              value={form.tagsText}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="elétrica, urgente"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={closeModal} className="px-3 py-2 rounded-md border">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
