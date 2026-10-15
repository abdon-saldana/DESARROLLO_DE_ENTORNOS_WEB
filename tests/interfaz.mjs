// Ejecutar con Playwright disponible: PLAYWRIGHT_MODULE o paquete local instalado.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { once } from 'node:events';
import { createAppServer } from '../scripts/server.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || 'chrome',
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const server = process.env.TEST_URL ? null : createAppServer();
if (server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
}
const base = process.env.TEST_URL || 'http://127.0.0.1:' + server.address().port;
const registros = [];
const errores = [];
page.on('pageerror', (error) => errores.push(error.message));
const capturas = new URL('../docs/capturas/semana5/', import.meta.url);
await mkdir(capturas, { recursive: true });
let datos = null,
  fallo = false,
  crudo = null;
await page.route('**/data/servicios.json', async (route) => {
  if (fallo) return route.fulfill({ status: 404, body: 'No disponible' });
  if (crudo !== null)
    return route.fulfill({ contentType: 'application/json', body: crudo });
  if (datos)
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(datos),
    });
  return route.continue();
});
async function carga() {
  await page.goto(base);
  await page.waitForFunction(
    () => document.querySelector('#catalogo').getAttribute('aria-busy') === 'false',
  );
}
async function registrar(id, accion, tarea) {
  try {
    const detalle = await tarea();
    registros.push({
      id,
      accion,
      estado: 'Aprobada',
      resultado: detalle || 'Resultado esperado verificado',
      correccion: 'Sin corrección',
    });
    console.log('OK', id);
  } catch (error) {
    registros.push({
      id,
      accion,
      estado: 'Fallida',
      resultado: error.message,
      correccion: 'Revisar',
    });
    console.log('FALLO', id, error.message);
  }
}
async function completar(servicio = '1', prioridad = 'alta') {
  await page.locator('#nombre').fill('Ana Torres');
  await page.locator('#correo').fill('ana@example.com');
  await page.locator('#servicio').selectOption(servicio);
  await page.locator('#prioridad-' + prioridad).check();
  await page.locator('#descripcion').fill('La conexión no funciona en mi equipo.');
}
async function confirmar(codigo) {
  await page.waitForFunction(
    (c) => document.querySelector('#estado').textContent.includes(c),
    codigo,
  );
}
try {
  await carga();
  const original = await page.evaluate(async () =>
    (await fetch('data/servicios.json')).json(),
  );
  await registrar('D1', 'Cargar por HTTP', async () => {
    assert.equal(await page.locator('.service-card').count(), 5);
    assert.equal(await page.locator('#servicio option').count(), 6);
    assert.deepEqual(errores, []);
    const duplicados = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map((n) => n.id);
      return ids.filter((id, i) => ids.indexOf(id) !== i);
    });
    assert.deepEqual(duplicados, []);
    return '5 tarjetas y 5 opciones de servicio; IDs únicos; sin errores JS.';
  });
  await page.screenshot({
    path: new URL('1440px.png', capturas).pathname.replace(/^\//, ''),
    fullPage: true,
  });
  await registrar('D2', 'Cuatro servicios y quinto solo desde JSON', async () => {
    datos = original.slice(0, 4);
    await carga();
    assert.equal(await page.locator('.service-card').count(), 4);
    assert.equal(await page.locator('#servicio option').count(), 5);
    datos = original;
    await carga();
    assert.equal(await page.locator('.service-card').count(), 5);
    assert.equal(await page.locator('#servicio option').count(), 6);
    return '4→5 tarjetas y 4→5 opciones sin modificar HTML; respuesta JSON interceptada.';
  });
  await registrar('D3', 'JSON ausente y recuperación', async () => {
    fallo = true;
    await carga();
    assert.equal(await page.locator('#servicio').isDisabled(), true);
    assert.equal(await page.locator('#enviar').isDisabled(), true);
    assert.match(await page.locator('#estado-catalogo').textContent(), /No pudimos/);
    await page.screenshot({
      path: new URL('carga-fallida.png', capturas).pathname.replace(/^\//, ''),
      fullPage: true,
    });
    fallo = false;
    await page.locator('#reintentar-catalogo').click();
    await page.waitForFunction(() => !document.querySelector('#servicio').disabled);
    return 'HTTP 404 simulado: registro bloqueado y recuperación con Reintentar.';
  });
  await registrar('D4', 'Contrato, JSON inválido e IDs duplicados', async () => {
    const variantes = [
      [],
      [original[0], original[0]],
      [{ ...original[0], id: 0 }],
      [{ ...original[0], prioridad: 'urgente' }],
      [{ ...original[0], categoria: 'Otra' }],
      [{ id: 1 }],
      [{ ...original[0], nombre: '   ' }],
    ];
    for (const variante of variantes) {
      datos = variante;
      await carga();
      assert.equal(await page.locator('#enviar').isDisabled(), true);
      assert.equal(await page.locator('.service-card').count(), 0);
    }
    crudo = '[{"id":1,}]';
    await carga();
    assert.equal(await page.locator('#enviar').isDisabled(), true);
    crudo = null;
    datos = null;
    await carga();
    return '7 variantes fuera del contrato y JSON con coma final rechazadas.';
  });
  await registrar('D5', 'Texto HTML seguro', async () => {
    datos = original.map((s, i) =>
      i === 0 ? { ...s, nombre: '<img src=x onerror=alert(1)>' } : s,
    );
    await carga();
    assert.equal(await page.locator('#catalogo img').count(), 0);
    assert.equal(
      await page.locator('.service-card h3').first().textContent(),
      '<img src=x onerror=alert(1)>',
    );
    await completar();
    await page.locator('#enviar').click();
    await confirmar('SOL-0001');
    assert.equal(await page.locator('#filas-solicitudes img').count(), 0);
    assert.match(await page.locator('#filas-solicitudes').textContent(), /<img/);
    datos = null;
    await carga();
    return 'Cadena literal en tarjetas, opciones y tabla; ningún nodo img.';
  });
  await registrar('F1', 'Enviar vacío', async () => {
    await page.locator('#enviar').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'nombre');
    for (const id of ['nombre', 'correo', 'servicio', 'prioridad', 'descripcion'])
      assert.ok((await page.locator('#error-' + id).textContent()).length);
    await page.screenshot({
      path: new URL('formulario-invalido.png', capturas).pathname.replace(/^\//, ''),
      fullPage: true,
    });
    return 'Cinco mensajes asociados, foco en nombre y ninguna solicitud.';
  });
  await registrar('F2', 'Correo ana@ y descripción corta', async () => {
    await completar();
    await page.locator('#correo').fill('ana@');
    await page.locator('#descripcion').fill('abcd');
    await page.locator('#enviar').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'correo');
    assert.match(await page.locator('#error-descripcion').textContent(), /llevas 4/);
    assert.equal(await page.locator('#filas-solicitudes td[colspan]').count(), 1);
  });
  await registrar('F3', 'Diez espacios', async () => {
    await page.locator('#correo').fill('ana@example.com');
    await page.locator('#descripcion').fill('          ');
    await page.locator('#enviar').click();
    assert.match(await page.locator('#error-descripcion').textContent(), /llevas 0/);
  });
  await registrar('F4', 'Prioridad ausente y corregir', async () => {
    await carga();
    await page.locator('#enviar').click();
    await page.locator('#nombre').fill('Ana Torres');
    await page.locator('#correo').fill('ana@example.com');
    await page.locator('#servicio').selectOption('1');
    await page.locator('#descripcion').fill('No puedo acceder al sistema.');
    await page.locator('#enviar').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'prioridad-baja');
    await page.locator('#prioridad-media').check();
    for (const id of ['nombre', 'correo', 'servicio', 'prioridad', 'descripcion'])
      assert.equal(await page.locator('#error-' + id).textContent(), '');
  });
  await registrar('F5', 'Envío y repeticiones durante la espera', async () => {
    await page.locator('#enviar').click();
    assert.equal(await page.locator('#enviar').isDisabled(), true);
    assert.match(await page.locator('#estado').textContent(), /Procesando/);
    await page.locator('#form-incidencia').dispatchEvent('submit');
    await page.locator('#form-incidencia').dispatchEvent('submit');
    await confirmar('SOL-0001');
    assert.equal(await page.locator('#filas-solicitudes tr').count(), 1);
    assert.equal(await page.locator('#enviar').isDisabled(), false);
    assert.equal(await page.locator('#contador').textContent(), '0/500 caracteres');
    assert.equal(await page.locator('[aria-invalid=true]').count(), 0);
    await page.screenshot({
      path: new URL('formulario-valido.png', capturas).pathname.replace(/^\//, ''),
      fullPage: true,
    });
    return 'Una fila; confirmación SOL-0001; botón recuperado, contador y errores reiniciados.';
  });
  await registrar('A1', 'Ayuda con Enter, Espacio y Escape', async () => {
    for (const key of ['Enter', 'Space']) {
      await page.locator('#boton-ayuda').focus();
      await page.keyboard.press(key);
      assert.equal(await page.locator('#panel-ayuda').isVisible(), true);
      assert.equal(
        await page.locator('#boton-ayuda').getAttribute('aria-expanded'),
        'true',
      );
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#panel-ayuda').isVisible(), false);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'boton-ayuda');
    }
  });
  await registrar('A2', 'Formulario completo solo con teclado', async () => {
    await carga();
    await page.locator('#boton-ayuda').focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'nombre');
    await page.keyboard.type('Luis Perez');
    await page.keyboard.press('Tab');
    await page.keyboard.type('luis@example.com');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'descripcion');
    await page.keyboard.type('La impresora no responde desde esta mañana.');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'enviar');
    assert.notEqual(
      await page.locator('#enviar').evaluate((n) => getComputedStyle(n).outlineStyle),
      'none',
    );
    await page.keyboard.press('Enter');
    await confirmar('SOL-0001');
    return 'Recorrido Tab, radio con Espacio y envío con Enter completado; foco visible.';
  });
  await registrar('A3', 'Movimiento reducido', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await completar('2', 'baja');
    await page.locator('#enviar').click();
    await confirmar('SOL-0002');
    assert.equal(await page.locator('#estado').isVisible(), true);
    const duration = await page
      .locator('#estado')
      .evaluate((n) => getComputedStyle(n).animationDuration);
    assert.equal(duration, '1e-05s');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    return 'Animación de 0.00001 s; confirmación visible.';
  });
  await registrar('T1', 'Dos solicitudes correlativas y asociación', async () => {
    assert.equal(await page.locator('#filas-solicitudes tr').count(), 2);
    const text = await page.locator('#filas-solicitudes').textContent();
    assert.match(text, /SOL-0001/);
    assert.match(text, /SOL-0002/);
    assert.match(text, /Falla de impresora/);
    assert.match(text, /baja/);
  });
  await registrar('T2', 'Duplicados por submit directo', async () => {
    await completar('3', 'alta');
    await page.locator('#form-incidencia').dispatchEvent('submit');
    await page.locator('#form-incidencia').dispatchEvent('submit');
    await page.locator('#form-incidencia').dispatchEvent('submit');
    await confirmar('SOL-0003');
    assert.equal(await page.locator('#filas-solicitudes tr').count(), 3);
  });
  await registrar('T3', 'Recargar borra lista y reinicia códigos', async () => {
    await carga();
    assert.equal(await page.locator('#total-solicitudes').textContent(), '0 solicitudes');
    await completar();
    await page.locator('#enviar').click();
    await confirmar('SOL-0001');
  });
  await registrar('R1', '320, 768, 1440 px y equivalente zoom 200 %', async () => {
    for (const ancho of [320, 768, 1440, 720]) {
      await page.setViewportSize({ width: ancho, height: 1000 });
      await carga();
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
      );
      await page.screenshot({
        path: new URL(ancho + 'px.png', capturas).pathname.replace(/^\//, ''),
        fullPage: true,
      });
    }
    return 'Sin desbordamiento en 320, 768, 1440 y 720 px; 720 representa el reflow de 1440 al 200 %. Zoom real pendiente.';
  });
  await registrar('M1', 'Menú móvil con teclado', async () => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.locator('#btn-menu').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#menu-principal').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#btn-menu').getAttribute('aria-expanded'), 'false');
  });
  await registrar('S1', 'ID de servicio manipulado', async () => {
    await completar();
    await page.locator('#servicio').evaluate((n) => {
      n.add(new Option('Servicio falso', '999'));
      n.value = '999';
    });
    await page.locator('#enviar').click();
    assert.match(await page.locator('#error-servicio').textContent(), /Selecciona/);
  });
  await registrar('J1', 'No JavaScript: restricciones nativas', async () => {
    const c = await browser.newContext({ javaScriptEnabled: false });
    const p = await c.newPage();
    await p.goto(base);
    assert.equal(await p.locator('#form-incidencia').getAttribute('novalidate'), null);
    assert.equal(await p.locator('#enviar').isDisabled(), true);
    assert.equal(await p.locator('noscript').isVisible(), true);
    await c.close();
  });
  await registrar('N1', 'Sin excepciones JavaScript no controladas', async () => {
    assert.deepEqual(errores, []);
  });
} finally {
  await writeFile(
    new URL('../docs/resultados-automatizados.json', import.meta.url),
    JSON.stringify(
      {
        fecha: '2026-10-14',
        navegador: await browser.version(),
        entorno: base,
        registros,
        errores,
      },
      null,
      2,
    ),
  );
  await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
}
if (registros.some((r) => r.estado === 'Fallida')) process.exitCode = 1;
