# AWS Flashcards v2 (Hybrid Architecture)

Aplicación de Flashcards diseñada para estudiar certificaciones AWS, utilizando una arquitectura híbrida **Local-First** con **PocketBase**.

## Arquitectura

El proyecto utiliza un enfoque de **Monorepo** con dos servicios principales desplegados vía Docker Swarm:

### 1. Frontend (`/frontend`)
*   **Stack:** React + TypeScript + Vite + TailwindCSS.
*   **Estado Local:** El progreso de estudio (Cajas SRS, Fechas de repaso, Rachas) se guarda en el navegador del usuario usando **IndexedDB** (Dexie.js).
*   **Privacidad:** Cada dispositivo mantiene su propio ritmo de estudio.

### 2. Backend (`/backend`)
*   **Stack:** PocketBase (Go + SQLite).
*   **Estado Global:** Almacena el *contenido* de las tarjetas (Preguntas, Respuestas, Tags).
*   **Sincronización:**
    *   Al iniciar, el frontend descarga las cartas del backend.
    *   Al crear una carta, se sube al backend y se notifica a todos los clientes conectados en tiempo real.

## Despliegue (Docker Swarm)

El archivo `swarm.yml` orquesta ambos servicios detrás de Traefik.

```yaml
# Estructura de Red
Frontend: http://flashcards.home.arpa
Backend:  http://api.flashcards.home.arpa
```

### Comandos de Despliegue

```bash
docker stack deploy -c swarm.yml flashcards
```

## Desarrollo Local

1.  **Backend:**
    *   Descargar el ejecutable de PocketBase o correr con Docker.
    *   Crear colección `cards` (public read/write para demo).

2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
