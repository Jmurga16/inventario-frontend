# Inventario Frontend

Frontend del Sistema de Gestión de Inventarios, desarrollado con **Angular 19** y **Angular Material**.

## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Angular | 19 | Framework principal |
| Angular Material | 19 | Componentes UI |
| TypeScript | 5.7 | Lenguaje |
| RxJS | 7.8 | Programación reactiva |
| SCSS | - | Estilos |

## Características Implementadas

### Módulo de Autenticación
- Login con email y contraseña
- Registro de nuevos usuarios
- Validación de formularios
- Protección de rutas (Guards)
- Manejo de tokens JWT

### Módulo de Productos
- Listado de productos con filtros
- Búsqueda por nombre
- Filtro por categoría
- Filtro por estado (activos)
- Filtro por stock bajo
- CRUD completo (solo Admin)

### Módulo de Notificaciones
- Badge con contador de no leídas
- Listado de notificaciones
- Marcar como leída
- Marcar todas como leídas
- Estilos diferenciados para leídas/no leídas

### Módulo de Reportes (Solo Admin)
- Tabla de productos con stock bajo
- Descarga de reporte en PDF

### Control de Acceso por Rol

| Funcionalidad | Admin | Empleado |
|---------------|-------|----------|
| Ver productos | ✅ | ✅ |
| Crear producto | ✅ | ❌ |
| Editar producto | ✅ | ❌ |
| Eliminar producto | ✅ | ❌ |
| Ver notificaciones | ✅ | ✅ |
| Ver reportes | ✅ | ❌ |
| Descargar PDF | ✅ | ❌ |

## Requisitos Previos

- **Node.js** v18.19 o superior ([descargar](https://nodejs.org/))
- **npm** v9 o superior (viene con Node.js)

Para verificar tus versiones:
```bash
node -v
npm -v
```

## Instalación

1. Navega a la carpeta del frontend:
```bash
cd inventario-frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la URL del API en `src/environments/environment.development.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001'  // URL del backend
};
```

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo en `localhost:4200` |
| `npm run build` | Build de producción |
| `npm test` | Ejecutar tests unitarios |
| `npm run watch` | Build en modo watch |

## Estructura del Proyecto

```
src/app/
├── auth/           # Autenticación (login, registro, guards, services)
├── core/           # Servicios singleton, interceptors, modelos globales
├── layout/         # Header, sidebar, estructura visual
├── modules/        # Módulos funcionales
│   ├── home/       # Página de inicio
│   ├── product/    # Gestión de productos
│   └── report/     # Reportes
└── shared/         # Componentes reutilizables
```

Para más detalles, consulta la [documentación de estructura](./docs/STRUCTURE.md).

## Variables de Entorno

| Archivo | Uso |
|---------|-----|
| `environment.development.ts` | Desarrollo local |
| `environment.ts` | Producción |

## Credenciales de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@inventario.com | Admin123! | Admin |

## Documentación Adicional

- [Estructura del proyecto](./docs/STRUCTURE.md)
- [Angular CLI Reference](https://angular.dev/tools/cli)
