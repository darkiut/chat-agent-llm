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

## 🔗 Arquitectura de Microservicios

### Microservicio 1: Chat Agent (Spring Boot)
- **Lenguaje**: Java 21
- **Framework**: Spring Boot 3.4.0
- **Puerto**: 8080
- **Responsabilidades**:
    - Interfaz web con Thymeleaf
    - Gestión de conversaciones
    - Persistencia en SQLite
    - Integración con OpenAI GPT-3.5
    - Orquestación de llamadas al LLM Toy

### Microservicio 2: LLM Toy Service (Python)
- **Lenguaje**: Python 3.11
- **Framework**: FastAPI
- **Puerto**: 8001
- **Responsabilidades**:
    - Modelo de lenguaje simple con PyTorch
    - Generación de tokens con probabilidades
    - Cálculo de logprobs y alternativas
    - API REST documentada con Swagger

### Comunicación entre Microservicios
Usuario → Frontend (Thymeleaf)
↓
Spring Boot (8080)
↓
├─→ OpenAI API (GPT-3.5)
└─→ Python Service (8001)
↓
PyTorch LLM Toy

## 🐳 Docker Compose

Los servicios están orquestados mediante Docker Compose:

services:

chat-agent (Spring Boot)

llm-toy-service (Python/FastAPI)

network: microservices-network (bridge)

### Comandos Docker

Construir ambos servicios
docker-compose build

Ejecutar en primer plano
docker-compose up

Ejecutar en segundo plano
docker-compose up -d

Ver logs en tiempo real
docker-compose logs -f

Ver estado de servicios
docker-compose ps

Detener servicios
docker-compose down

Reconstruir desde cero
docker-compose down --rmi all
docker-compose build --no-cache
docker-compose up

## 📡 Endpoints API

### Spring Boot (Puerto 8080)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Interfaz web del chat |
| POST | `/chat/send` | Enviar mensaje a GPT-3.5 |
| POST | `/chat/send-toy` | Enviar mensaje al LLM Toy |
| GET | `/chat/history` | Obtener historial |
| GET | `/chat/toy-status` | Estado del servicio Python |

### Python LLM Toy (Puerto 8001)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Estado del servicio |
| GET | `/health` | Health check |
| POST | `/generate` | Generar tokens con probabilidades |
| GET | `/vocab` | Obtener vocabulario disponible |
| GET | `/docs` | Documentación Swagger |

## 🧪 Pruebas

### Probar el LLM Toy directamente

curl -X POST "http://localhost:8001/generate"
-H "Content-Type: application/json"
-d '{"prompt": "la suma de"}'

### Verificar salud de servicios

Spring Boot
curl http://localhost:8080/chat/toy-status

Python
curl http://localhost:8001/health
undefined
## 📝 Conclusiones

### Laboratorio 12 (Base)
1. Integración exitosa de LLM en aplicación web mediante API de OpenAI
2. Arquitectura robusta basada en patrones MVC y Repository
3. Persistencia efectiva de conversaciones con SQLite/JPA
4. Dockerización completa garantiza portabilidad
5. Experiencia de usuario fluida con interfaz responsive

### Laboratorio 13 (Microservicios)
1. **Arquitectura Políglota**: Se implementó exitosamente una arquitectura de microservicios utilizando dos lenguajes diferentes (Java y Python), demostrando que cada servicio puede usar el stack tecnológico más apropiado para su función específica. Spring Boot maneja la orquestación y presentación, mientras Python/PyTorch ejecuta el procesamiento de ML.

2. **Comunicación entre Microservicios**: La integración mediante REST API entre servicios dockerizados demuestra el desacoplamiento efectivo. El uso de Docker Networks permite que los contenedores se comuniquen por nombre de servicio sin exponer puertos innecesariamente al host.

3. **LLM de Juguete con PyTorch**: Se construyó un modelo de lenguaje simplificado que ilustra los conceptos fundamentales de los LLMs reales: embeddings, softmax para probabilidades, y sampling. Aunque es un modelo "toy", demuestra cómo calcular y visualizar las probabilidades de generación token por token, concepto crucial para entender GPT, BERT y otros transformers.

4. **Escalabilidad Horizontal**: La arquitectura basada en Docker Compose facilita escalar servicios independientemente. Si el LLM Toy necesita más recursos, se puede escalar solo ese servicio sin afectar el backend principal. Esto prepara el camino hacia orquestadores como Kubernetes.

5. **Observabilidad y Debugging**: FastAPI proporciona documentación Swagger automática (/docs), facilitando el testing y debugging. Los health checks permiten monitoreo del estado de servicios. Esta separación de concerns mejora la mantenibilidad y permite a equipos especializados trabajar en cada microservicio de forma independiente.

# Ver servicios corriendo
docker-compose ps

# Ver logs de ambos servicios
docker-compose logs

# Ver logs solo del servicio Python
docker-compose logs llm-toy-service

# Verificar salud del LLM Toy
curl http://localhost:8001/health

# Probar generación directa
curl -X POST "http://localhost:8001/generate" \
-H "Content-Type: application/json" \
-d '{"prompt": "la suma de"}'



