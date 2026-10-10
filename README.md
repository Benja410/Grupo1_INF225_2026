# Grupo 4

Este es el repositorio del *Grupo 4*, cuyos integrantes son:

* Felipe Luengo - 202473509-8
* Felipe Carrasco - 202473522-5
* Bejamín Solís - 202430511-5
* Ángel Peña - 202430503-4
* **Tutor**: Miguel Huerta

## Wiki

Puede acceder a la Wiki mediante el siguiente [enlace](https://gitlab.inf.utfsm.cl/inf236-2026-1/inf236-sj-04/-/wikis/home)

## Setup proyecto
Para este proyecto se ocupa:
- Docker y Docker Compose
- (Opcional, si se ejecuta local sin Docker) Node.js (v22.16.0) y PostgreSQL (v14 o superior)

Importante: la forma recomendada de levantar el proyecto es con Docker Compose. En esta configuración, PostgreSQL también corre dentro de Docker.

### 1) Configurar variables de entorno para Docker
Docker Compose usa el archivo `.env.docker`. El repositorio ya incluye valores de desarrollo para levantar la base de datos, backend y frontend.

Si necesitas cambiar credenciales o nombre de la base de datos, modifica `.env.docker` y luego recrea los contenedores.

## 2) Configuración de la Base de Datos
Para este proyecto, se utiliza **PostgreSQL** dentro de Docker.

### 2.1) Inicialización automática
Al ejecutar Docker Compose, se crea el contenedor de PostgreSQL y el backend ejecuta automáticamente la migración con `esquema.sql`.

```bash
docker compose up --build
```

Servicios disponibles:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

Para conectarse a PostgreSQL dentro del contenedor:

```bash
docker compose exec db psql -U usuario -d practica
```
Contraseña: `password`

También se expone en `localhost:5432`, pero si tienes PostgreSQL instalado localmente puede haber conflictos. En ese caso, usa el comando con `docker compose exec`.

Si hay problemas de credenciales por datos antiguos en Docker, reinicia eliminando el volumen de la base de datos:

```bash
docker compose down -v
docker compose up --build
```

Advertencia: `docker compose down -v` borra los datos guardados en la base de datos Docker.


## Videos

> Reemplazar con los enlaces correspondientes

* [Video presentación cliente](https://www.youtube.com)
* [Video presentación avance Hito3](https://usmcl-my.sharepoint.com/:v:/g/personal/bsolisl_usm_cl/IQCDaT4oQ2IhSrDkbC-OOwiKAWNM2SooF8fZjQQKkWWb-p8?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=aRNdUE)
* [Video presentación avance final Hito 5](https://usmcl-my.sharepoint.com/:v:/g/personal/bsolisl_usm_cl/IQCiKqOyy2TDSLUemhcvEYaMAcl8eLiXLP-KDA9XYumSWVY?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=FwIN75)

## Aspectos técnicos relevantes

Adjuntamos a continuación algunas credenciales de acceso para hacer pruebas:

- Estudiante:
```bash
mail: rpenax@usm.cl
password: 1234
```
- Empresa:
```bash
mail: rrhh@felicity.cl || empleos@iaspa.cl
password: 1234 (ambas)
```
- Encargado de práctica:
```bash
mail: coordinador.practicas@usm.cl
password: 1234
```

 
