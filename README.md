# AWS Flashcards v2 (Webapp)

Versión modernizada de la aplicación de flashcards para AWS CLF-C02.

## Mejoras v2
- **Tech Stack**: React 18 + TypeScript + Vite.
- **UI/UX**: Diseño moderno inspirado en AWS usando Tailwind CSS.
- **Animaciones**: Flashcards con efecto 3D y transiciones fluidas con Framer Motion.
- **Dashboard**: Vista de estadísticas con progreso por dominio de AWS y estado del algoritmo SRS.
- **Algoritmo SRS**: Implementación refinada del sistema Leitner.
- **Gestión**: Editor de cartas mejorado con búsqueda y filtrado.

## Características heredadas
- **Offline First**: Persistencia total en el navegador con IndexedDB.
- **Seed Data**: Incluye las cartas base del mazo.
- **Import/Export**: Soporte para XLSX y JSON.

## Cómo correr
1. Entra al directorio: `cd aws-flashcards-v2`
2. Instala dependencias: `npm install`
3. Inicia desarrollo: `npm run dev`
4. Construye para producción: `npm run build`

## Estructura del proyecto
- `src/components`: Componentes presentacionales y piezas de UI reutilizables.
- `src/containers`: Coordinación de vistas, filtros y eventos.
- `src/hooks`: Hooks de datos, transferencia y estado compartido.
- `src/utils`: Persistencia, bootstrap del seed, algoritmo SRS y utilidades auxiliares.
- `src/types.ts`: Tipos principales del dominio.
