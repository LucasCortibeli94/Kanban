Kanban Board Online - Gestão de Manutenção
Este é o repositório do projeto "Kanban Board Online", uma plataforma de software desenvolvida como solução para o gerenciamento de fluxo de trabalho em equipes de manutenção industrial.

🎯 Objetivo
O objetivo é criar uma ferramenta visual, intuitiva e escalável que substitua métodos tradicionais (como planilhas ou quadros físicos), otimizando a comunicação, o rastreamento de tarefas e a eficiência operacional de uma equipe.

trạng thái do Projeto
O projeto encontra-se no estágio de Protótipo Funcional de Front-end (MVP). Todas as funcionalidades principais da interface do usuário estão implementadas e são funcionais, com os dados sendo salvos localmente no navegador (localStorage) para fins de demonstração e teste.

🛠️ Stack Tecnológico
Framework Front-end: React

Build Tool: Vite

Estilização: Tailwind CSS

Drag and Drop: DND Kit

🚀 Como Rodar o Projeto Localmente
Para executar este projeto em sua máquina, siga os passos abaixo:

Clone o repositório:

git clone [https://github.com/LucasCortibeli94/Kanban.git](https://github.com/LucasCortibeli94/Kanban.git)

Navegue até a pasta do projeto:

cd Kanban

Instale as dependências:

npm install

Inicie o servidor de desenvolvimento:

npm run dev

Abra seu navegador e acesse http://localhost:5173 (ou a porta indicada no terminal).

✨ Funcionalidades Atuais
Visualização Kanban: Quadro com 3 colunas: A Fazer, Em Progresso e Concluído.

Gerenciamento de Tarefas (CRUD):

Criação de novas tarefas através de um modal.

Edição de qualquer informação da tarefa.

Exclusão de tarefas com confirmação.

Drag and Drop: Arraste e solte tarefas entre as colunas para atualizar o status.

Filtros Dinâmicos: Filtre tarefas por responsável, status, prioridade ou tags.

Persistência Local: As tarefas são salvas no navegador, então você não as perde ao recarregar a página.

🗺️ Próximos Passos
Ordenação de Tarefas: Implementar controles para ordenar tarefas dentro das colunas.

Desenvolvimento do Back-end: Migrar do localStorage para um banco de dados real com uma API.

Autenticação de Usuários: Criar sistema de login e perfis.

Este projeto está sendo desenvolvido como parte de um trabalho acadêmico.
