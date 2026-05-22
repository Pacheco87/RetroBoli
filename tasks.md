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

Nota:

- El arranque completo del backend con `backend/src/server.js` requiere levantar MongoDB con `npm run mongo:up` y crear `.env` desde `.env.development.example`.
- `docker compose config` no se pudo ejecutar en este entorno porque Docker no esta disponible en PATH.

## Fase 1: Modelo De Producto Y API Base

Objetivo: definir como se almacenan y consultan los productos.

Tareas:

- Crear modelo `Product`.
- Definir estados comerciales: activo, vendido y retirado.
- Definir condiciones del producto y mapeo de colores.
- Crear API publica para listar productos activos.
- Crear API publica para consultar detalle de producto.
- Crear API publica para obtener datos del menu dinamico.
- Validar que productos vendidos o retirados no aparecen en endpoints publicos.

Criterios de cierre:

- El backend devuelve productos activos.
- El backend devuelve detalle de producto.
- El backend genera datos suficientes para el menu dinamico.
- Los estados vendido y retirado quedan excluidos de la parte publica.

## Fase 2: Frontend Publico

Objetivo: construir la parte visible para cualquier visitante.

Tareas:

- Crear layout publico.
- Integrar logo de RetroBoli.
- Crear pagina de Inicio.
- Crear pagina de Productos.
- Crear cards de producto.
- Mostrar precio obligatorio.
- Mostrar condicion con color.
- Crear menu dinamico simple.
- Aplicar responsive basico.

Criterios de cierre:

- Un visitante entiende que es RetroBoli.
- La vista general muestra productos activos.
- El menu solo muestra secciones con productos activos.
- La interfaz funciona en escritorio y movil.

## Fase 3: Detalle De Producto

Objetivo: permitir consultar cada producto con toda la informacion util.

Tareas:

- Crear ruta de detalle de producto.
- Crear carrusel de imagenes.
- Mostrar descripcion completa.
- Mostrar precio.
- Mostrar categoria, marca y plataforma.
- Mostrar condicion con color.
- Mostrar enlace a Wallapop.
- Gestionar producto no encontrado.

Criterios de cierre:

- El usuario puede abrir un producto desde el listado.
- El detalle muestra toda la informacion requerida.
- El enlace a Wallapop es visible y clicable.
- Los productos no activos no son accesibles como producto publico disponible.

## Fase 4: Seguridad Y Acceso Admin

Objetivo: proteger la administracion sin crear un sistema complejo de usuarios.

Tareas:

- Definir URL privada de administracion.
- Crear login de administrador.
- Configurar password hasheada.
- Generar token de sesion.
- Crear middleware de proteccion backend.
- Proteger rutas admin.
- Guardar secretos en variables de entorno.

Criterios de cierre:

- La administracion no es accesible sin autenticacion.
- El login valido genera una sesion.
- Las rutas admin rechazan peticiones no autenticadas.
- Las credenciales y secretos no quedan escritos en codigo fuente.

## Fase 5: Administracion De Productos

Objetivo: permitir crear, editar y cerrar productos.

Tareas:

- Crear layout admin.
- Crear listado admin de productos.
- Crear formulario de alta de producto.
- Crear formulario de edicion de producto.
- Integrar subida de fotos en crear producto.
- Integrar subida y gestion de fotos en editar producto.
- Previsualizar fotos en carrusel dentro del formulario.
- Guardar URL de Wallapop.
- Marcar producto como vendido.
- Marcar producto como retirado.
- Guardar fecha y motivo de cierre.

Criterios de cierre:

- El administrador puede crear productos completos.
- El administrador puede editar productos existentes.
- El administrador puede subir y previsualizar fotos en crear y editar.
- El administrador puede cerrar productos como vendidos o retirados.
- Los productos cerrados desaparecen del catalogo publico y del menu.

## Fase 6: Pulido Visual Y Experiencia

Objetivo: dejar la web coherente, moderna y agradable.

Tareas:

- Ajustar tema visual acorde al logo.
- Revisar paleta, tipografia y espaciados.
- Mejorar estados de carga.
- Mejorar mensajes de error.
- Crear empty state para catalogo sin productos.
- Crear empty state para producto no encontrado.
- Revisar formularios admin.
- Revisar experiencia movil.

Criterios de cierre:

- La web se percibe moderna, clara y no recargada.
- Los estados vacios y errores son comprensibles.
- No hay solapes visuales en vistas principales.
- La experiencia movil es usable.

## Fase 7: Validacion Y Cierre De Primera Version

Objetivo: comprobar que todo funciona de punta a punta.

Tareas:

- Probar crear producto.
- Probar editar producto.
- Probar subida y previsualizacion de imagenes.
- Probar listado publico.
- Probar detalle publico.
- Probar apertura del enlace a Wallapop.
- Probar cierre como vendido.
- Probar cierre como retirado.
- Verificar desaparicion de productos cerrados del catalogo.
- Verificar desaparicion de secciones sin productos activos del menu.
- Ejecutar build.
- Ejecutar lint o typecheck si existen.
- Actualizar README con comandos finales.

Criterios de cierre:

- El flujo publico funciona de punta a punta.
- El flujo admin funciona de punta a punta.
- La validacion disponible queda documentada.
- La primera version queda lista para uso local o despliegue inicial.

## Fase Posterior: Historico De Productos

Objetivo: ampliar la administracion con consulta historica de productos vendidos o retirados.

Posibles tareas:

- Crear filtros admin por estado.
- Crear vista de historico.
- Mostrar fechas de cierre.
- Mostrar motivo de cierre.
- Preparar metricas sencillas por categoria, plataforma o estado.
