# Comparador de reacondicionados — despliegue en Netlify

## Contenido
- `index.html` — la web (iPhone, iPad, Apple Watch, AirPods).
- `admin.html` — panel privado de visitas (se abre pulsando el contador del pie de página).
- `netlify/functions/` — `track` (registra cada visita), `stats` (contador público) y `visits` (listado protegido).
- `images.json` + carpeta `img/` — fotos reales de los dispositivos (ver `FOTOS.md`). Sin foto, se muestra el dibujo.
- `netlify.toml`, `package.json`, `robots.txt`.

Las visitas se guardan en **Netlify Blobs** (incluido en Netlify, no hay que configurar nada).

## Importante: no sirve arrastrar y soltar
Netlify Drop (arrastrar la carpeta) publica solo la web estática: **el contador y el panel no funcionarán**,
porque las funciones necesitan instalar `@netlify/blobs`. Usa una de estas dos opciones:

### Opción A — GitHub (recomendada)
1. Crea un repositorio en GitHub y sube todos estos archivos (manteniendo las carpetas).
2. En Netlify: **Add new project → Import an existing project → GitHub** y elige el repositorio.
   No cambies nada de la configuración de build (ya viene en `netlify.toml`). Pulsa **Deploy**.

### Opción B — Netlify CLI
```bash
npm install -g netlify-cli
cd carpeta-del-proyecto
npm install
netlify login
netlify init          # crea o enlaza el proyecto
netlify deploy --prod
```

## Contraseña del panel
1. En Netlify: **Project configuration → Environment variables → Add a variable**.
2. Clave: `ADMIN_PASSWORD` · Valor: la contraseña que quieras (larga, 12+ caracteres).
3. Vuelve a desplegar (**Deploys → Trigger deploy → Deploy site**) para que la función la lea.

Para cambiar la contraseña, edita la variable y vuelve a desplegar.

## Qué se registra por visita
Fecha y hora, IP, ciudad / región / país (ubicación aproximada que da Netlify a partir de la IP),
zona horaria, coordenadas aproximadas, navegador (user agent), idioma, tamaño de pantalla y web de origen.
Cada navegador cuenta una visita por sesión (al cerrar la pestaña y volver, cuenta otra).

## Privacidad (RGPD)
La IP y la ubicación son datos personales. El pie de la web incluye un aviso informativo; revísalo y
añade tu contacto si lo publicas. Desde el panel puedes **borrar todos los registros** y **exportarlos a CSV**.
