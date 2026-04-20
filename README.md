# Backend Tours API

API backend para la gestión de tours conectada a **Supabase**, desarrollada con **Node.js**, **Express** y **TypeScript**, pensada para desplegarse en **Railway**.

---

## 🚀 Funcionalidades actuales

- Obtener todos los tours
- Obtener catálogos completos (tours + hospedajes + alimentación + actividades + transporte + guías)
- Cotizar un tour
- Crear nuevos tours desde el frontend

---

## 🧱 Tecnologías

- Node.js
- Express
- TypeScript
- Supabase
- Zod
- CORS
- Dotenv

---

## 📁 Estructura del proyecto

```bash
backend-tours/
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── lib/
│   │   └── supabase.ts
│   ├── middleware/
│   │   ├── error-handler.ts
│   │   └── not-found.ts
│   ├── routes/
│   │   ├── catalogos.routes.ts
│   │   ├── cotizar.routes.ts
│   │   ├── health.routes.ts
│   │   └── tours.routes.ts
│   ├── schemas/
│   │   └── reserva.schemas.ts
│   ├── services/
│   │   └── pricing.service.ts
│   ├── types/
│   │   └── app.types.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── package.json
└── tsconfig.json

Instalación

cd backend-tours
npm install

Variables de entorno

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
