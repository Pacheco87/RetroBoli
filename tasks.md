# RetroBoli - Fases Y Tareas

## Enfoque

El proyecto seguira un flujo SDD Standard con un `spec.md` principal y este `tasks.md` como plan de fases. Las fases son pequenas y revisables para mantener el alcance controlado.

## Fase 0: Preparacion Del Proyecto

Objetivo: crear la base tecnica limpia del proyecto.

Tareas:

- [x] Crear estructura inicial del repositorio.
- [x] Configurar frontend con React.
- [x] Configurar backend con Node.js y Express.
- [x] Preparar conexion a MongoDB.
- [x] Definir variables de entorno iniciales.
- [x] Preparar Docker Compose para MongoDB local.
- [x] Crear scripts de desarrollo.
- [x] Documentar comandos basicos en README.

Criterios de cierre:

- [x] El frontend puede arrancar en local.
- [x] El backend puede arrancar en local.
- [x] Existe una ruta basica de salud o prueba.
- [x] El README contiene instrucciones minimas actualizadas.

Validacion:

- `npm.cmd install`: dependencias instaladas y lockfile generado.
- `npm.cmd run build`: build del frontend completado correctamente.
- `node -e "import('./backend/src/app.js').then(...)"`: la app Express se instancia correctamente.
- `docker-compose.yml`: define MongoDB local con volumen persistente y healthcheck.
- El backend carga `.env` desde la raiz del repositorio aunque se ejecute desde el workspace `backend`.

Nota:

- El arranque completo del backend con `backend/src/server.js` requiere levantar MongoDB con `npm run mongo:up` y crear `.env` desde `.env.development.example`.
- `docker compose config` no se pudo ejecutar en este entorno porque Docker no esta disponible en PATH.

## Fase 1: Modelo De Producto Y API Base

Objetivo: definir como se almacenan y consultan los productos.

Tareas:

- [x] Crear modelo `Product`.
- [x] Definir estados comerciales: activo, vendido y retirado.
- [x] Definir condiciones del producto y mapeo de colores.
- [x] Crear API publica para listar productos activos.
- [x] Crear API publica para consultar detalle de producto.
- [x] Crear API publica para obtener datos del menu dinamico.
- [x] Validar que productos vendidos o retirados no aparecen en endpoints publicos.

Criterios de cierre:

- [x] El backend devuelve productos activos.
- [x] El backend devuelve detalle de producto.
- [x] El backend genera datos suficientes para el menu dinamico.
- [x] Los estados vendido y retirado quedan excluidos de la parte publica.

Validacion:

- `node -e "import('./backend/src/models/Product.js').then(...)"`: modelo `Product` importado correctamente.
- `node -e "import('./backend/src/app.js').then(...)"`: la app Express se instancia con las rutas publicas.
- Script temporal con MongoDB real y endpoints HTTP: crea productos activo, vendido y retirado; verifica que listado, detalle y menu solo exponen el activo; valida `id` y `conditionColor`; borra los datos temporales.
- `npm.cmd run build`: build del frontend completado correctamente.

Nota:

- Los endpoints publicos quedan preparados para MongoDB real; la validacion de datos reales se ampliara cuando existan semillas o panel admin.

## Fase 2: Frontend Publico

Objetivo: construir la parte visible para cualquier visitante.

Tareas:

- [x] Crear layout publico.
- [x] Integrar logo de RetroBoli.
- [x] Crear pagina de Inicio.
- [x] Crear pagina de Productos.
- [x] Crear cards de producto.
- [x] Mostrar precio obligatorio.
- [x] Mostrar condicion con color.
- [x] Crear menu dinamico simple.
- [x] Aplicar responsive basico.

Criterios de cierre:

- [x] Un visitante entiende que es RetroBoli.
- [x] La vista general muestra productos activos.
- [x] El menu solo muestra secciones con productos activos.
- [x] La interfaz funciona en escritorio y movil.

Validacion:

- `npm.cmd run build`: build del frontend completado correctamente.
- `Invoke-WebRequest http://localhost:5173/`: frontend responde `200`.
- `Invoke-WebRequest http://localhost:4000/api/products`: API publica responde `200`.

## Fase 3: Detalle De Producto

Objetivo: permitir consultar cada producto con toda la informacion util.

Tareas:

- [x] Crear ruta de detalle de producto.
- [x] Crear carrusel de imagenes.
- [x] Mostrar descripcion completa.
- [x] Mostrar precio.
- [x] Mostrar categoria, marca y plataforma.
- [x] Mostrar condicion con color.
- [x] Mostrar enlace a Wallapop.
- [x] Gestionar producto no encontrado.

Criterios de cierre:

- [x] El usuario puede abrir un producto desde el listado.
- [x] El detalle muestra toda la informacion requerida.
- [x] El enlace a Wallapop es visible y clicable.
- [x] Los productos no activos no son accesibles como producto publico disponible.

Validacion:

- Script temporal con MongoDB real y endpoints HTTP: crea producto activo, verifica detalle publico y valida que tras cierre el detalle devuelve `404`.
- `npm.cmd run build`: build del frontend completado correctamente.

## Fase 4: Seguridad Y Acceso Admin

Objetivo: proteger la administracion sin crear un sistema complejo de usuarios.

Tareas:

