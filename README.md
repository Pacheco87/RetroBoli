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
- MongoDB local o una URI compatible.

## Comandos iniciales

Instalar dependencias:

```bash
npm install
```

Levantar frontend y backend en desarrollo:

```bash
npm run dev
```

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

## Variables de entorno

Usa `.env.example` como referencia para crear un `.env` local. La primera version espera:

- `PORT`
- `MONGODB_URI`
- `FRONTEND_ORIGIN`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `SESSION_TOKEN_SECRET`

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
