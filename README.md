## API RESTful (Nest.js)

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
[NodeJS](https://nodejs.org)
[Docker](https://www.docker.com)

## Passo a passo para a execução do projeto

1. **Acesse o site do NodeJS, faça o download e a instalação**
   - [https://nodejs.org/en/download](https://nodejs.org/en/download)

2. **Acesse o site do Docker, faça o download e a instalação**:
   - [https://docs.docker.com/desktop/setup/install/windows-install](https://docs.docker.com/desktop/setup/install/windows-install/).

3. **Crie um arquivo `.env` no diretório do projeto ou renomeei o arquivo `.env.exemple` para `.env`**

4. **Após criar um `.env` é necessário adicionar as variáveis de ambiente para o projeto. Exemplo:**
   ```bash
    APP_PORT=3777
    NODE_ENV=development
    CORS_RELEASED_DOMAINS=http://localhost:3000,http://localhost:3001
    JWT_SECRET=nX0uC9m3R0E29nrqCH

    DATABASE_TYPE=postgres
    DATABASE_HOST=db-postgres-tech-interview
    DATABASE_PORT=5432
    DATABASE_USERNAME=postgres
    DATABASE_PASSWORD=postgres
    DATABASE_NAME=postgres
    DATABASE_NAME_SCHEMA=app

    PGADMIN_DEFAULT_EMAIL=pgadmin4@pgadmin.org
    PGADMIN_DEFAULT_PASSWORD=admin
    PGADMIN_PORT=5050

    WEBHOOK_PASSWORD=admin
    WEBHOOK_USERNAME=admin
    WEBHOOK_CALLBACK_COMPANY_URL=http://localhost:3777/api/vehicles/callback
   ```

5. **Rodar esses comandos no terminal do diretório do projeto:**
   ```bash
    chmod +x .docker/entrypoint.sh
    chmod +x .docker/postgres/create-schema.sh
    dos2unix .docker/postgres/create-schema.sh
    docker-compose up -d
   ```
6. **Caso precise parar os serviços execute esse comando no terminal do diretório do projeto:**
   ```bash
    docker-compose down
   ```
7. **Para WebHook funcionar em localmente, modifique o projeto `fake-tracking-api` tirando o `@IsUrl` do campo `callbackUrl` (Cadastro de `companies` não está aceitando URLs local)**

