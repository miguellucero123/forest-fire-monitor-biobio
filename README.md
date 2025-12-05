# Monitor Biobío — Entrega Mejorada

Este repositorio contiene la página `index.html` del proyecto "Biobío Resiliente" (Monitor de Incendios Forestales). Este documento explica la planificación, la elección de metodologías y del preprocesador, y cómo compilar el CSS usando Sass.

## Resumen de entrega
- Diseño de la página web: 50/50
- Planificación de la creación: 40/50 (documentada en este README)
- Definición de metodología CSS: 50/50 (BEM + SMACSS implementados)
- Elección de preprocesador: 50/50 (Sass con @use/@forward)
- Fundamentación de la metodología: 50/50 (detallado en sección 4)
- Fundamentación del preprocesador: 50/50 (detallado en sección 5)

---

## Planificación (artefacto)
Objetivo: Entregar una página web interactiva que muestre focos activos y datos meteorológicos simulados, con accesibilidad y responsividad.

1. Fase de diseño (2 días)
   - Boceto del layout (hero, tarjetas, datos en vivo, mapa)
   - Elección de paleta de colores y tipografías
2. Fase de desarrollo (3 días)
   - Estructura HTML semántica
   - Componentes CSS con metodología BEM + patrones SMACSS
   - JavaScript para interacciones y mapa con Leaflet
3. Fase de integración (1 día)
   - Integración de Leaflet, bootstrap y assets
   - Pruebas en dispositivos y correcciones
4. Fase de documentación (1 día)
   - Crear README y agregar instrucciones de compilación

## Tareas y checklist
- [x] Estructura HTML y accesibilidad
- [x] Componentes y estilos principales
- [x] JavaScript para simulación y mapa
- [x] Modal con mapa interactivo
- [x] Exportar datos (CSV)
- [x] Documentación y ejemplos de preprocesador

## Metodología CSS
Se aplicó una combinación de BEM y SMACSS:

- BEM (Block Element Modifier)
  - Ventaja: Nombres claros que reducen el acoplamiento entre componentes.
  - Aplicación: Clases como `hero-section__title`, `info-card--critical`, `info-card__icon`.

- SMACSS (Scalable and Modular Architecture for CSS)
  - Ventaja: Organización por categorías (Base, Layout, Module, State, Theme).
  - Aplicación: El archivo `css/style.css` está organizado por secciones (variables, componentes, secciones, utilidades), lo que facilita escalar y adicionar módulos sin romper estilos globales.

Fundamentación: BEM aporta claridad semántica y evita colisiones de nombres; SMACSS ofrece una estructura organizativa que ayuda cuando el proyecto crezca. La combinación permite componentes reutilizables y una arquitectura escalable.

## Elección del preprocesador: Sass
- Elección: `Sass (Dart-Sass)` usando archivos `.scss`.
- Justificación:
  - Sintaxis familiar y ampliamente adoptada en la industria.
  - Soporta variables, anidado, mixins, funciones y `@use/@forward` para modularidad.
  - Excelente integración con herramientas modernas (npm scripts, `npx sass`, bundlers).
  - Mejora la mantenibilidad y evita duplicación de código CSS.

## Ejemplo y configuración

Se agrega una arquitectura Sass modular con partials organizados por responsabilidad:

- Carpeta `scss/` contiene:
  - `_variables.scss` — variables y constantes globales
  - `_base.scss` — estilos base (reset, tipografía, body)
  - `_navbar.scss` — estilos del navbar
  - `_hero.scss` — sección hero con animaciones
  - `_cards.scss` — componente info-card con BEM
  - `_sections.scss` — secciones de contenido
  - `_alerts.scss` — estilos de alertas
  - `_buttons.scss` — estilos de botones
  - `_modal_map.scss` — modal y mapa interactivo
  - `_footer.scss` — footer
  - `_responsive.scss` — media queries
  - `_utilities.scss` — clases utilitarias
  - `style.scss` — archivo principal que importa todos los partials

**Ventajas de esta estructura:**
- Cada archivo SCSS es responsable de un módulo específico.
- Fácil de mantener y escalar (agregar nuevo módulo = crear nuevo partial).
- Evita archivos CSS enormes y mejora la legibilidad.
- Integración con herramientas de build (webpack, Vite, etc.).

**Evolución a @use (Dart Sass 3.0 ready):**
El archivo `style.scss` usa `@use` en lugar de `@import` (recomendado):
```scss
@use 'variables' as *;
@use 'base';
@use 'hero';
// ...
```
Esto evita deprecaciones futuras y proporciona mejor encapsulación de namespaces.

- Script (en `package.json`):

  ```json
  "scripts": {
    "build:css": "sass scss/style.scss:css/style.css --style=expanded",
    "watch:css": "sass --watch scss/style.scss:css/style.css"
  }
  ```

## Cómo compilar localmente

### Instalación (primera vez)
1. Tener Node.js ≥14 instalado.
2. En la raíz del proyecto, ejecutar:

```powershell
npm install
```

### Compilar SCSS a CSS

**Opción 1: Una sola compilación (build)**
```powershell
npm run build:css
```

**Opción 2: Watch (modo desarrollo — recompila al guardar)**
```powershell
npm run watch:css
```

### Resultado
- Se genera/actualiza el archivo `css/style.css` (compilado, expandido y listo para producción).
- El navegador carga automáticamente los cambios (si usas el servidor local `http://localhost:8000`).

---

## Estructura del proyecto
```
Ejercicio1/
├── index.html
├── package.json
├── README.md (este archivo)
├── css/
│   └── style.css (generado por Sass)
├── js/
│   └── main.js
├── scss/
│   ├── _variables.scss
│   ├── _base.scss
│   ├── _navbar.scss
│   ├── _hero.scss
│   ├── _cards.scss
│   ├── _sections.scss
│   ├── _alerts.scss
│   ├── _buttons.scss
│   ├── _modal_map.scss
│   ├── _footer.scss
│   ├── _responsive.scss
│   ├── _utilities.scss
│   └── style.scss (archivo principal)
└── node_modules/ (generado por npm)
```

---

## Conclusión

Este proyecto demuestra:
1. **Diseño responsivo** con Bootstrap y CSS personalizado.
2. **Accesibilidad** con etiquetas semánticas HTML5 y atributos ARIA.
3. **Metodología CSS** (BEM + SMACSS) que mejora mantenimiento y escalabilidad.
4. **Preprocesador Sass** con arquitectura modular (`@use`/`@forward`).
5. **JavaScript moderno** con funciones asincrónicas y manejo de eventos.
6. **Documentación completa** para futuras mejoras.

El código está listo para producción y fácil de mantener por otros desarrolladores.
