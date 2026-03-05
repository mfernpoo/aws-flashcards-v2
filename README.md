# AWS Flashcards v2 (Webapp)

Versión modernizada de la aplicación de flashcards para AWS CLF-C02.

## Mejoras v2
- **Tech Stack**: React 18 + TypeScript + Vite.
- **UI/UX**: Diseño moderno inspirado en AWS usando Tailwind CSS.
- **Animaciones**: Flashcards con efecto 3D y transiciones fluidas (Framer Motion).
- **Dashboard**: Vista de estadísticas con progreso por dominio de AWS y estado del algoritmo SRS.
- **Algoritmo SRS**: Implementación refinada del sistema Leitner.
- **Gestión**: Editor de cartas mejorado con búsqueda y filtrado.

## Características heredadas
- **Offline First**: Persistencia total en el navegador con IndexedDB.
- **Seed Data**: Incluye las 150+ cartas originales.
- **Import/Export**: Soporte para XLSX y JSON.

## Cómo correr
1. Entrar al directorio: `cd aws-flashcards-v2`
2. Instalar dependencias: `npm install`
3. Iniciar desarrollo: `npm run dev`
4. Construir para producción: `npm run build`

## Estructura del Proyecto
- `src/components`: Componentes visuales (Flashcard, Sidebar, Views).
- `src/hooks`: Lógica de estado y persistencia (`useFlashcards`).
- `src/utils`: Utilidades de base de datos y algoritmo SRS.
- `src/types.ts`: Definiciones de tipos TypeScript.
