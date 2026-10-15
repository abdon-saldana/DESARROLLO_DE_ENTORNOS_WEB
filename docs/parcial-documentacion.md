# Parcial - Portal de Soporte TI Nova Servicios

## Documentación de Diseño y Análisis

**Autor:** Naomi Cama
**Código:** 2017522502
**Fecha:** 30 de septiembre de 2026
**Rama:** feature/parcial-portal

---

## 1. Brief de 5 Dimensiones

### 1.1. Objetivo

Diseñar y construir un portal web estático responsive para **Nova Servicios** que centralice la consulta de servicios de TI y la solicitud de soporte técnico, reduciendo la dependencia de canales informales (llamadas, correos sueltos) y mejorando la trazabilidad de las solicitudes.

### 1.2. Alcance

El portal incluye:

- Página de inicio con presentación y enlace al formulario (máximo 2 clics).
- 4 tarjetas de servicios (Soporte Técnico, Redes, Seguridad, Desarrollo Web).
- Sección de estados ficticios de tickets (ejemplos visuales).
- Formulario de solicitud de soporte con validación nativa (simulación, no guarda datos).
- 5 preguntas frecuentes en 2 categorías (Soporte Técnico y Facturación).
- Sección de contacto con horario ficticio.

**Fuera del alcance:** Backend, base de datos, autenticación, persistencia, envío real de correos, panel de administración.

### 1.3. Usuarios

| Rol                      | Descripción                                         | Necesidad principal                                      |
| ------------------------ | --------------------------------------------------- | -------------------------------------------------------- |
| **Empleado solicitante** | Personal de Nova Servicios que reporta incidencias. | Reportar un problema rápido y saber en qué estado está.  |
| **Técnico de soporte**   | Personal de TI que atiende los tickets.             | Ver la prioridad y el tipo de incidencia para priorizar. |
| **Administrador**        | Responsable de la operación del portal.             | Auditar cambios y garantizar que no haya duplicados.     |

### 1.4. Restricciones

- Solo HTML, CSS y el `ui.js` original de la guía 2 (sin modificar).
- Sin frameworks (ni Bootstrap, ni Tailwind).
- Sin backend ni persistencia (solo simulación con `alert`).
- Mobile first, verificable en 320px, 768px y 1440px.
- Accesibilidad: navegación con teclado, foco visible, etiquetas asociadas.

### 1.5. Métricas de Éxito

| Métrica                                         | Objetivo                                |
| ----------------------------------------------- | --------------------------------------- |
| Clics para llegar al formulario desde el inicio | ≤ 2                                     |
| Puntaje de Lighthouse (Performance)             | ≥ 90                                    |
| Puntaje de Lighthouse (Accessibility)           | ≥ 90                                    |
| Compatibilidad responsive                       | 320, 768, 1440 px sin scroll horizontal |
| Formulario: validación nativa funcional         | 100% de los campos validados            |

---

## 2. Cinco Historias de Usuario con Criterios Medibles

### HU-01: Acceso rápido al formulario

**Como** empleado solicitante,
**quiero** llegar al formulario de soporte en un máximo de 2 clics desde la página de inicio,
**para** reportar una incidencia sin perder tiempo navegando.

**Criterios de aceptación:**

- [ ] Desde la sección "Inicio", existe un botón "Solicitar soporte" que lleva al formulario.
- [ ] Desde el menú de navegación, el enlace "Solicitar Soporte" lleva al formulario.
- [ ] Se verifica que no se requieren más de 2 clics para llegar.

---

### HU-02: Consulta de servicios ofrecidos

**Como** empleado solicitante,
**quiero** ver las 4 tarjetas de servicios con título, descripción y enlace al formulario,
**para** identificar el servicio que necesito antes de solicitarlo.

**Criterios de aceptación:**

- [ ] Se muestran exactamente 4 tarjetas de servicio.
- [ ] Cada tarjeta tiene título, descripción y un enlace "Solicitar este servicio".
- [ ] Los enlaces llevan al formulario.
- [ ] En móvil (320px) las tarjetas se ven en 1 columna; en tablet (768px) en 2 columnas; en escritorio (1440px) en 4 columnas.