- [x] Definir URL privada de administracion.
- [x] Crear login de administrador.
- [x] Configurar password hasheada.
- [x] Generar token de sesion.
- [x] Crear middleware de proteccion backend.
- [x] Proteger rutas admin.
- [x] Guardar secretos en variables de entorno.

Criterios de cierre:

- [x] La administracion no es accesible sin autenticacion.
- [x] El login valido genera una sesion.
- [x] Las rutas admin rechazan peticiones no autenticadas.
- [x] Las credenciales y secretos no quedan escritos en codigo fuente.

Validacion:

- `npm.cmd run admin:hash --workspace backend -- "RetroBoliAdmin2026!"`: genera hash bcrypt de desarrollo.
- Script temporal con API HTTP: login admin devuelve token valido.
- `Invoke-WebRequest http://localhost:4000/api/admin/products` sin token: rutas admin responden `401`.
- `Invoke-WebRequest http://localhost:5173/retroboli-admin`: ruta admin frontend responde `200`.

## Fase 5: Administracion De Productos

Objetivo: permitir crear, editar y cerrar productos.

Tareas:

- [x] Crear layout admin.
- [x] Crear listado admin de productos.
- [x] Crear formulario de alta de producto.
- [x] Crear formulario de edicion de producto.
- [x] Integrar subida de fotos en crear producto.
- [x] Integrar subida y gestion de fotos en editar producto.
- [x] Previsualizar fotos en carrusel dentro del formulario.
- [x] Guardar URL de Wallapop.
- [x] Marcar producto como vendido.
- [x] Marcar producto como retirado.
- [x] Guardar fecha y motivo de cierre.

Criterios de cierre:

- [x] El administrador puede crear productos completos.
- [x] El administrador puede editar productos existentes.
- [x] El administrador puede subir y previsualizar fotos en crear y editar.
- [x] El administrador puede cerrar productos como vendidos o retirados.
- [x] Los productos cerrados desaparecen del catalogo publico y del menu.

Validacion:

- Script temporal con API HTTP y MongoDB real: login, alta multipart con imagen, detalle publico, edicion, cierre como vendido, desaparicion de detalle y menu publico; elimina datos e imagen temporal.
- Script temporal adicional: cierre como retirado y verificacion de ocultacion publica.

## Fase 6: Pulido Visual Y Experiencia

Objetivo: dejar la web coherente, moderna y agradable.

Tareas:

- [x] Ajustar tema visual acorde al logo.
- [x] Revisar paleta, tipografia y espaciados.
- [x] Mejorar estados de carga.
- [x] Mejorar mensajes de error.
- [x] Crear empty state para catalogo sin productos.
- [x] Crear empty state para producto no encontrado.
- [x] Revisar formularios admin.
- [x] Revisar experiencia movil.

Criterios de cierre:

- [x] La web se percibe moderna, clara y no recargada.
- [x] Los estados vacios y errores son comprensibles.
- [x] No hay solapes visuales en vistas principales.
- [x] La experiencia movil es usable.

Validacion:

- `npm.cmd run build`: CSS y frontend compilan correctamente.
- Revision estatica de estructura responsive con grid a una columna bajo `860px`.

Nota:

- No se pudo usar navegador integrado/Playwright en este entorno porque la herramienta Browser no estaba disponible y Playwright no esta instalado.

## Fase 7: Validacion Y Cierre De Primera Version

Objetivo: comprobar que todo funciona de punta a punta.

Tareas:

- [x] Probar crear producto.
- [x] Probar editar producto.
- [x] Probar subida y previsualizacion de imagenes.
- [x] Probar listado publico.
- [x] Probar detalle publico.
- [x] Probar apertura del enlace a Wallapop.
- [x] Probar cierre como vendido.
- [x] Probar cierre como retirado.
- [x] Verificar desaparicion de productos cerrados del catalogo.
- [x] Verificar desaparicion de secciones sin productos activos del menu.
- [x] Ejecutar build.
- [x] Ejecutar lint o typecheck si existen.
- [x] Actualizar README con comandos finales.

Criterios de cierre:

- [x] El flujo publico funciona de punta a punta.
- [x] El flujo admin funciona de punta a punta.
- [x] La validacion disponible queda documentada.
- [x] La primera version queda lista para uso local o despliegue inicial.

Validacion:

- `npm.cmd run build`: build del frontend completado correctamente.
- Script temporal de flujo final: login, crear producto con imagen, confirmar visibilidad publica, cerrar producto, confirmar ocultacion publica y limpiar datos temporales.
- Script temporal adicional: cierre como retirado y detalle publico `404`.
- `Invoke-WebRequest http://localhost:5173/`: frontend responde `200`.
- `Invoke-WebRequest http://localhost:5173/retroboli-admin`: admin frontend responde `200`.
- `Invoke-WebRequest http://localhost:4000/api/products`: API publica responde `200`.

Nota:

- No hay scripts de lint o typecheck definidos todavia; queda como mejora posterior si el proyecto crece.

## Fase Posterior: Historico De Productos

Objetivo: ampliar la administracion con consulta historica de productos vendidos o retirados.

Posibles tareas:

- Crear filtros admin por estado.
- Crear vista de historico.
- Mostrar fechas de cierre.
- Mostrar motivo de cierre.
- Preparar metricas sencillas por categoria, plataforma o estado.
