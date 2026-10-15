// Servidor LOCAL de apoyo. Vercel publica public/ sin ejecutar este archivo.
import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { dirname, resolve, relative, isAbsolute, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../public');
const types = {
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};
function inside(file) {
  const path = relative(root, file);
  return (
    path !== '..' &&
    !path.startsWith('../') &&
    !path.startsWith('..\\') &&
    !isAbsolute(path)
  );
}
export function createAppServer() {
  return createServer(async (req, res) => {
    const send = (status, text) => {
      res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : text);
    };
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.setHeader('Allow', 'GET, HEAD');
      return send(405, 'Este laboratorio no recibe solicitudes de soporte.');
    }
    let pathname;
    try {
      pathname = decodeURIComponent((req.url || '/').split('?')[0]);
    } catch {
      return send(400, 'Ruta inválida.');
    }
    // Impide salir de public o interpretar separadores alternativos.
    if (!pathname.startsWith('/') || /[\\\0:]/.test(pathname)) {
      return send(400, 'Ruta inválida.');
    }
    const candidate = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!inside(candidate)) return send(403, 'Acceso no permitido.');
    try {
      const file = await realpath(candidate);
      if (!inside(file)) return send(403, 'Acceso no permitido.');
      const data = await readFile(file);
      res.writeHead(200, {
        'Content-Type': types[extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch (error) {
      send(
        ['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code) ? 404 : 500,
        'No se pudo abrir el archivo.',
      );
    }
  });
}