---

### HU-03: Envío de solicitud de soporte

**Como** empleado solicitante,
**quiero** completar un formulario con nombre, correo, tipo, prioridad y descripción,
**para** registrar mi solicitud de soporte (simulación).

**Criterios de aceptación:**

- [ ] Nombre: obligatorio, mínimo 3 caracteres.
- [ ] Correo: obligatorio, `type="email"` con validación nativa.
- [ ] Tipo de incidencia: obligatorio, con opción inicial vacía.
- [ ] Prioridad: obligatoria, de selección única (radio buttons).
- [ ] Descripción: obligatoria, entre 10 y 500 caracteres.
- [ ] Al enviar válidamente, se muestra un mensaje de simulación: "Este formulario no envía ni guarda información real".

---

### HU-04: Visualización de estados de tickets

**Como** empleado solicitante,
**quiero** ver ejemplos del estado de las solicitudes (Pendiente, En revisión, Resuelto, En progreso, Duplicado),
**para** entender cómo se gestionarían mis tickets.

**Criterios de aceptación:**

- [ ] Se muestra una tabla con 5 tickets ficticios (1001 al 1005).
- [ ] Cada ticket tiene: ID, servicio, prioridad y estado.
- [ ] Cada estado tiene un color distintivo (amarillo, celeste, verde, azul, rojo).
- [ ] La sección indica claramente: "No representan datos reales".

---

### HU-05: Consulta de preguntas frecuentes

**Como** empleado solicitante,
**quiero** consultar 5 preguntas frecuentes organizadas en 2 categorías,
**para** resolver dudas comunes sin contactar al soporte.

**Criterios de aceptación:**

- [ ] Se muestran 5 preguntas frecuentes.
- [ ] Están organizadas en 2 categorías: "Soporte Técnico" y "Facturación y Servicios".
- [ ] Cada pregunta es expandible/colapsable con `<details>` y `<summary>`.
- [ ] Son accesibles con teclado.

---

## 3. Prioridades MoSCoW

### Must Have (Debe tener)

- Página de inicio con nombre de la empresa y enlace al formulario.
- Menú de navegación con enlaces a todas las secciones.
- 4 tarjetas de servicio con enlace al formulario.
- Formulario con validación nativa completa.
- Confirmación de simulación (no guarda datos).
- 5 preguntas frecuentes en 2 categorías.
- Sección de contacto con horario ficticio.
- Diseño mobile first (320px, 768px, 1440px).
- HTML semántico (`header`, `nav`, `main`, `section`, `article`, `footer`).
- CSS externo con al menos 3 variables en `:root`.
- Uso de Flexbox y Grid.
- Conservar el `ui.js` original de la guía 2.

### Should Have (Debería tener)

- Sección de estados ficticios de tickets.
- Foco visible en todos los elementos interactivos.
- Navegación con teclado (Tab y Shift+Tab).
- Atributos `aria-label` en navegación.
- Mensajes de ayuda en el formulario (`<small>` con `aria-describedby`).

### Could Have (Podría tener)

- Zoom al 200% sin pérdida de contenido.
- Documentación de 2 correcciones reales antes/después.
- Análisis de duplicados y auditoría en la documentación.
- Diagrama conceptual con PK/FK.

### Won't Have (No tendrá)

- Backend real o base de datos.
- Autenticación de usuarios.
- Envío real de correos electrónicos.
- Panel de administración.
- Notificaciones en tiempo real.
- Integración con sistemas externos.

---

## 4. Wireframe de 6 Zonas

**Descripción de cada zona:**

1. **Header:** Fijo en la parte superior (`position: sticky`). Contiene el logo "Nova Servicios", el menú de navegación (Inicio, Servicios, Estados, FAQ, Contacto) y el botón destacado "Solicitar Soporte".
2. **Hero/Inicio:** Sección de bienvenida con `<h1>` y un botón principal que lleva al formulario.
3. **Servicios:** Grid con 4 tarjetas (`<article>`). En móvil: 1 columna, tablet: 2, escritorio: 4.
4. **Estados Ficticios:** Tabla con 5 tickets de ejemplo, con etiquetas de color.
5. **Formulario + FAQ + Contacto:** Sección larga con tres subsecciones. El formulario usa `fieldset` y `legend`. La FAQ usa `<details>` y `<summary>`.
6. **Footer:** Pie de página con copyright.

