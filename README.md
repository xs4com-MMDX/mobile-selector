# Comparador de reacondicionados — despliegue en Netlify



## Privacidad (RGPD)
La IP y la ubicación son datos personales. El pie de la web incluye un aviso informativo; revísalo y
añade tu contacto si lo publicas. Desde el panel puedes **borrar todos los registros** y **exportarlos a CSV**.

## Precios automáticos
Los precios de reacondicionado están en `prices.json` (clave `categoría-modelo`, p. ej. `iphone-15pro`).
Una tarea programada de Claude los revisa a las 3:00 y a las 15:00 (hora de Madrid) y los guarda en la rama
**`precios`** (no en `main`). La web los lee directamente de GitHub
(`raw.githubusercontent.com/xs4com-MMDX/mobile-selector/precios/prices.json`), así que **no hace falta volver a
desplegar en Netlify** y no se gastan créditos (cada despliegue de producción cuesta 15 créditos).
Si GitHub no responde, la web usa el `prices.json` de `main` como respaldo. Para cambiar un precio a mano,
edita `prices.json` en la rama `precios`.
