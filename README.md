# RetroBoli

RetroBoli es una pagina sencilla para mostrar productos retro de segunda mano actualmente en venta. La web funcionara como escaparate: los usuarios podran consultar productos, ver sus fotos e informacion principal, y comprar finalmente desde Wallapop mediante un enlace externo.

## Estado

Proyecto en fase de definicion inicial siguiendo un enfoque SDD Standard. Actualmente se esta trabajando en la Fase 0: preparacion del proyecto.

## Stack previsto

- Frontend: React
- Backend: Node.js + Express
- Base de datos: MongoDB
- Gestion de imagenes: almacenamiento de archivos y rutas asociadas al producto
- Administracion: ruta privada con login de administrador, password hasheada y token de sesion

## Requisitos locales

- Node.js 24 o superior.
- npm.
- Docker Desktop para levantar MongoDB en local con Docker Compose.

## Comandos iniciales

Instalar dependencias:

```bash
npm install
```

Crear el archivo de entorno local:

```bash
cp .env.development.example .env
```

En PowerShell tambien puedes usar:

```powershell
Copy-Item .env.development.example .env
```

Levantar MongoDB en Docker:

```bash
npm run mongo:up
```

Levantar frontend y backend en desarrollo:

```bash
npm run dev
```

El backend lee el archivo `.env` desde la raiz del repositorio, aunque se ejecute desde el workspace `backend`.
El frontend usa rutas relativas (`/api` y `/uploads`) y Vite las redirige al backend local en `http://localhost:4000`.
Esto permite compartir el puerto `5173` con Dev Tunnels/Ports sin exponer otro tunel para la API.

La administracion local esta disponible en:

```text
http://localhost:5173/retroboli-admin
```

Credenciales de desarrollo incluidas en `.env.development.example`:

- Usuario: `admin`
- Contrasena: `RetroBoliAdmin2026!`

Para generar otro hash de contrasena:

```bash
npm run admin:hash --workspace backend -- "tu-password"
```

Levantar solo el frontend:

```bash
npm run dev --workspace frontend
```

Si cambias la configuracion de Vite o acabas de actualizar el proxy local, reinicia este proceso para que lea `frontend/vite.config.mjs`.

Levantar solo el backend:

```bash
npm run dev --workspace backend
```

Crear 50 productos de prueba:

```bash
npm run db:seed --workspace backend
```

Generar build del frontend:

```bash
npm run build
```

Parar MongoDB:

```bash
npm run mongo:down
```

## Variables de entorno

Usa `.env.development.example` como referencia para crear un `.env` local de desarrollo. `.env.example` mantiene los mismos valores base como plantilla general.

La primera version espera:

- `PORT`
- `MONGODB_URI`
- `FRONTEND_ORIGIN`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `SESSION_TOKEN_SECRET`

## API publica inicial

El backend expone estos endpoints publicos:

- `GET /api/health`: estado basico de la API.
- `GET /api/products`: lista productos activos.
- `GET /api/products/menu`: devuelve categorias y plataformas activas para filtrar el catalogo.
- `GET /api/products/featured`: lista productos destacados activos.
- `GET /api/products/:productId`: devuelve el detalle de un producto activo.

Los productos con estado `vendido` o `retirado` no aparecen en la API publica.

## API admin inicial

Los endpoints admin requieren token Bearer salvo el login:

- `POST /api/admin/auth/login`: inicia sesion admin.
- `GET /api/admin/auth/me`: valida la sesion admin.
- `GET /api/admin/products`: lista todos los productos para administracion.
- `POST /api/admin/products`: crea producto con formulario multipart.
- `PUT /api/admin/products/:productId`: edita producto con formulario multipart.
- `PATCH /api/admin/products/:productId/close`: marca producto como `vendido` o `retirado`.

Las imagenes subidas se guardan localmente en `backend/uploads` y se sirven desde `/uploads`.

## Despliegue En Render

Para publicar una beta accesible sin GitHub, usa un Web Service de Render conectado al repositorio.

Configuracion recomendada:

```text
Runtime: Node
Branch: main
Build Command: npm install && npm run build
Start Command: npm start
```

Variables de entorno necesarias en Render:

```text
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/retroboli?retryWrites=true&w=majority
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=hash_bcrypt_de_la_password
SESSION_TOKEN_SECRET=clave_larga_aleatoria
FRONTEND_ORIGIN=https://tu-servicio.onrender.com
```

En produccion Express sirve la API (`/api`), las imagenes (`/uploads`) y el frontend compilado desde `frontend/dist` en la misma URL publica.

Nota: en el plan gratuito de Render el almacenamiento local no es persistente. Las imagenes subidas a `backend/uploads` pueden perderse al redeplegar o reiniciar el servicio. Para una beta puede ser suficiente, pero para uso real conviene mover imagenes a Cloudinary o configurar almacenamiento persistente.

## Alcance inicial

- Pagina de inicio explicativa.
- Catalogo publico de productos activos.
- Menu dinamico con secciones que solo aparecen si tienen productos activos.
- Detalle de producto con carrusel de imagenes, precio, condicion, descripcion y enlace a Wallapop.
- Panel de administrador para crear, editar y cerrar productos.
- Subida y previsualizacion de fotos dentro de los formularios de crear y editar producto.
- Estados de producto: activo, vendido y retirado.

## Documentacion del proyecto

- [spec.md](spec.md): especificacion funcional y tecnica inicial.
- [tasks.md](tasks.md): fases y tareas previstas para la primera version.

## Nota de compra

RetroBoli no tendra carrito, pagos ni checkout propio. Todas las compras se realizaran fuera de la web, a traves del enlace de Wallapop asociado a cada producto.
