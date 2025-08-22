<div align="center">

# ✈️ Sistema de Administración de Vuelos
Proyecto Next.js con Prisma + MongoDB (Docker)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=061F2F)](https://react.dev)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![Swagger UI](https://img.shields.io/badge/Swagger-UI-85EA2D?logo=swagger&logoColor=black)](https://swagger.io/tools/swagger-ui/)
[![Git](https://img.shields.io/badge/Git-ready-F05032?logo=git&logoColor=white)](https://git-scm.com/)
[![Windows](https://img.shields.io/badge/Windows-10%2F11-0078D6?logo=windows&logoColor=white)](https://www.microsoft.com/windows)

</div>

Aplicación para gestionar vuelos, pasajeros y destinos. Incluye documentación de API integrada en `http://localhost:3000/document`.

## ⭐ Características
- 🧭 Enrutamiento con App Router (Next.js)
- 🔐 Autenticación base (login/logout)
- 🧑‍✈️ Gestión de pasajeros y vuelos
- 🧾 Documentación de API embebida (Swagger UI)
- 🐳 Infra lista con Docker (MongoDB + Mongo Express)

## 🧰 Tecnologías
- Next.js (App Router)
- Prisma ORM
- MongoDB en Docker (+ Mongo Express)
- CSS moderno y UI para documentación API

## Configuración del proyecto (paso a paso)

Este proyecto usa Next.js, Prisma y MongoDB en Docker.

1) Requisitos
- Node.js 18+ y npm
- Docker Desktop

2) Variables de entorno
Crea un archivo `.env` en la raíz con:

```bash
# .env
DATABASE_URL="mongodb://localhost:27017/dorado"
```

3) Instalar dependencias
```bash
npm install
```

4) Levantar la base de datos (Docker)
```bash
docker compose up -d
```
Servicios disponibles:
- mongodb en `localhost:27017`
- mongo-express en `http://localhost:8081`

5) Generar el cliente de Prisma
```bash
npx prisma generate
```

```bash
docker exec mongodb bash -lc "set -e; sed -i 's/\r$//' /docker-entrypoint-initdb.d/init-mongo.sh /docker-entrypoint-initdb.d/mongo-init.js; echo 'First line after fix:'; sed -n '1p' /docker-entrypoint-initdb.d/init-mongo.sh | cat -v"   
```

```bash
docker exec mongodb bash -lc "set -e; echo 'Waiting for PRIMARY...'; until mongosh --quiet --eval 'db.hello().isWritablePrimary' | grep -q true; do echo '...still waiting'; sleep 1; done; echo 'PRIMARY is ready.'"                                        
```




6) Aplicar el esquema a la base
```bash
npx prisma db push
```

7) Inicializar Mongo (replica set + seed)
```bash
 docker exec mongodb bash -lc "mongosh --quiet /docker-entrypoint-initdb.d/mongo-init.js"   
```

8) Iniciar la aplicación
```bash
npm run dev
```

## 🔧 Scripts útiles
- `npm run dev`: iniciar el servidor de desarrollo
- `npm run build && npm start`: build y ejecución en producción
- `npx prisma studio`: inspeccionar la base de datos con Prisma Studio

## URLs útiles
- App: http://localhost:3000
- Documentación API: http://localhost:3000/document
- Mongo Express: http://localhost:8081

## Notas
- Asegúrate de que Docker esté corriendo antes del paso 4.
- Si cambias puertos o nombres en `docker-compose.yml`, actualiza `DATABASE_URL` en `.env`.
