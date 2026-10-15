// El menú se conserva; el único listener submit vive en interaccion.js.
const botonMenu = document.querySelector('#btn-menu');
const menu = document.querySelector('#menu-principal');
function cambiarMenu(abierto) {
  menu.classList.toggle('activo', abierto);
  botonMenu.setAttribute('aria-expanded', String(abierto));
}
botonMenu.addEventListener('click', () =>
  cambiarMenu(botonMenu.getAttribute('aria-expanded') !== 'true'),
);
menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) cambiarMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && botonMenu.getAttribute('aria-expanded') === 'true') {
    cambiarMenu(false);
    botonMenu.focus();
  }
});
window
  .matchMedia('(min-width: 801px)')
  .addEventListener('change', () => cambiarMenu(false));
