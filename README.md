# Comparador de reacondicionados — despliegue en Netlify



## Privacidad (RGPD)
La IP y la ubicación son datos personales. El pie de la web incluye un aviso informativo; revísalo y
añade tu contacto si lo publicas. Desde el panel puedes **borrar todos los registros** y **exportarlos a CSV**.

## Precios automáticos
Los precios de reacondicionado están en `prices.json` (clave `categoría-modelo`, p. ej. `iphone-15pro`).
Una tarea programada de Claude los revisa a las 3:00 y a las 15:00 (hora de Madrid), actualiza este archivo
y hace commit en `main`; Netlify vuelve a publicar la web automáticamente. Si no encuentra un dato fiable,
conserva el precio anterior con su fecha. También puedes editar `prices.json` a mano.
