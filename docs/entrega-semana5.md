# Entrega de la semana 5

## Correspondencia con la guía

| Apartado                   | Implementación o evidencia                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| 1. Propósito y continuidad | Nova, HTML semántico, navegación, Grid, Flexbox, metadatos y responsive                    |
| 2. Entorno                 | public como raíz; Node; HTTP; IDs únicos; nombres FormData; ui.js solo menú                |
| 3. Fuente única            | servicios.json original con cinco servicios, contrato y relación por ID                    |
| 4. Catálogo y opciones     | catalogo.js con fetch, validación y generación de ambas vistas                             |
| 5. DOM y animaciones       | textContent, createElement, clases permitidas, transition y animation, movimiento reducido |
| 6. Ayuda y eventos         | hidden y ARIA; click, submit, input, change y keydown                                      |
| 7. Validación              | Nombre, servicio, correo, prioridad, descripción útil; foco, errores y contador            |
| 8. Estados                 | Espera 600 ms; captura de FormData; bloqueo, confirmación y finally                        |
| 9. Reto                    | Arreglo temporal, códigos correlativos, tabla segura y reinicio al recargar                |
| 9. Supabase conceptual     | README: API, PostgreSQL, autenticación, permisos y persistencia futura                     |
| 10. Pruebas                | Matriz y resultados del navegador; capturas nuevas en semana5                              |
| 11. Entrega y reflexión    | README y esta lista; pasos remotos y revisión humana pendientes                            |
| 12. Problemas              | Error recuperable, validación de contrato, único submit, hidden y fuente única             |

## Publicar desde el repositorio del equipo

No ejecutar los comandos de los documentos adjuntos a ciegas: adapta la rama de integración al flujo real. La guía propone develop o main según el equipo. Copia estos cambios sobre el proyecto del repositorio, revisa cambios pendientes y conserva el trabajo antes de cambiar de rama.

```sh
git status
git fetch origin
git switch develop
git pull --ff-only origin develop
git switch -c feature/catalogo-dinamico
# Incorporar los archivos de esta adaptación y probar.
npm ci
npm run check
npm run check:syntax
npm test
git diff
git add public scripts/server.mjs tests README.md docs package.json
git commit -m "feat: integra catalogo dinamico y solicitudes de practica"
git push -u origin feature/catalogo-dinamico
```

Abre el PR hacia la integración acordada. Vercel ya está configurado para publicar `public/`. Adjunta cambio, pruebas, capturas, pendientes y enlaces. Repite carga de JSON y scripts, teclado y envío en el Preview del mismo SHA. La integración queda sujeta a la revisión del equipo/docente.

| Dato de entrega                | Valor                                     |
| ------------------------------ | ----------------------------------------- |
| Repositorio / PR / Preview     | Pendiente: el ZIP no identifica un remoto |
| SHA probado en Preview         | Pendiente de commit y despliegue          |
| Estudiante / aporte propio     | Completar por el estudiante               |
| Revisor y fecha                | Pendiente de revisión por pares           |
| Observación de carga fallida   | Completar tras revisión independiente     |
| Observación de teclado         | Completar tras revisión independiente     |
| Observación de envío duplicado | Completar tras revisión independiente     |

Las instrucciones de entrega a Aula Virtual/Teams pertenecen al material docente; esta adaptación no envía mensajes ni entrega archivos en esas plataformas.