---

## 5. Diagrama Conceptual con 5 Entidades

### Entidades, PK y FK

| Entidad           | PK                 | FK                           | Atributos principales                                       |
| ----------------- | ------------------ | ---------------------------- | ----------------------------------------------------------- |
| **Usuario**       | `id_usuario`       | —                            | nombre, correo, rol, fecha_registro                         |
| **Servicio**      | `id_servicio`      | —                            | nombre, descripcion, activo                                 |
| **Solicitud**     | `id_solicitud`     | `id_usuario`, `id_servicio`  | fecha_creacion, prioridad, estado, descripcion              |
| **Actualizacion** | `id_actualizacion` | `id_solicitud`, `id_usuario` | fecha_cambio, campo_modificado, valor_anterior, valor_nuevo |
| **Auditoria**     | `id_auditoria`     | `id_solicitud`, `id_usuario` | accion, fecha, ip_origen, detalle                           |

### Cardinalidades

- **Usuario (1) — (N) Solicitud:** Un usuario puede crear muchas solicitudes. Una solicitud es creada por un solo usuario.
- **Servicio (1) — (N) Solicitud:** Un servicio puede estar asociado a muchas solicitudes. Una solicitud corresponde a un solo servicio.
- **Solicitud (1) — (N) Actualizacion:** Una solicitud puede tener muchas actualizaciones. Una actualización pertenece a una sola solicitud.
- **Usuario (1) — (N) Actualizacion:** Un usuario puede realizar muchas actualizaciones. Una actualización es realizada por un solo usuario.
- **Solicitud (1) — (N) Auditoria:** Una solicitud puede tener muchos registros de auditoría. Un registro de auditoría pertenece a una sola solicitud.
- **Usuario (1) — (N) Auditoria:** Un usuario puede generar muchos registros de auditoría. Un registro de auditoría es generado por un solo usuario.

### Reglas de Auditoría

1. **Toda modificación a una solicitud debe generar un registro en `Actualizacion`** con: campo modificado, valor anterior, valor nuevo, fecha y usuario responsable.
2. **Toda acción crítica** (creación, cambio de prioridad, cambio de estado, eliminación) debe registrarse en la tabla `Auditoria`.
3. **El campo `prioridad` de una solicitud solo puede ser modificado por un usuario con rol "Administrador" o "Técnico".** Si un usuario sin permisos intenta cambiarlo, se debe registrar una alerta en `Auditoria`.
4. **Los registros de auditoría son inmutables** (no se pueden editar ni eliminar).
5. **Cada solicitud debe tener trazabilidad completa**: quién la creó, quién la modificó y cuándo.

---

## 6. Análisis de Casos

### 6.1. Análisis de Duplicados (Tickets 1001 y 1005)

**Situación:**
Los tickets **1001** y **1005** tienen:

- Mismo servicio: "Soporte Técnico"
- Misma prioridad: "Alta"
- Contenido similar (ambos reportan un problema de hardware)
- Diferencia en fecha de creación: solo 3 minutos.

**Análisis:**
Es muy probable que el ticket **1005 sea un duplicado del 1001**, creado por el mismo usuario por error (doble clic en el botón de envío, o por recargar la página después de enviar).

**Reglas para detectar y prevenir duplicados:**

| Regla                      | Descripción                                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **R1. Ventana de tiempo**  | Si dos solicitudes del mismo usuario tienen el mismo servicio y prioridad en menos de 5 minutos, marcar la segunda como "posible duplicado". |
| **R2. Hash de contenido**  | Calcular un hash con (id_usuario + id_servicio + descripcion). Si coincide con una solicitud en las últimas 24 horas, marcar como duplicado. |
| **R3. Estado "Duplicado"** | El ticket duplicado se marca con estado "Duplicado" y se vincula al ticket original mediante un campo `id_solicitud_padre`.                  |
| **R4. Notificación**       | Al usuario se le informa que su solicitud podría ser un duplicado, y se le muestra el ticket original.                                       |

