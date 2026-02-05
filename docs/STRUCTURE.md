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
├── guards/             # Protección de rutas
│   └── auth.guard.ts   # Verifica autenticación
├── models/             # Interfaces
│   ├── auth-response.interface.ts
│   ├── login-request.interface.ts
│   └── register-request.interface.ts
├── pages/              # Componentes de página
│   ├── login/          # Página de login
│   └── register/       # Página de registro
├── services/           # Servicios de autenticación
│   ├── auth.service.ts    # Login, registro, logout
│   └── token.service.ts   # Manejo de JWT
├── styles/             # Estilos compartidos
│   └── auth-shared.scss   # Estilos comunes para auth
└── auth.routes.ts      # Rutas del módulo
```

---

### `app/core/`
Contiene servicios y utilidades que se instancian **una sola vez** en toda la aplicación.

```
core/
├── guards/             # Guards globales
│   └── role.guard.ts   # Verifica rol del usuario
├── interceptors/       # HTTP Interceptors
│   ├── token.interceptor.ts   # Agrega JWT a requests
│   ├── error.interceptor.ts   # Manejo de errores HTTP
│   └── loading.interceptor.ts # Estado de carga global
├── models/             # Interfaces globales
│   └── api-response.model.ts  # Wrapper de respuestas API
├── services/           # Servicios singleton
│   ├── loading.service.ts           # Estado de carga
│   ├── notification.service.ts      # Snackbar/Toast
│   └── notification-state.service.ts # Estado de notificaciones
└── utils/              # Funciones helper
```

> **Regla:** Los servicios en `core/` se proveen en `root` y nunca se importan en otros módulos como providers.

---

### `app/layout/`
Componentes que definen la estructura visual de la aplicación.

```
layout/
├── components/
│   ├── header/              # Barra superior
│   │   ├── header.component.ts
│   │   └── header-menu/     # Menú de usuario
│   └── sidenav/             # Menú lateral
│       ├── sidenav.component.ts
│       └── sidenav-item/    # Items del menú
├── models/
│   ├── side-menu-item.interface.ts  # Modelo de item de menú
│   └── header-menu-item.interface.ts
├── services/
│   ├── layout.service.ts     # Control del layout
│   └── side-menu.service.ts  # Eventos del menú
└── layout.component.ts       # Layout principal
```

**Control de acceso en menú:**
```typescript
// Los items de menú pueden restringirse por rol
{
  id: 3,
  title: 'Reporte',
  icon: 'assessment',
  url: '/main/report',
  roles: ['Admin']  // Solo visible para Admin
}
```

---

### `app/modules/`
Módulos funcionales de la aplicación. Cada feature tiene su propia carpeta.

```
modules/
├── home/               # Página de inicio
│   └── pages/
│       └── home/
├── product/            # Gestión de productos
│   ├── models/         # Interfaces de producto
│   ├── pages/
│   │   ├── product-list/    # Listado con filtros
│   │   └── product-form/    # Crear/Editar
│   ├── services/
│   │   └── product.service.ts
│   └── product.routes.ts
├── report/             # Reportes (Solo Admin)
│   ├── models/
│   ├── pages/
│   │   └── report/          # Tabla y descarga PDF
│   ├── services/
│   │   └── report.service.ts
│   └── report.routes.ts
└── main.routes.ts      # Rutas con lazy loading
```

---

### `app/shared/`
Código reutilizable que puede ser importado por cualquier módulo.

```
shared/
├── components/         # Componentes genéricos
├── directives/         # Directivas personalizadas
├── pipes/              # Pipes personalizados
└── validators/         # Validadores de formularios
```

> **Regla:** Los elementos en `shared/` no deben tener dependencias de módulos específicos.

---

### `assets/`
Recursos estáticos de la aplicación.

```
assets/
├── images/         # Imágenes, iconos, logos
└── styles/         # Archivos SCSS parciales
```

---

### `environments/`
Configuración específica por entorno.

```
environments/
├── environment.ts              # Producción
└── environment.development.ts  # Desarrollo
```

**Ejemplo:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001'
};
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
| Modelos | `kebab-case` | `product.interface.ts` |
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

---

## Flujo de Autenticación

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────►│ AuthService │────►│   API       │
│   Page      │     │             │     │   /auth     │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │TokenService │
                    │ localStorage│
                    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │Interceptor  │
                    │ JWT Header  │
                    └─────────────┘
```

---

## Control de Acceso

El sistema implementa control de acceso basado en roles:

1. **AuthGuard**: Verifica que el usuario esté autenticado
2. **RoleGuard**: Verifica que el usuario tenga el rol requerido
3. **Menú dinámico**: Items se muestran/ocultan según rol
4. **UI condicional**: Botones y acciones según rol

```typescript
// En componentes
get isAdmin(): boolean {
  return this.authService.hasRole('Admin');
}

// En template
@if (isAdmin) {
  <button>Crear Producto</button>
}
```
