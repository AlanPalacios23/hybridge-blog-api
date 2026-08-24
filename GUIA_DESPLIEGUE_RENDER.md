# Guía de despliegue en Render

Esta guía lleva el proyecto desde el ZIP hasta una URL pública lista para entregar en Hybridge.

## 1. Preparar el proyecto en Windows

1. Descomprime `Hybridge-Blog-API-v1.0.0.zip`.
2. Abre PowerShell dentro de la carpeta `hybridge-blog-api`.
3. Comprueba que estás en la carpeta correcta:

   ```powershell
   dir
   ```

   Debes ver `package.json`, `render.yaml`, `src` y `tests`.

4. Instala las dependencias y ejecuta las pruebas:

   ```powershell
   npm install
   npm test
   ```

   El resultado esperado es `7 passed`.

## 2. Crear el repositorio de GitHub

1. En GitHub crea un repositorio vacío llamado `hybridge-blog-api`.
2. No marques las opciones para crear README, `.gitignore` o licencia, porque el proyecto ya contiene esos archivos.
3. En PowerShell, dentro de la carpeta del proyecto, ejecuta:

   ```powershell
   git init
   git add .
   git commit -m "feat: API de blog lista para producción"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/hybridge-blog-api.git
   git push -u origin main
   ```

4. Sustituye `TU_USUARIO` por tu nombre de usuario real de GitHub.

## 3. Desplegar con Render Blueprint

El proyecto incluye `render.yaml`, que configura automáticamente el servicio web, PostgreSQL y las variables de entorno.

1. Entra a [Render](https://dashboard.render.com/).
2. Inicia sesión usando GitHub.
3. Selecciona **New +** y después **Blueprint**.
4. Conecta el repositorio `hybridge-blog-api`.
5. Render detectará el archivo `render.yaml`.
6. Revisa que aparezcan estos recursos:
   - `hybridge-blog-api`, de tipo Web Service.
   - `hybridge-blog-db`, de tipo PostgreSQL.
7. Confirma con **Apply** o **Deploy Blueprint**.
8. Espera hasta que el servicio muestre el estado **Live**.

Render generará automáticamente `JWT_SECRET` y conectará `DATABASE_URL`; no es necesario publicar el archivo `.env`.

## 4. Verificar el despliegue

Render mostrará una dirección similar a:

```text
https://hybridge-blog-api.onrender.com
```

Comprueba estas tres direcciones en el navegador:

```text
https://TU-API.onrender.com/
https://TU-API.onrender.com/api/health
https://TU-API.onrender.com/docs
```

La ruta `/` debe responder con `status: "online"`. La ruta `/api/health` debe responder con `status: "healthy"` y `database.status: "connected"`.

## 5. Probar las funciones

Importa en Postman el archivo:

```text
postman/Hybridge-Blog-API.postman_collection.json
```

Después cambia la variable `baseUrl` por la URL real de Render. Ejecuta en este orden:

1. Registrar usuario.
2. Iniciar sesión.
3. Consultar perfil.
4. Crear publicación.
5. Listar publicaciones.

La colección guarda automáticamente el token JWT después del registro o inicio de sesión.

## 6. Entrega en Hybridge

Copia solamente la URL raíz de producción. Texto recomendado:

> URL de mi API desplegada en producción:  
> https://TU-API.onrender.com

Antes de enviar, abre el enlace en una ventana de incógnito para confirmar que es público.

## Nota sobre el plan gratuito

Según la [documentación oficial de Render](https://render.com/docs/free), las bases de datos PostgreSQL gratuitas expiran 30 días después de su creación. La URL es adecuada para entregar y demostrar esta actividad; para conservar los datos a largo plazo será necesario migrar o actualizar la base de datos antes del vencimiento.

## Solución de errores comunes

### `npm error ENOENT package.json`

PowerShell no está ubicado en la carpeta correcta. Ejecuta `cd` hacia la carpeta que contiene `package.json`.

### Render muestra `Faltan variables de entorno obligatorias`

Confirma en **Environment** que existen `DATABASE_URL` y `JWT_SECRET`. Si utilizaste el Blueprint, ambas deben aparecer automáticamente.

### Render muestra un error de conexión a PostgreSQL

Verifica que el servicio web y la base de datos se hayan creado desde el mismo Blueprint y estén en la misma región.

### La raíz funciona pero `/api/health` responde 503

El servidor está activo, pero no puede consultar PostgreSQL. Revisa `DATABASE_URL` y el estado de `hybridge-blog-db` en Render.