**Acción correctiva propuesta:**

- El ticket **1005** debe marcarse como **"Duplicado"** (ya lo está en la tabla ficticia).
- Vincularlo al ticket **1001** mediante `id_solicitud_padre = 1001`.
- Registrar en `Auditoria` la acción "Detección de duplicado" con el usuario del sistema.

---

### 6.2. Análisis del Cambio No Autorizado de Prioridad (Ticket 1002)

**Situación:**
El ticket **1002** tenía prioridad **"Baja"** originalmente, pero un usuario sin permisos la cambió a **"Alta"** sin autorización.

**Análisis:**
Este es un caso típico de **modificación no autorizada**. Para detectarlo, el sistema debe tener:

1. **Control de acceso basado en roles (RBAC):**
   - Los usuarios con rol "Empleado" solo pueden **crear** solicitudes.
   - Los usuarios con rol "Técnico" pueden **actualizar** el estado, pero **no** la prioridad.
   - Solo los usuarios con rol "Administrador" pueden **cambiar la prioridad**.

2. **Registro en la tabla `Actualizacion`:**
   | id_actualizacion | id_solicitud | id_usuario | campo_modificado | valor_anterior | valor_nuevo | fecha |
   |------------------|--------------|------------|------------------|----------------|-------------|-------|
   | 501 | 1002 | 15 (Empleado) | prioridad | Baja | Alta | 2026-09-30 14:22 |

3. **Registro en la tabla `Auditoria`:**
   | id_auditoria | id_solicitud | id_usuario | accion | fecha | detalle |
   |--------------|--------------|------------|--------|-------|---------|
   | 9001 | 1002 | 15 | CAMBIO_NO_AUTORIZADO | 2026-09-30 14:22 | Intento de cambio de prioridad sin permisos |

4. **Acción correctiva:**
   - Revertir el cambio de prioridad al valor original (**Baja**).
   - Notificar al administrador sobre el intento de modificación no autorizada.
   - Registrar el incidente en `Auditoria`.

**Reglas de auditoría aplicadas:**

- **R-Aud-1:** Toda modificación debe registrar valor anterior y nuevo.
- **R-Aud-2:** Los cambios no autorizados deben generar una alerta.
- **R-Aud-3:** Los registros de auditoría son inmutables.

---

## 7. Correcciones Reales (Antes / Después)

### Corrección 1: Enlaces del README con rutas duplicadas

- **Problema:** Los enlaces del README apuntaban a `docs/capturas/docs/capturas/320px.png` (ruta duplicada), lo que generaba error 404.
- **Antes:** `[Vista móvil 320px](docs/capturas/320px.png)` dentro del README que ya estaba en `docs/capturas/`.
- **Después:** `[Vista móvil 320px](320px.png)` (ruta relativa correcta).
- **Evidencia:** Captura del error 404 antes y captura del enlace funcionando después.

### Corrección 2: Nombres de archivos con doble extensión `.png.png`

- **Problema:** Las capturas subidas a GitHub tenían doble extensión (ej. `320px.png.png`), lo que impedía que los enlaces funcionaran.
- **Antes:** `320px.png.png`, `Formulario-inválido.png.png`, etc.
- **Después:** `320px.png`, `Formulario-invalido.png`, etc.
- **Evidencia:** Captura del repositorio con los nombres incorrectos y captura con los nombres corregidos.

---

## 8. Conclusión

El portal de Nova Servicios cumple con todos los requisitos del parcial:

- Portal estático responsive (mobile first).
- HTML/CSS propios, sin frameworks.
- Conservación del `ui.js` original.
- Documentación completa: brief, historias, MoSCoW, wireframe, diagrama conceptual.
- Análisis de duplicados y auditoría.
- Dos correcciones reales documentadas.

El modelo conceptual propuesto permite gestionar usuarios, servicios, solicitudes, actualizaciones y auditoría, garantizando trazabilidad y control de acceso basado en roles.
