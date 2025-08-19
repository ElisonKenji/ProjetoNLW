# Projeto Rocketseat - NLW Agents Server

Este projeto foi desenvolvido durante a trilha NLW da Rocketseat e consiste em um servidor Node.js utilizando TypeScript para gerenciar salas, perguntas e áudios em tempo real.

> **Aviso:** Este ainda não é o projeto final. Novas funcionalidades, melhorias e ajustes ainda serão realizados ao longo do desenvolvimento.

## Funcionalidades

- **Criação de salas:** Permite criar novas salas para interação entre usuários.
- **Envio de perguntas:** Usuários podem enviar perguntas para as salas.
- **Upload de áudios:** Suporte ao upload de áudios em chunks para transcrição e análise.
- **Integração com IA:** Utiliza serviços de IA (como Gemini) para processar e responder perguntas.
- **Banco de dados relacional:** Utiliza Drizzle ORM para manipulação do banco de dados e controle de migrações.

## Estrutura do Projeto

- `src/db/`: Configuração do banco de dados, seeds, migrações e schemas.
- `src/http/routes/`: Rotas HTTP para criação de salas, perguntas, upload de áudio, etc.
- `src/services/`: Serviços de integração, como o Gemini.
- `src/env.ts`: Configuração de variáveis de ambiente.
- `src/server.ts`: Inicialização do servidor.

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure as variáveis de ambiente em `.env`.
3. Execute as migrações do banco de dados:
   ```bash
   npm run migrate
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Observações

- O projeto utiliza Docker para facilitar o setup do banco de dados.
- As rotas estão documentadas no arquivo `client.http`.

---
