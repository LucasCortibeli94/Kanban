# Kanban de Manutenção (MVP)

Kanban Board Online

Kanban simples para um time de manutenção (~30 pessoas), feito com React + Vite + Tailwind CSS.

Sem back‑end por enquanto – os dados são salvos no localStorage.

✨ Funcionalidades atuais

Layout

Navbar: Início, Nova Tarefa, Filtro por Tags, Minhas Tarefas, Tema.

3 colunas fixas: A Fazer, Em Progresso, Concluído.

Cards com status detalhado (pill colorida), tags, responsável, prioridade, datas.

Borda esquerda com cor por prioridade (alta=vermelho, média=âmbar, baixa=verde).

Estado & Persistência

TaskContext com useReducer + localStorage.

Seed inicial de tarefas e hidratação no load.

Limpeza automática: remove tarefas Concluídas com mais de RETENTION_DAYS (padrão 30).

Criação de tarefas

Modal “Nova Tarefa” com título*, descrição, coluna, status detalhado (Solicitado/Em Análise/Aguardando Peças/Programado/Em Execução/Inspeção/Finalizado), responsável (dropdown de ~30 pessoas, salva responsavelId + responsavel), prioridade (baixa/média/alta), prazo (dueDate) e tags.

🧰 Stack

Frontend: React 18, Vite, Tailwind CSS

Estado: Context API + useReducer

Persistência: localStorage (sem backend)

🗂️ Estrutura (simplificada)
src/
  App.jsx               // <TaskProvider> + Navbar/Board/NovaTarefaModal
  main.jsx              // boot React + index.css
  index.css
  components/
    Navbar.jsx
    Board.jsx
    TaskCard.jsx
    NovaTarefaModal.jsx
  context/
    TaskContext.jsx     // reducer, localStorage, retention, listas (PEOPLE, COLUNAS, STATUS, PRIORIDADES)

🚀 Como rodar localmente
1) Pré‑requisitos

Node.js ≥ 18 (recomendado 18 LTS ou 20 LTS).
Verifique com:

node -v
npm -v


Git instalado.

2) Clonar e instalar
git clone <URL-do-repo>
cd kanban-frontend           # ou o nome da pasta do projeto
npm install

3) Rodar em desenvolvimento
npm run dev


Abra a URL que o Vite mostrar (ex.: http://localhost:5173).

4) Build de produção (opcional)
npm run build
npm run preview

🧪 Variáveis de ambiente

Não há variáveis de ambiente nesta fase (sem backend).

🧼 Dados locais / Reset do estado

Os dados ficam no localStorage. Para “zerar” o app:

Abra o DevTools do navegador → Application → Local Storage.

Apague a chave usada pelo app (ex.: kanban.tasks ou similar).

Recarregue a página (o seed é refeito).

O período de retenção de concluídas é configurável em TaskContext.jsx via RETENTION_DAYS.

🧭 Domínio (constantes no contexto)

COLUNAS = ["A Fazer","Em Progresso","Concluído"]

STATUS_DETALHADO = ["Solicitado","Em Análise","Aguardando Peças","Programado","Em Execução","Inspeção","Finalizado"]

PRIORIDADES = ["baixa","media","alta"]

PEOPLE = [{ id, nome }, ...] // ~30 pessoas

RETENTION_DAYS = 30

✅ Próximas entregas (priorizadas)

Editar/Excluir tarefa

Menu “⋯” no TaskCard → Editar (reaproveita o modal) / Excluir (confirmação).

Filtros na Navbar

Por tags, responsável, status detalhado e prioridade (estado global; UI com selects/chips).

Drag & Drop

Usar @dnd-kit/core para mover cards entre/ dentro de colunas; atualizar coluna e atualizadoEm.

Extras (opcional curto prazo):

WIP limit por coluna (ex.: 5 em Em Progresso) com aviso visual.

Ordenação por prioridade, prazo ou data de criação (toggle no topo da coluna).

Futuro (backend):

Supabase (Auth + Postgres + RLS) ou Node/Express + Postgres.

Perfis (admin/user), e‑mails (atribuição, Aguardando Peças, atraso, digest).

Exportação SAP PM: começar por CSV (definir layout de campos).

👩‍💻 Como contribuir
Fluxo básico (feature branch)
# criar uma branch a partir da main
git checkout -b feature/editar-excluir-task

# codar, commitar
git add .
git commit -m "feat(task): editar e excluir no card com modal e confirm"

# enviar e abrir PR
git push -u origin feature/editar-excluir-task

Convenção de commits (sugerida)

feat: nova funcionalidade

fix: correção de bug

refactor: refatoração sem mudança de comportamento

chore: tarefas diversas (build, deps)

docs: documentação/README

style: formatação (semântico, sem alterar lógica)

Padrões de código

Componentes funcionais + hooks.

Estado global apenas no contexto (TaskContext).

Estilos com Tailwind; evitar CSS avulso.

Tipos/contratos dos objetos de tarefa padronizados no contexto.

🙋‍♂️ Dúvidas comuns

1) Não aparece nada ao abrir o app.
Verifique o Node (≥18), rode npm install novamente e cheque o console do navegador. Zere o localStorage e recarregue.

2) O Tailwind não aplicou estilos.
Confirme que o projeto está com index.css importado em main.jsx e que o Vite está rodando sem erros.

3) Quero mudar a lista de responsáveis.
Edite PEOPLE em TaskContext.jsx (mantendo id e nome).

4) Quero ajustar o prazo de retenção das concluídas.
Altere RETENTION_DAYS em TaskContext.jsx.

🔒 Permissões de acesso

Se o repo for privado, o colaborador precisa ser convidado em Settings → Collaborators (ou via organização) e aceitar o convite para clonar.

📄 Licença

Defina aqui (ex.: MIT) se aplicável.

Anexos técnicos (para quem vai implementar os próximos passos)

Editar/Excluir

TaskCard.jsx: adicionar ícone/menu “⋯” → aciona openEditModal(task) ou confirmDelete(task.id).

NovaTarefaModal.jsx: aceitar mode="create" | "edit" e initialValues.

TaskContext.jsx: criar ações UPDATE_TASK e DELETE_TASK.

Filtros

Navbar.jsx: inputs (selects/chips) → estado global de filtros no contexto.

Board.jsx: aplicar filtros antes do split por coluna.

Drag & Drop

Instalar @dnd-kit/core e envolver Board com DndContext.

TaskCard como Draggable, colunas como Droppable.

No drop: atualizar task.coluna e task.atualizadoEm.
