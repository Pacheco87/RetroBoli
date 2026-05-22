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

Levantar solo el frontend:

```bash
npm run dev --workspace frontend
```

Levantar solo el backend:

```bash
npm run dev --workspace backend
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
- `GET /api/products/menu`: devuelve la estructura del menu dinamico basada en productos activos.
- `GET /api/products/:productId`: devuelve el detalle de un producto activo.

Los productos con estado `vendido` o `retirado` no aparecen en la API publica.

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
