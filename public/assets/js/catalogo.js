const catalogo = document.querySelector('#catalogo');
const selector = document.querySelector('#servicio');
const aviso = document.querySelector('#estado-catalogo');
const reintentar = document.querySelector('#reintentar-catalogo');
const enviar = document.querySelector('#enviar');
export const servicios = []; // Fuente única compartida por tarjetas, selector y tabla.
const categorias = ['Accesos', 'Hardware', 'Red', 'Software'];
const prioridades = ['alta', 'media', 'baja'];
export function validarServicios(lista) {
  if (!Array.isArray(lista) || !lista.length)
    throw new Error('Catálogo vacío o inválido');
  const ids = new Set();
  for (const s of lista) {
    if (
      !s ||
      !Number.isSafeInteger(s.id) ||
      s.id <= 0 ||
      ids.has(s.id) ||
      !['nombre', 'descripcion'].every((p) => typeof s[p] === 'string' && s[p].trim()) ||
      !categorias.includes(s.categoria) ||
      !prioridades.includes(s.prioridad)
    )
      throw new Error('Servicio fuera del contrato o id duplicado');
    ids.add(s.id);
  }
  return lista;
}
export function obtenerServicio(id) {
  return servicios.find((s) => s.id === Number(id));
}
function crearTexto(tag, texto, clase) {
  const nodo = document.createElement(tag);
  nodo.textContent = texto;
  if (clase) nodo.classList.add(clase);
  return nodo;
}
export function crearTarjeta(s) {
  const tarjeta = document.createElement('article');
  tarjeta.classList.add('service-card');
  const superior = document.createElement('div');
  superior.classList.add('card-top');
  const icono = crearTexto(
    'span',
    { Accesos: '↗', Hardware: '▣', Red: '⌁', Software: '⌘' }[s.categoria],
    'service-icon',
  );
  icono.setAttribute('aria-hidden', 'true');
  superior.append(icono, crearTexto('span', s.categoria, 'etiqueta'));
  const pie = document.createElement('div');
  pie.classList.add('card-pie');
  const prioridad = crearTexto(
    'span',
    'Prioridad del servicio: ' + s.prioridad,
    'prioridad',
  );
  prioridad.classList.add('prioridad-' + s.prioridad); // Valor previamente validado.
  const elegir = crearTexto('button', 'Elegir ↗', 'elegir-servicio');
  elegir.type = 'button';
  elegir.setAttribute('aria-label', 'Elegir servicio: ' + s.nombre);
  elegir.addEventListener('click', () => {
    selector.value = String(s.id);
    selector.dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('#formulario').scrollIntoView();
    selector.focus({ preventScroll: true });
  });
  pie.append(prioridad, elegir);
  tarjeta.append(
    superior,
    crearTexto('h3', s.nombre),
    crearTexto('p', s.descripcion),
    pie,
  );
  return tarjeta;
}
export async function cargarServicios() {
  aviso.textContent = 'Cargando servicios…';
  catalogo.setAttribute('aria-busy', 'true');
  selector.disabled = true;
  enviar.disabled = true;
  reintentar.hidden = true;
  servicios.splice(0);
  try {
    const respuesta = await fetch('data/servicios.json', { cache: 'no-store' });
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
    servicios.push(...validarServicios(await respuesta.json()));
    catalogo.replaceChildren(...servicios.map(crearTarjeta));
    selector.replaceChildren(new Option('Selecciona un servicio', ''));
    servicios.forEach((s) => selector.add(new Option(s.nombre, String(s.id))));
    selector.disabled = false;
    enviar.disabled = false;
    aviso.textContent = servicios.length + ' servicios disponibles.';
  } catch (error) {
    servicios.splice(0);
    catalogo.replaceChildren();
    selector.replaceChildren(new Option('Servicios no disponibles', ''));
    aviso.textContent =
      'No pudimos cargar servicios. Recarga la página o reintenta. El registro está bloqueado.';
    reintentar.hidden = false;
    console.error('Carga de servicios:', error);
  } finally {
    catalogo.setAttribute('aria-busy', 'false');
  }
}
reintentar.addEventListener('click', cargarServicios);
cargarServicios();
