# Chat Agent con LLM - Laboratorio S12

Aplicación web de chat inteligente que integra un Large Language Model (LLM) mediante la API de OpenAI, implementada con Spring Boot y dockerizada para facilitar su despliegue.

## 📋 Descripción

Este proyecto implementa un agente de chat conversacional que:
- Se comunica con la API de OpenAI (GPT-3.5-turbo)
- Mantiene historial de conversaciones en base de datos SQLite
- Proporciona interfaz web responsive con Thymeleaf
- Está completamente dockerizado para portabilidad

## 🛠️ Tecnologías Utilizadas

- **Backend**: Spring Boot 3.4.0
- **Frontend**: Thymeleaf, HTML5, CSS3, JavaScript
- **Base de datos**: SQLite con JPA/Hibernate
- **LLM**: OpenAI GPT-3.5-turbo
- **Containerización**: Docker y Docker Compose
- **Java**: JDK 21

## 📁 Estructura del Proyecto

chat-agent/
├── src/
│ ├── main/
│ │ ├── java/com/example/chatagent/
│ │ │ ├── controller/
│ │ │ │ └── ChatController.java
│ │ │ ├── service/
│ │ │ │ └── ChatService.java
│ │ │ ├── entity/
│ │ │ │ └── Conversation.java
│ │ │ ├── repository/
│ │ │ │ └── ConversationRepository.java
│ │ │ └── ChatAgentApplication.java
│ │ └── resources/
│ │ ├── application.properties
│ │ ├── templates/
│ │ │ └── chat.html
│ │ └── static/js/
│ │ └── chat.js
├── data/
│ └── chat.db
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── pom.xml


## 🚀 Instalación y Ejecución

### Requisitos Previos

- Java 21+
- Maven 3.6+
- Docker y Docker Compose
- API Key de OpenAI

### Configuración

1. **Clonar el repositorio**:
   git clone <tu-repositorio>
   cd chat-agent
2. **Configurar API Key**:
   Editar `src/main/resources/application.properties`:
   openai.api.key=tu-api-key-aqui

### Ejecución Local
Compilar
./mvnw clean package

Ejecutar
./mvnw spring-boot:run

Acceder a: http://localhost:8080

### Ejecución con Docker
Construir imagen
docker-compose build

Ejecutar contenedor
docker-compose up

Ejecutar en segundo plano
docker-compose up -d

Detener
docker-compose down

## 🎯 Funcionalidades

### 1. Chat Conversacional
- Interfaz web intuitiva y responsive
- Envío de mensajes en tiempo real
- Respuestas generadas por GPT-3.5-turbo

### 2. Persistencia de Datos
- Historial completo de conversaciones
- Base de datos SQLite embebida
- Consultas por ID de usuario

### 3. Arquitectura de Microservicios
- Separación clara de responsabilidades (MVC)
- Repository pattern con Spring Data JPA
- Service layer para lógica de negocio

### 4. Dockerización
- Imagen multi-stage para optimización
- Volúmenes persistentes para datos
- Variables de entorno configurables

## 📊 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Interfaz principal del chat |
| POST | `/chat/send` | Enviar mensaje al LLM |
| GET | `/chat/history` | Obtener historial de conversación |

## 🔧 Configuración Avanzada

### Variables de Entorno

En `docker-compose.yml`:
environment:

SPRING_DATASOURCE_URL=jdbc:sqlite:/app/data/chat.db

OPENAI_API_KEY=tu-api-key

OPENAI_MODEL=gpt-3.5-turbo

### Base de Datos

SQLite configurado en `application.properties`:
spring.datasource.url=jdbc:sqlite:chat.db
spring.jpa.hibernate.ddl-auto=update

Ejecutar tests
./mvnw test

Con cobertura
./mvnw clean verify

## 📝 Conclusiones

1. **Integración exitosa** de LLM en aplicación web mediante API de OpenAI
2. **Arquitectura robusta** basada en patrones MVC y Repository
3. **Persistencia efectiva** de conversaciones con SQLite/JPA
4. **Dockerización completa** garantiza portabilidad y fácil despliegue
5. **Experiencia de usuario** fluida con interfaz responsive

## 👨‍💻 Autor

**José Carlos Vitorino Condori**
- TECSUP Arequipa
- Desarrollo de Software
- Laboratorio S12 - 2025

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para el curso de Desarrollo de Software en TECSUP.





