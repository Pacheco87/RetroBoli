# RetroBoli - Especificacion Inicial

## Vision

RetroBoli sera una web sencilla, moderna y poco recargada para exponer productos retro de segunda mano. Su objetivo principal es facilitar que cualquier visitante descubra productos disponibles, revise su estado, precio y fotos, y acceda a Wallapop para comprarlos.

La web no tendra carrito de compra, pasarela de pago ni gestion de usuarios publicos. La compra se delegara completamente en Wallapop.

## Objetivos

- Mostrar una pagina de inicio clara y sencilla.
- Publicar un catalogo de productos retro activos.
- Permitir consultar el detalle completo de cada producto.
- Generar un menu publico dinamico basado solo en productos activos.
- Permitir que el administrador cree, edite y cierre productos desde una zona protegida.
- Mantener informacion suficiente para auditoria basica y futuro historico.

## No Objetivos Iniciales

- No habra carrito de compra.
- No habra checkout propio.
- No habra usuarios publicos.
- No habra reservas desde la web.
- No se implementara el historico avanzado de productos en la primera version.
- No se implementara sincronizacion automatica con Wallapop en la primera version.

## Stack Tecnico Previsto

- React para el frontend.
- Node.js y Express para el backend.
- MongoDB como base de datos.
- Almacenamiento de imagenes fuera de MongoDB, guardando en base de datos solo las rutas o URLs.
- Autenticacion de administrador con password hasheada y token de sesion.

## Estructura Publica

### Inicio

La pagina de inicio explicara brevemente que es RetroBoli y para que sirve. Debe transmitir que se trata de un escaparate de productos retro de segunda mano, seleccionados y disponibles para comprar en Wallapop.

La pagina debe usar el logo de RetroBoli y un tema visual acorde: moderno, claro, con personalidad retro, pero sin resultar cargado.

### Productos

La seccion de productos mostrara todos los productos activos actualmente en venta.

Cada producto en la vista general debe mostrar:

- Imagen principal.
- Titulo.
- Precio.
- Categoria o plataforma principal.
- Condicion con color identificativo.

Solo se mostraran productos con estado `activo`.

### Detalle De Producto

Al clicar un producto, el usuario vera una pagina de detalle con:

- Carrusel de fotos.
- Titulo.
- Precio.
- Descripcion.
- Categoria.
- Marca.
- Plataforma.
- Condicion con color.
- Estado comercial cuando sea relevante.
- Enlace clicable a Wallapop.

El enlace a Wallapop debe abrir la pagina externa del producto para completar la compra fuera de RetroBoli.

## Menu Dinamico

El menu de productos debe construirse a partir de los productos activos.

La estructura publica del menu debe ser simple. Internamente los productos tendran categoria, marca y plataforma, pero el menu no debe saturarse con niveles innecesarios.

Regla principal:

- Si una categoria, marca o plataforma no tiene productos activos, no debe aparecer en el menu publico.

Ejemplo:

- Si existe un unico producto activo de MegaDrive, MegaDrive puede aparecer en el menu.
- Si ese producto pasa a vendido o retirado, deja de aparecer en el listado publico.
- Si ya no quedan mas productos activos de MegaDrive, MegaDrive desaparece tambien del menu.

## Modelo De Producto

Cada producto debe almacenar como minimo:

- `title`: titulo del producto.
- `description`: descripcion completa.
- `price`: precio obligatorio.
- `category`: categoria principal, por ejemplo Juegos, Consolas, Merchandising o Accesorios.
- `brand`: marca o familia, por ejemplo Nintendo, Sega, Sony o Microsoft.
- `platform`: plataforma concreta, por ejemplo MegaDrive, Super Nintendo, Game Boy o Nintendo Switch.
- `condition`: condicion del producto.
- `status`: estado comercial.
- `images`: lista de imagenes asociadas.
- `wallapopUrl`: enlace de compra en Wallapop.
- `featured`: indicador opcional para destacar productos.
- `createdAt`: fecha de creacion.
- `updatedAt`: fecha de ultima actualizacion.
- `closedAt`: fecha de cierre cuando se venda o retire.
- `closeReason`: motivo de cierre.

## Condicion Del Producto

La condicion debe mostrarse con un color para facilitar lectura visual.

Condiciones iniciales:

- `nuevo`: verde.
- `muy bueno`: azul.
- `bueno`: verde suave o lima.
- `aceptable`: ambar.
- `necesita revision`: naranja o rojo.

La condicion se mostrara tanto en la vista general como en el detalle.

## Estados Comerciales

Estados iniciales:

- `activo`: visible en la web publica y disponible en Wallapop.
- `vendido`: no visible en catalogo publico ni menu dinamico.
- `retirado`: no visible en catalogo publico ni menu dinamico.

Al cerrar un producto se debe guardar la fecha de cierre y el motivo.

## Administracion

La administracion estara disponible en una URL propia no enlazada desde la web publica.

Aunque solo exista un administrador, el acceso debe estar protegido con:

- Usuario admin unico.
- Password hasheada.
- Token de sesion.
- Variables de entorno para credenciales y secretos.

### Funciones Del Administrador

El administrador podra:

- Iniciar sesion.
- Ver productos en un listado de administracion.
- Crear productos.
- Editar productos.
- Marcar productos como vendidos.
- Marcar productos como retirados.

### Crear Y Editar Producto

Los formularios de crear y editar producto deben incluir:

- Titulo.
- Descripcion.
- Precio.
- Categoria.
- Marca.
- Plataforma.
- Condicion.
- Estado comercial.
- Enlace a Wallapop.
- Fotos del producto.

La subida y gestion de fotos formara parte del formulario de crear y editar producto. No sera una seccion independiente.

Durante la creacion o edicion, el administrador debe poder previsualizar las imagenes en formato carrusel antes de guardar los cambios.

La primera version podra incluir o dejar como mejora posterior:

- Reordenar imagenes.
- Eliminar imagenes individuales.
- Marcar una imagen como principal.

## API Esperada

La API publica debe permitir:

- Listar productos activos.
- Consultar detalle de un producto activo.
- Obtener datos para construir el menu dinamico.

La API admin debe permitir:

- Login del administrador.
- Crear productos.
- Editar productos.
- Subir imagenes dentro del flujo de crear o editar.
- Cambiar estado de productos.
- Consultar productos activos, vendidos y retirados desde administracion.

## Criterios De Aceptacion Generales

- Un visitante puede entender que es RetroBoli desde Inicio.
- Un visitante puede ver productos activos con precio y condicion.
- Un visitante puede abrir un detalle y acceder a Wallapop.
- El menu publico solo muestra agrupaciones con productos activos.
- Un producto vendido o retirado desaparece del catalogo publico.
- Un producto vendido o retirado deja de influir en el menu dinamico.
- El administrador puede crear y editar productos con imagenes.
- El administrador puede cerrar productos como vendidos o retirados.
- La administracion requiere autenticacion.
- La web mantiene una apariencia coherente con el logo de RetroBoli.
