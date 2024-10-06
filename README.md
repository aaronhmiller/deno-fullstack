# deno-fullstack

## intent

Created as a learning tool for backend with API, using Postgres for persistence,
and a React frontend.

## project structure

```
project_root/
├── .env
├── db/
│   └── init.sql
├── backend/
│   ├── app.ts
│   ├── deps.ts
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

The .env is not here for security, but it will contain your DB_USER,
DB_PASSWORD, and DB_NAME

## usage

bring the stack up with `docker compose up -d`

## cleanup

bring the stack down and cleanup with `docker compose down --volumes` (remove
the `--volumes` if you want persistence across runs)
