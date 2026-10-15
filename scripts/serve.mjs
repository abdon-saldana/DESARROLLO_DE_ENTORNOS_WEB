import { createAppServer } from './server.mjs';
const port = Number(process.env.PORT || 5500);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT debe ser un puerto entre 1 y 65535.');
}
const server = createAppServer();
server.on('error', (error) => {
  console.error(
    error.code === 'EADDRINUSE'
      ? 'Puerto ocupado. Cierra el otro servidor o usa otra variable PORT.'
      : error.message,
  );
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log('Portal TI: http://127.0.0.1:' + port);
  console.log('Recarga el navegador después de guardar. Ctrl+C para detener.');
});
