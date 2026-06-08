# PortafolioJPMR

Portafolio personal construido con Angular 19, TailwindCSS y despliegue estático en Vercel.

## Desarrollo local

### Solo frontend

```bash
npm install
ng serve
```

La app estará en `http://localhost:4200/`. Los datos se cargan desde `src/Assets/Data/*.json`.

### Formulario de contacto (con API)

El envío de correo pasa por la función serverless `api/contact.ts`. Para probarlo en local:

1. Copia `.env.example` a `.env.local` y completa las variables de EmailJS.
2. Instala Vercel CLI: `npm i -g vercel`
3. En una terminal, ejecuta `vercel dev` (puerto 3000, sirve la API).
4. En otra terminal, ejecuta `ng serve` (el proxy en `proxy.conf.json` redirige `/api` a `localhost:3000`).

Alternativa: `vercel dev` puede servir también el build de Angular si se configura el proyecto en Vercel.

## Variables de entorno

Configúralas en **Vercel Dashboard → Settings → Environment Variables** (nunca en el repositorio):

| Variable | Descripción |
|----------|-------------|
| `EMAILJS_PRIVATE_KEY` | Private Key de EmailJS (solo servidor) |
| `EMAILJS_PUBLIC_KEY` | Public Key / User ID de EmailJS |
| `EMAILJS_SERVICE_ID` | ID del servicio EmailJS |
| `EMAILJS_TEMPLATE_ID` | ID de la plantilla EmailJS |

**Importante:** regenera las claves en EmailJS si estuvieron expuestas previamente en el cliente.

## Build y despliegue

```bash
ng build --configuration production
```

Vercel usa `vercel.json` para el build estático y las funciones en `api/`.

## Tests

```bash
ng test
```

## Estructura relevante

- `src/Assets/Data/` — contenido del portafolio (proyectos, skills, about)
- `api/contact.ts` — proxy seguro para EmailJS
- `src/app/Services/contact.service.ts` — cliente HTTP del formulario
- `src/environments/` — configuración por entorno
