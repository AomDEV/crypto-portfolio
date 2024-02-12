# Crypto Portfolio

## NestJS (API)

###

<div align="center">
<img src="https://nestjs.com/img/logo-small.svg" width="128" />
</div>

###

Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

### Structure
A description for this project structure
- prisma
    - migrations *(Prisma Migration files)*
    - schema
        - common
            - base.prisma *(Documentation)*
            - datasource.prisma *(Data Source)*
            - enum.prisma *(Enums)*
            - generator.prisma *(Prisma Generator)*
        - **.prisma *(Prisma Table)*
    - seed
        - data *(Seed Data)*
        - client.ts *(Library)*
        - index.ts *(Entry file)*
    - schema.prisma *(Prisma generated schema file)*
- src
    - common
        - constants *(Constant Variables)*
        - decorators *(Decorators)*
        - helpers *(Helper functions)*
        - middlewares *(Middlewares)*
        - providers *(NestJS Provider)*
        - shared *(Services and Shared functions)*
        - types *(Type Definitions)*
    - features *(Feature controllers and modules)*
    - jobs *(Queue)*
        - default *(Queue Processor and Consumer)*
        - index.ts *(Queue Module and Providers)*
        - listener.ts *(Global event handler)*
        - middleware.ts *(Bull-Board middleware)*
    - app.module.ts *(NestJS Module)*
    - main.ts *(NestJS entry file)*

### Get started
1. Copy `.env.example` to `.env`, For example
    ```env
    # Database connection string
    DATABASE_URL=postgres://postgres:password@123.123.123.123:5432/db

    # Json Web Token
    JWT_SECRET=secret

    # CoinCap API
    COINCAP_API_URL="https://api.coincap.io/"

    # CoinMarketCap API
    CMC_API_URL="https://pro-api.coinmarketcap.com/"
    CMC_API_KEY=api_key

    # Open Exchange Rates API
    OXR_API_URL="https://openexchangerates.org/"
    OXR_APP_ID=api_key

    # Redis Database
    REDIS_HOST=123.123.123.123
    REDIS_PORT=6379
    REDIS_USERNAME=default
    REDIS_PASSWORD=password
    ```
2. Install dependencies
    ```bash
    yarn install
    ```
3. Generate Prisma schema
    ```bash
    yarn prisma:generate
    ```
4. Start an app
    ```bash
    yarn start:dev
    ```
### Dashboard
**Swagger Document**

The OpenAPI specification is a language-agnostic definition format used to describe RESTful APIs. Nest provides a dedicated module which allows generating such a specification by leveraging decorators.

http://localhost:3000/api

**Bull-Board**

Bull Dashboard is a UI built on top of Bull or BullMQ to help you visualize your queues and their jobs. With this library you get a beautiful UI for visualizing what's happening with each job in your queues, their status and some actions that will enable you to get the job done.

```
Username: admin
Password: admin
```
http://localhost:3000/queues

## NextJS (App)

###

<div align="center">
<img src="https://camo.githubusercontent.com/39791c3e4c4387b8b913628a8f258768ea3a4a71fc815ced2219f81c22c71f6a/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6c696768745f6261636b67726f756e642e706e67" width="128" />
</div>

###

Used by some of the world's largest companies, Next.js enables you to create full-stack web applications by extending the latest React features, and integrating powerful Rust-based JavaScript tooling for the fastest builds.

### Structure
A description for this project structure
- public
- src
    - app *(NextJS App Router)*
    - components *(UI Components)*
    - context *(Context and Provider)*
    - hooks *(Hooks)*
    - lib *(Helper functions)*
    - types *(Type Definitions)*

### Get started
1. Copy `.env.example` to `.env`, For example
    ```
    NEXT_PUBLIC_API_URL=http://localhost:3000/
    NEXT_PUBLIC_WS_URL=ws://localhost:3001/
    ```
2. Install dependencies
    ```bash
    yarn install
    ```
3. Start an app
    ```bash
    yarn dev
    ```

## CLI
### Structure
A description for this project structure
- api
    - docker-compose.yml
    - Dockerfile
- app
    - docker-compose.yml
    - Dockerfile
- caddy
    - docker-compose.yml
- db
    - docker-compose.yml
- cli.sh *(Helper Script)*

### Get started

To build all dockers
```bash
sh cli.sh build
```

To start all dockers
```bash
sh cli.sh up
```

To stop all dockers
```bash
sh cli.sh stop
```

## License
This project is licensed under the **MIT License**, so it means it's completely free to use and copy, but if you do fork this project with nice additions that we could have here, remember to send a PR 👍