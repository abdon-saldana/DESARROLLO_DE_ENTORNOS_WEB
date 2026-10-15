# Preparación del repositorio y Preview

## Docente o responsable del equipo

Usa la carpeta portal-ti-base para iniciar el repositorio de los estudiantes.
Mantén el ejemplo resuelto separado si lo usarás como solución docente.

1. Crea en GitHub un repositorio **vacío**, sin README ni .gitignore generados.
2. Abre la terminal dentro de portal-ti-base. Reemplaza ORGANIZACION por tu usuario
   u organización; ajusta el nombre del repositorio si elegiste otro.
3. Ejecuta esta secuencia solo cuando esta carpeta todavía no tenga repositorio Git:

```bash
git init -b main
git add .
git commit -m "chore: prepara proyecto base de semana 2"
git remote add origin https://github.com/ORGANIZACION/portal-soporte-ti.git
git push -u origin main
git switch -c develop
git push -u origin develop
```

Autoriza a los integrantes. Si ya existe un repositorio del curso, usa su copia clonada
y agrega estos archivos en una rama de trabajo, revisando diferencias para conservar
lo anterior. No ejecutes otra inicialización ni sobrescribas cambios sin revisarlos.

## Estudiante y sesión 3

```bash
git clone https://github.com/ORGANIZACION/portal-soporte-ti.git
cd portal-soporte-ti
git switch develop
git pull --ff-only origin develop
git switch -c feature/landing-responsive
npm ci
npm run dev
```

Si ya clonaste, comienza abriendo esa carpeta y actualizando develop.
Si Git no reconoce la rama remota, usa git switch --track origin/develop.

Al completar navbar y hero:

```bash
git status
git diff
npm run format
npm run check
git add public README.md docs/pruebas.md
git commit -m "feat: agrega navbar y hero responsive"
git push -u origin feature/landing-responsive
```

Abre un PR en borrador: base develop, compare feature/landing-responsive.

## Sesión 4

Agrega primero Grid en la rama de la landing y guarda ese avance:

```bash
git add public
git commit -m "feat: agrega catalogo de servicios"
git push
git switch -c feature/formulario-soporte
```

Implementa el formulario. Ejecuta pruebas, documenta y publica la rama:

```bash
npm run format
npm run check
npm run check:syntax
npm test
git add public README.md docs/pruebas.md
git commit -m "feat: agrega formulario de soporte"
git push -u origin feature/formulario-soporte
```

Solicita revisión en un PR con base feature/landing-responsive y
compare feature/formulario-soporte. Una persona con permisos integra el formulario
después de revisar código y pruebas.

```bash
git switch feature/landing-responsive
git pull --ff-only origin feature/landing-responsive
```

Prueba el Preview de esta rama. Completa el PR principal hacia develop con capturas,
README, registro de pruebas y enlace al PR del formulario. La publicación de
develop hacia main corresponde al responsable y al momento acordado en el curso.

## Vercel

1. El responsable importa el repositorio desde GitHub.
2. Selecciona Other; Root Directory es la raíz del proyecto (donde está vercel.json).
3. El archivo vercel.json establece Build Command vacío y Output Directory public.
4. Confirma main como rama de Production. El primer despliegue de un proyecto es
   Production: solo representa la base de práctica, no la entrega final del curso.
5. Los siguientes commits en feature y develop generan Preview según la integración.
   Revisa rama, commit y etiqueta Preview antes de copiar el enlace.
6. Comprueba que el revisor pueda acceder. Si hay protección de despliegue,
   coordina el acceso con el responsable del proyecto.

No hay secretos ni variables de entorno requeridos. No compres dominio para este taller.
El servidor scripts/serve.mjs solo sirve para trabajar en tu equipo; Vercel sirve public.

Actions y Vercel funcionan de manera independiente. El responsable debe revisar ambos
resultados antes del merge y puede configurar checks obligatorios según el repositorio.
