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
    *   El contenido inicial del mazo debe cargarse en PocketBase mediante importación o creación manual.
    *   Al crear una carta, se sube al backend y se notifica a todos los clientes conectados en tiempo real.

## Despliegue (Docker Swarm)

El archivo `swarm.yml` orquesta ambos servicios detrás de Traefik y utiliza **Docker Secrets** para gestionar las credenciales de administración del backend de forma segura.

### 1. Generar Secretos
Antes de desplegar, debes crear los secretos en tu Swarm. Estos serán usados por PocketBase para crear la cuenta de administrador inicial.

```powershell
# Reemplaza 'admin@email.com' y 'tu_password_segura' por tus credenciales reales
echo "admin@email.com" | docker secret create pb_admin_email -
echo "tu_password_segura" | docker secret create pb_admin_password -
```

*(Si usas Linux/Bash, usa `printf` en lugar de `echo` para evitar saltos de línea extra)*

### 2. Comandos de Despliegue

```bash
docker stack deploy -c swarm.yml flashcards
```

---

## Cómo Funciona (Detalles Técnicos)

### Algoritmo de Repaso (SRS)
La aplicación utiliza una variación del **Sistema Leitner** para optimizar el aprendizaje mediante la repetición espaciada.

1.  **Cajas de Estudio:** Cada tarjeta se asigna a una "Caja" del 1 al 5, que representa qué tan bien la dominas.
    *   **Caja 1:** Nueva / Difícil (Repaso diario).
    *   **Caja 5:** Dominada (Repaso cada 2 semanas).
2.  **Cálculo de Próxima Revisión (`NextDue`):**
    *   Al calificar una tarjeta como **"Difícil"**: Regresa a la Caja 1 y se repasa hoy mismo.
    *   **"Bien"**: Sube 1 caja.
    *   **"Fácil"**: Sube 2 cajas (salta niveles para evitar repeticiones innecesarias).
3.  **Selección de Cartas:**
    El sistema prioriza siempre las cartas de la **Caja más baja** que estén vencidas hoy. Esto asegura que siempre estudies lo que más te cuesta primero.

### Medición del Progreso
*   **Cartas Aprendidas:** Se consideran "Aprendidas" aquellas que alcanzan la **Caja 4 o superior**. Esto indica que has recordado la respuesta correctamente varias veces consecutivas a lo largo de varios días.
*   **Racha (Streak):** Cada tarjeta tiene su propia racha de aciertos consecutivos. El "Esfuerzo Total" mostrado en el dashboard es la suma de las rachas de todas tus cartas, gamificando la consistencia.

---

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
