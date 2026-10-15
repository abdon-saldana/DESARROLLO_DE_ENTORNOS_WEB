import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { once } from 'node:events';
import { createAppServer } from '../scripts/server.mjs';

let server, port;
before(async () => {
  server = createAppServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  port = server.address().port;
});
after(() => new Promise((done) => server.close(done)));
function get(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port, path, method }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (data) => {
        body += data;
      });
      res.on('end', () =>
        resolve({ status: res.statusCode, headers: res.headers, body }),
      );
    });
    req.on('error', reject);
    req.end();
  });
}
test('sirve HTML y los recursos locales', async () => {
  for (const path of ['/', '/assets/css/styles.css', '/assets/js/ui.js']) {
    const result = await get(path);
    assert.equal(result.status, 200);
    assert.ok(result.body.length);
  }
});
test('HEAD devuelve cabeceras sin contenido', async () => {
  const result = await get('/', 'HEAD');
  assert.equal(result.status, 200);
  assert.equal(result.body, '');
});
test('devuelve 404 para archivos inexistentes', async () => {
  assert.equal((await get('/no-existe')).status, 404);
});
test('no publica archivos del repositorio fuera de public', async () => {
  assert.equal((await get('/package.json')).status, 404);
  assert.equal((await get('/../package.json')).status, 403);
  assert.equal((await get('/%2e%2e/package.json')).status, 403);
});
test('rechaza rutas mal codificadas y separadores alternativos', async () => {
  assert.equal((await get('/%zz')).status, 400);
  assert.equal((await get('/%5c..%5cpackage.json')).status, 400);
});
test('no acepta envíos POST', async () => {
  assert.equal((await get('/', 'POST')).status, 405);
});
