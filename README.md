# README: Desafio Frejen

Este README fornece as instruções para a inicialização e uso da aplicação Frejen, que é minha resposta ao desafio técnico.
A aplicação é composta por um frontend, um backend e uma base de dados MySQL.


## Requisitos

- Git
- Docker e Docker Compose (para execução com Docker)
- Node.js (apenas se optar por executar sem Docker)
- MySQL (apenas se optar por executar sem Docker)

## Início Rápido (com Docker)

1. Clone o repositório:

    ```bash
    git clone <url-do-repositorio>
    cd <nome-do-repositorio>
    ```

2. Inicie a aplicação com Docker Compose:

    ```bash
    docker-compose up --build
    ```

3. Acesse a aplicação:

    - **Frontend**: [http://localhost:8080](http://localhost:8080)
    - **Backend API**: [http://localhost:3001](http://localhost:3001)
    - **Documentação Swagger**: [http://localhost:3001/docs](http://localhost:3001/docs)

## Estrutura da Aplicação

A aplicação está dividida em duas partes principais:

- **Frontend (frejen-front)**: Interface de usuário construída com Next.js
- **Backend (frejen-back)**: API REST construída com Node.js
- **Banco de Dados**: MySQL 8.0

## Configuração Inicial

Após a execução do Docker e a inicialização da aplicação, uma conta de administrador foi criada automaticamente com as seguintes credenciais:

- **Email**: admin@example.com
- **Senha**: superpass

Essa conta pode ser usada para acessar a aplicação e realizar as primeiras configurações ou testes.

---

## Configuração do Ambiente

### Utilizando Docker (Recomendado)

Quando executado com Docker, todas as variáveis de ambiente necessárias já estão configuradas no arquivo `docker-compose.yml`. Não é necessária nenhuma configuração adicional.

### Executando sem Docker

Se preferir executar a aplicação sem Docker, siga os passos abaixo:

#### Para o Backend:

1. Navegue até a pasta do backend:

    ```bash
    cd frejen-back
    ```

2. Crie um arquivo de ambiente (`.env`, `.env.prod` ou `.env.dev`) baseado no arquivo `.env.example`

3. Instale as dependências:

    ```bash
    npm install
    ```

4. Construa a aplicação:

    ```bash
    npm run build
    ```

5. Inicie o servidor:

    ```bash
    npm run start
    ```

#### Para o Frontend:

1. Navegue até a pasta do frontend:

    ```bash
    cd frejen-front
    ```

2. Crie um arquivo `.env` baseado no arquivo `.env.example`

3. Instale as dependências:

    ```bash
    npm install
    ```

4. Construa a aplicação:

    ```bash
    npm run build
    ```

5. Inicie o servidor:

    ```bash
    npm run start
    ```

## API Documentation

A documentação completa da API está disponível através do Swagger UI em: [http://localhost:3001/docs](http://localhost:3001/docs)

Esta documentação contém todos os endpoints disponíveis, parâmetros necessários, e exemplos de requisições e respostas.

![Imagem da Página que Possui a Documentação Swagger da Aplicação](<Captura de tela 2025-04-21 115841.png>)

## Variáveis de Ambiente

As configurações disponíveis para personalização podem ser encontradas em:

- **Frontend**: `frejen-front/.env.example`
- **Backend**: `frejen-back/.env.example`

## Solução de Problemas

Se encontrar problemas durante a inicialização com Docker:

1. Certifique-se de que as portas **8080** (frontend), **3001** (backend) e **3307** (MySQL) estão disponíveis.

2. Se necessário, limpe os contêineres Docker existentes:

    ```bash
    docker-compose down -v
    docker-compose up --build
    ```

3. Verifique os logs para mais detalhes:

    ```bash
    docker-compose logs backend
    docker-compose logs frontend
    docker-compose logs db
    ```

## Capturas de Ecrã do Frontend

Aqui estão algumas capturas de ecrã do frontend da aplicação:

1. Ecrã inicial da aplicação (página de bilhetes):
    ![Tela Inicial](<Captura de tela 2025-04-21 123814.png>)

2. Página de login:
    ![Ecrã de login](<Captura de tela 2025-04-21 123931.png>)

3. Ecrã de registo:
    ![Ecrã de registo](<Captura de tela 2025-04-21 123939-1.png>)

4. Página de criação de bilhetes:
    ![Página de Criação de Bilhetes](<Captura de tela 2025-04-21 123831.png>)

5. Página de atualização de bilhetes:
    ![Página de atualização de bilhetes](<Captura de tela 2025-04-21 123905.png>)

6. Página de visualização de bilhete:
    ![Página de visualização de bilhete](<Captura de tela 2025-05-27 221226.png>)

