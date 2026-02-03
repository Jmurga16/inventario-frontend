# Inventario Frontend

Frontend del Sistema de Gestión de Inventarios, desarrollado con **Angular 19**.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18.19 o superior ([descargar](https://nodejs.org/))
- **npm** v9 o superior (viene con Node.js)
- **Angular CLI** v19 (se instala automáticamente como dependencia)

Para verificar tus versiones:
```bash
node -v
npm -v
```

## Instalación

1. Clona el repositorio y navega a la carpeta del frontend:
```bash
cd inventario-frontend
```

2. Instala las dependencias:
```bash
npm install
```

## Comandos Disponibles

### Desarrollo

Inicia el servidor de desarrollo:
```bash
npm start
```
Abre tu navegador en `http://localhost:4200`. La app se recarga automáticamente con cada cambio.

### Build

Genera el build de producción:
```bash
npm run build
```
Los archivos compilados se guardan en `dist/`.

### Tests

Ejecuta los tests unitarios:
```bash
npm test
```

## Estructura del Proyecto

```
src/app/
├── auth/       # Autenticación (login, registro, guards)
├── core/       # Servicios singleton, interceptors, utils
├── layout/     # Header, sidebar, estructura visual
├── modules/    # Módulos funcionales (productos, reportes)
└── shared/     # Componentes y utilidades reutilizables
```

Para más detalles, consulta la [documentación de estructura](./docs/STRUCTURE.md).

## Variables de Entorno

Los archivos de configuración se encuentran en `src/environments/`:

| Archivo | Uso |
|---------|-----|
| `environment.development.ts` | Desarrollo local |
| `environment.ts` | Producción |

## Scripts npm

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo en `localhost:4200` |
| `npm run build` | Build de producción |
| `npm test` | Ejecutar tests unitarios |
| `npm run watch` | Build en modo watch |

## Tecnologías

- **Angular 19** - Framework principal
- **TypeScript 5.7** - Lenguaje
- **RxJS 7.8** - Programación reactiva
- **SCSS** - Estilos

## Documentación Adicional

- [Estructura del proyecto](./docs/STRUCTURE.md)
- [Angular CLI Reference](https://angular.dev/tools/cli)
