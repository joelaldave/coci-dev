# Coci Dev - Gestor de Tareas Kanban

Coci Dev es una aplicación web desarrollada en Angular que permite gestionar tareas de manera eficiente utilizando un tablero Kanban moderno y responsivo. 

## Características principales

- **Tablero Kanban**: Visualiza y organiza tareas en columnas personalizadas (Por hacer, En proceso, En revisión, Terminadas).
- **Arrastrar y soltar**: Cambia tareas de columna y reordénalas fácilmente con drag & drop.
- **Vista de lista**: Alterna entre vista Kanban y vista de lista para adaptarse a tus preferencias.
- **Creación y edición de tareas**: Añade, edita y elimina tareas con formularios modales amigables.
- **Asignación y seguimiento**: Asigna responsables, categorías, prioridades y fechas límite a cada tarea.
- **Indicadores visuales**: Badges de estado, prioridad, vencimiento y progreso.
- **Estadísticas**: Visualiza el total de tareas y el estado de cada columna.
- **Persistencia local**: Las tareas se guardan en el almacenamiento local del navegador.
- **Diseño moderno**: Interfaz responsiva y atractiva usando [daisyUI 5](https://daisyui.com/) y Tailwind CSS 4.
- **Soporte para temas**: Cambia el tema visual fácilmente gracias a daisyUI.

## 🏗️ Arquitectura del Proyecto

```
src/app/
├── core/                          # Servicios core y configuración
├── feature/dashboard/todo-list/   # Módulo principal de tareas
│   ├── components/               # Componentes UI
│   │   ├── kanban-board/        # Tablero Kanban
│   │   ├── list-board/          # Vista de lista
│   │   ├── task-modal/          # Modal de tareas
│   │   ├── card-kanban-item/    # Tarjeta de tarea
│   │   └── delete-task-modal/   # Modal de eliminación
│   ├── interfaces/              # Tipos TypeScript
│   │   ├── task.interface.ts    # Interfaces de tareas
│   │   └── task-storage.interface.ts
│   ├── services/               # Servicios de negocio
│   │   ├── task.service.ts     # Lógica principal
│   │   ├── task-local-storage.service.ts
│   │   └── time-tracking.service.ts
│   └── pages/                  # Páginas principales
│       └── general-page/       # Página principal
├── layouts/                    # Layouts de aplicación
├── shared/                     # Componentes compartidos
└── utils/                      # Utilidades
```

## 🎉 Créditos

- **Desarrollado por**: [@dev_coci](https://github.com/dev_coci)
- **UI Framework**: [daisyUI 5](https://daisyui.com/)
- **CSS Framework**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Frontend Framework**: [Angular](https://angular.dev/)


## Instalación y uso

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/coci-dev.git
   cd coci-dev
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación:
   ```bash
   npm start
   ```
   Luego abre [http://localhost:4200](http://localhost:4200) en tu navegador.


## Créditos

Desarrollado por @dev_coci.  
UI potenciada por [daisyUI 5](https://daisyui.com/) y [Tailwind CSS 4](https://tailwindcss.com/).
