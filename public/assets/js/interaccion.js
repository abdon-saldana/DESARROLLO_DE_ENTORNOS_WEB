import { obtenerServicio } from './catalogo.js';
const ayuda = document.querySelector('#panel-ayuda'),
  botonAyuda = document.querySelector('#boton-ayuda');
const form = document.querySelector('#form-incidencia'),
  estado = document.querySelector('#estado'),
  enviar = document.querySelector('#enviar');
const descripcion = document.querySelector('#descripcion'),
  contador = document.querySelector('#contador'),
  selector = document.querySelector('#servicio');
const radios = [...form.querySelectorAll('[name="prioridad"]')];
const campos = ['nombre', 'correo', 'servicio', 'descripcion'];
const solicitudes = []; // En memoria: no se usa localStorage.
let procesando = false;
function cambiarAyuda(abierta) {
  ayuda.hidden = !abierta;
  botonAyuda.setAttribute('aria-expanded', String(abierta));
}
botonAyuda.addEventListener('click', () => cambiarAyuda(ayuda.hidden));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !ayuda.hidden) {
    cambiarAyuda(false);
    botonAyuda.focus();
  }
});
function actualizarContador() {
  contador.textContent = descripcion.value.length + '/500 caracteres';
}
function mostrarMensaje(texto, exito = false) {
  estado.textContent = texto;
  estado.classList.toggle('mensaje-ok', exito);
}
function validarCampo(id) {
  const campo = document.getElementById(id);
  campo.setCustomValidity('');
  let mensaje = '';
  if (id === 'nombre' && (campo.value.trim().length < 3 || campo.value.length > 100))
    mensaje = 'Escribe un nombre entre 3 y 100 caracteres útiles.';
  if (id === 'correo' && (!campo.value.trim() || !campo.checkValidity()))
    mensaje = 'Escribe un correo válido, por ejemplo ana@example.com.';
  if (id === 'servicio' && (campo.disabled || !obtenerServicio(campo.value)))
    mensaje = campo.disabled
      ? 'Los servicios no están disponibles. Reintenta la carga del catálogo.'
      : 'Selecciona un servicio del catálogo.';
  if (
    id === 'descripcion' &&
    (campo.value.trim().length < 10 || campo.value.length > 500)
  )
    mensaje =
      'Describe el problema con entre 10 y 500 caracteres útiles; llevas ' +
      campo.value.trim().length +
      '.';
  campo.setCustomValidity(mensaje);
  const valido = !mensaje && campo.checkValidity();
  document.querySelector('#error-' + id).textContent = valido
    ? ''
    : mensaje || 'Revisa este campo.';
  campo.setAttribute('aria-invalid', String(!valido));
  return valido;
}
function validarPrioridad() {
  const elegido = radios.find((r) => r.checked);
  const valido = !!elegido && ['baja', 'media', 'alta'].includes(elegido.value);
  document.querySelector('#error-prioridad').textContent = valido
    ? ''
    : 'Selecciona una prioridad para tu incidencia.';
  radios.forEach((r) => r.setAttribute('aria-invalid', String(!valido)));
  return valido;
}
function validarFormulario() {
  let primerError = null;
  // Revisar todo, sin cortocircuito al primer error.
  for (const id of ['nombre', 'correo', 'servicio'])
    if (!validarCampo(id) && !primerError) primerError = document.getElementById(id);
  if (!validarPrioridad() && !primerError) primerError = radios[0];
  if (!validarCampo('descripcion') && !primerError) primerError = descripcion;
  if (primerError) {
    (primerError.disabled
      ? document.querySelector('#reintentar-catalogo')
      : primerError
    ).focus();
    return false;
  }
  return true;
}
function limpiarErrores() {
  for (const id of campos) {
    const campo = document.getElementById(id);
    campo.setCustomValidity('');
    campo.removeAttribute('aria-invalid');
    document.querySelector('#error-' + id).textContent = '';
  }
  document.querySelector('#error-prioridad').textContent = '';
  radios.forEach((r) => r.removeAttribute('aria-invalid'));
}
function renderizarSolicitudes() {
  const filas = solicitudes.map((s) => {
    const fila = document.createElement('tr');
    for (const valor of [
      'SOL-' + String(s.id).padStart(4, '0'),
      obtenerServicio(s.servicio_id)?.nombre || 'Servicio no disponible',
      s.prioridad,
      s.estado,
    ]) {
      const celda = document.createElement('td');
      if (valor === s.estado) {
        const etiqueta = document.createElement('span');
        etiqueta.classList.add('estado-pendiente');
        etiqueta.textContent = valor;
        celda.append(etiqueta);
      } else celda.textContent = valor;
      fila.append(celda);
    }
    return fila;
  });
  document.querySelector('#filas-solicitudes').replaceChildren(...filas);
  document.querySelector('#total-solicitudes').textContent =
    solicitudes.length + (solicitudes.length === 1 ? ' solicitud' : ' solicitudes');
}
function crearSolicitud(datos) {
  const nueva = {
    id: solicitudes.length + 1,
    servicio_id: Number(datos.get('servicio')),
    nombre: String(datos.get('nombre')).trim(),
    correo: String(datos.get('correo')).trim(),
    prioridad: datos.get('prioridad'),
    descripcion: String(datos.get('descripcion')).trim(),
    estado: 'Pendiente',
    fecha: new Date().toISOString(),
  };
  solicitudes.push(nueva);
  renderizarSolicitudes();
  return nueva;
}
campos.forEach((id) => {
  const campo = document.getElementById(id);
  campo.addEventListener(id === 'servicio' ? 'change' : 'input', () => {
    if (id === 'descripcion') actualizarContador();
    if (campo.getAttribute('aria-invalid') === 'true') validarCampo(id);
  });
});
radios.forEach((r) => r.addEventListener('change', validarPrioridad));
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (procesando) return;
  if (!validarFormulario()) {
    mostrarMensaje('Hay campos por corregir. Revisa los mensajes del formulario.');
    return;
  }
  const datos = new FormData(form); // Capturar antes de esperar y resetear.
  procesando = true;
  enviar.disabled = true;
  form.setAttribute('aria-busy', 'true');
  mostrarMensaje('Procesando solicitud de práctica…');
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const nueva = crearSolicitud(datos);
    mostrarMensaje(
      'Simulación registrada: SOL-' +
        String(nueva.id).padStart(4, '0') +
        '. Se conserva solo hasta recargar esta página.',
      true,
    );
    form.reset();
    limpiarErrores();
    actualizarContador();
  } catch (error) {
    mostrarMensaje('No se completó la simulación. Intenta de nuevo.');
    console.error('Simulación:', error);
  } finally {
    procesando = false;
    enviar.disabled = selector.disabled;
    form.setAttribute('aria-busy', 'false');
  }
});
actualizarContador();
form.noValidate = true; // Solo tras instalar validación y el único listener submit.
