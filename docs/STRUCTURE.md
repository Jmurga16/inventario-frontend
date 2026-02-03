# Estructura del Proyecto

Este documento describe la arquitectura de carpetas del frontend de Inventario.

## Vista General

```
src/
├── app/
│   ├── auth/           # Módulo de autenticación
│   ├── core/           # Servicios singleton y configuración central
│   ├── layout/         # Componentes de estructura visual
│   ├── modules/        # Módulos funcionales de la aplicación
│   └── shared/         # Código reutilizable entre módulos
├── assets/             # Recursos estáticos
├── environments/       # Configuración por entorno
└── styles.scss         # Estilos globales
```

---

## Detalle por Carpeta

### `app/auth/`
Maneja todo lo relacionado con la autenticación de usuarios.

```
auth/
├── guards/         # Protección de rutas (ej: AuthGuard)
├── models/         # Interfaces (User, LoginRequest, etc.)
├── pages/          # Componentes de página (Login, Register)
├── services/       # AuthService, TokenService
└── auth.routes.ts  # Rutas del módulo
```

---

### `app/core/`
Contiene servicios y utilidades que se instancian **una sola vez** en toda la aplicación.

```
core/
├── guards/         # Guards globales (ej: RoleGuard)
├── interceptors/   # HTTP Interceptors (auth, error handling)
├── models/         # Interfaces/tipos globales
├── services/       # Servicios singleton (API, Storage, etc.)
└── utils/          # Funciones helper reutilizables
```

> **Regla:** Los servicios en `core/` se proveen en `root` y nunca se importan en otros módulos como providers.

---

### `app/layout/`
Componentes que definen la estructura visual de la aplicación.

```
layout/
├── components/     # Header, Sidebar, Footer, MainLayout
├── models/         # Interfaces para navegación, menús
└── services/       # SidebarService, ThemeService
```

---

### `app/modules/`
Módulos funcionales de la aplicación. Cada feature tiene su propia carpeta.

```
modules/
├── products/       # Gestión de productos (por definir)
├── reports/        # Reportes e informes (por definir)
├── notifications/  # Sistema de notificaciones (por definir)
└── main.routes.ts  # Rutas principales con lazy loading
```

> **Nota:** La estructura interna de cada módulo se definirá conforme se desarrollen.

---

### `app/shared/`
Código reutilizable que puede ser importado por cualquier módulo.

```
shared/
├── components/     # Componentes genéricos (Button, Modal, Table, etc.)
├── directives/     # Directivas personalizadas
├── pipes/          # Pipes personalizados (formato fecha, moneda, etc.)
└── validators/     # Validadores de formularios personalizados
```

> **Regla:** Los elementos en `shared/` no deben tener dependencias de módulos específicos.

---

### `assets/`
Recursos estáticos de la aplicación.

```
assets/
├── images/         # Imágenes, iconos, logos
└── styles/         # Archivos SCSS parciales
    └── _index.scss # Punto de entrada para estilos parciales
```

---

### `environments/`
Configuración específica por entorno.

```
environments/
├── environment.ts              # Producción
└── environment.development.ts  # Desarrollo
```

---

## Archivos Raíz de `app/`

| Archivo | Descripción |
|---------|-------------|
| `app.component.ts` | Componente raíz de la aplicación |
| `app.config.ts` | Configuración de providers (standalone) |
| `app.routes.ts` | Definición de rutas principales |

---

## Convenciones de Nombres

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Componentes | `kebab-case` | `product-list.component.ts` |
| Servicios | `kebab-case` | `auth.service.ts` |
| Modelos | `kebab-case` | `user.model.ts` |
| Guards | `kebab-case` | `auth.guard.ts` |
| Pipes | `kebab-case` | `currency-format.pipe.ts` |

---

## Barrel Exports

Cada carpeta incluye un archivo `index.ts` para facilitar las importaciones:

```typescript
// En lugar de:
import { AuthService } from './auth/services/auth.service';
import { TokenService } from './auth/services/token.service';

// Puedes usar:
import { AuthService, TokenService } from './auth/services';
```
