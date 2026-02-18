# GestorDeOpiniones
Sistema de backend profesional desarrollado con Node.js, Express y MongoDB. Esta aplicación permite a los usuarios registrarse, publicar opiniones y comentar en las publicaciones de otros, manteniendo un control estricto de autoría mediante tokens de seguridad.

🚀 Tecnologías Utilizadas

Node.js: Entorno de ejecución para el servidor.  
Express.js: Framework para la construcción de la API REST.  
MongoDB & Mongoose: Base de datos NoSQL y modelado de objetos.  
JWT (JSON Web Tokens): Autenticación segura entre cliente y servidor.  
Bcryptjs: Encriptación de contraseñas.  
Cloudinary & Multer: Gestión y almacenamiento de imágenes en la nube.

⚙️ Configuración e Instalación

1. Requisitos Previos  
Instalación de Node.js (versión 18+ recomendada).  
Instancia de MongoDB (Local en el puerto 27017 o MongoDB Atlas).

2. Variables de Entorno (.env)  
Crea un archivo .env en la raíz del proyecto con los siguientes parámetros:

Fragmento de código

```env
PORT = 3000
NODE_ENV = development
SECRET_KEY = Llave_Secreta_Para_Opiniones_2026

# Conexión local (Usar 127.0.0.1 si localhost da timeout)
URL_MONGODB = mongodb://127.0.0.1:27017/OpinionManager

# Credenciales de Cloudinary
CLOUDINARY_CLOUD_NAME = tu_cloud_name
CLOUDINARY_API_KEY = tu_api_key
CLOUDINARY_API_SECRET = tu_api_secret
```

3. Instalación  
Ejecuta los siguientes comandos en tu terminal:

```bash
npm install
node index.js
```

🔍 Explicación del Código Principal

🛡️ Autenticación y JWT  
El sistema utiliza un Middleware para proteger las rutas. El flujo funciona de la siguiente manera:

Generación: Al hacer Login, el servidor crea un token firmado con la SECRET_KEY que contiene el ID del usuario (uid).  
Validación: En cada petición protegida, el middleware validateJWT extrae el token del header x-token, lo verifica y busca al usuario en la base de datos para inyectarlo en la petición (req.user).

📁 Estructura de Controladores  

Cada módulo (Users, Posts, Comments) sigue el patrón MVC:

Controllers: Contienen la lógica de negocio (ej. verificar que solo el autor de un comentario pueda editarlo).  
Models: Definen los esquemas de Mongoose con validaciones integradas.  
Routes: Exponen los endpoints y aplican los middlewares de validación.

🔑 Cómo usar el Token en Postman  

Para que las peticiones no devuelvan el error "Token no válido", sigue estos pasos:

Obtener el Token: Realiza un POST a /login. Copia el valor del campo token.  

Configurar Headers:  
- Ve a la pestaña Headers en tu petición de Postman.  
- Agrega la llave: x-token.  
- En el valor, pega el token copiado.  

Persistencia: Si el servidor se reinicia y cambias la SECRET_KEY, deberás generar un nuevo token haciendo login otra vez.

📡 Endpoints de la API

👤 Usuarios

| Método | Endpoint  | Body (Type) | Descripción |
|---------|-----------|------------|------------|
| POST    | /register | form-data  | Registro con subida de imagen a Cloudinary. |
| POST    | /login    | JSON       | Autenticación para obtener el Token. |

📝 Publicaciones (Posts)

| Método | Endpoint    | Requiere Token | Descripción |
|---------|------------|----------------|------------|
| GET     | /posts     | No             | Lista todas las opiniones con sus autores. |
| POST    | /posts     | Sí             | Crea una publicación (el autor se asigna vía token). |
| PUT     | /posts/:id | Sí             | Actualiza un post si el usuario es el dueño. |

💬 Comentarios

| Método | Endpoint     | Body (JSON)        | Descripción |
|---------|-------------|-------------------|------------|
| GET     | /comments   | N/A               | Lista comentarios incluyendo el título del post. |
| POST    | /comments   | {text, postId}    | Agrega una respuesta a una publicación. |

⚠️ Solución de Errores Comunes

Error: req.body is undefined  
Causa: Postman envía los datos como texto plano.  
Solución: En la pestaña Body -> selecciona raw -> cambia el desplegable de la derecha a JSON.

Error: buffering timed out after 10000ms  
Causa: El servidor no puede conectar con MongoDB.  
Solución: Verifica que el servicio de MongoDB esté iniciado en tu sistema local.

Error: SyntaxError: ... does not provide an export named  
Causa: Falta la palabra export antes de la función en el controlador o el nombre está mal escrito.  
Solución: Revisa que en comment.controller.js la función tenga export const nombreFuncion.
