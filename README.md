# Hybridge Blog API

API REST de blog desarrollada con Node.js, Express y PostgreSQL. Está preparada para ejecutarse localmente, probarse con Jest y desplegarse en Render.

## Funcionalidades

- Registro e inicio de sesión con JWT.
- Contraseñas protegidas con bcrypt.
- Consulta del perfil autenticado.
- CRUD de publicaciones con control de propiedad.
- Búsqueda y paginación de publicaciones.
- Validación de entradas con Zod.
- PostgreSQL con creación automática de tablas e índices.
- Seguridad mediante Helmet, CORS y límites de peticiones.
- Endpoint de salud con verificación real de la base de datos.
- Respuestas de error uniformes.
- Pruebas automatizadas con Jest y Supertest.
- Documentación interactiva con OpenAPI y Swagger UI.
- Integración continua con GitHub Actions.
- Configuración de infraestructura para Render y Docker.

## Requisitos

- Node.js 20 o superior.
- PostgreSQL 14 o superior.
- npm.

## Ejecución local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` como `.env` y configura tus valores:

   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hybridge_blog
   JWT_SECRET=coloca_aqui_un_secreto_de_al_menos_32_caracteres
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=*
   ```

3. Inicia la API:

   ```bash
   npm run dev
   ```

4. Abre `http://localhost:3000`.

La documentación interactiva estará disponible en `http://localhost:3000/docs`.

Las tablas `users` y `posts` se crean automáticamente al iniciar la aplicación.

## Pruebas

```bash
npm test
```

## Endpoints

| Método | Ruta | Autenticación | Descripción |
|---|---|---:|---|
| GET | `/` | No | Información principal de la API |
| GET | `/api/health` | No | Estado del servicio y PostgreSQL |
| GET | `/docs` | No | Documentación interactiva Swagger |
| GET | `/openapi.json` | No | Especificación OpenAPI |
| POST | `/api/auth/register` | No | Crear una cuenta |
| POST | `/api/auth/login` | No | Iniciar sesión |
| GET | `/api/auth/me` | Sí | Consultar perfil |
| GET | `/api/posts` | No | Listar y buscar publicaciones |
| GET | `/api/posts/:id` | No | Consultar una publicación |
| POST | `/api/posts` | Sí | Crear una publicación |
| PATCH | `/api/posts/:id` | Sí | Editar una publicación propia |
| DELETE | `/api/posts/:id` | Sí | Eliminar una publicación propia |

Los endpoints protegidos esperan el encabezado:

```http
Authorization: Bearer TU_TOKEN_JWT
```

### Ejemplo de registro

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alan Palacios","email":"alan@example.com","password":"Segura123"}'
```

### Ejemplo de publicación

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{"title":"Mi primera publicación","content":"Este es el contenido de mi primera publicación."}'
```

## Despliegue en Render

### Opción recomendada: Blueprint

1. Sube este proyecto a un repositorio de GitHub.
2. En Render selecciona **New > Blueprint**.
3. Conecta el repositorio.
4. Render leerá `render.yaml` y creará el servicio web y la base de datos.
5. Confirma la creación y espera a que finalice el despliegue.
6. Abre la URL generada y verifica `/` y `/api/health`.
7. Abre `/docs` para probar la API desde Swagger UI.

### Configuración manual

1. Crea una base de datos PostgreSQL en Render.
2. Crea un **Web Service** conectado al repositorio.
3. Usa `npm ci` como **Build Command**.
4. Usa `npm start` como **Start Command**.
5. Configura estas variables:
   - `NODE_ENV=production`
   - `DATABASE_URL`: URL interna de la base de datos de Render.
   - `JWT_SECRET`: cadena aleatoria de 32 caracteres o más.
   - `JWT_EXPIRES_IN=7d`
   - `CORS_ORIGIN=*`
6. Usa `/api/health` como ruta de verificación.

No agregues el archivo `.env` a GitHub. Los secretos deben configurarse directamente en Render.

## Respuesta esperada en producción

Al visitar la URL pública debes recibir una respuesta similar a esta:

```json
{
  "success": true,
  "name": "Hybridge Blog API",
  "version": "1.0.0",
  "status": "online",
  "message": "API desplegada correctamente 🚀"
}
```

## Autor

Alan Palacios
