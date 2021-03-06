/* tslint:disable:no-console */

import http from 'http';
import Debug from 'debug';
import app from './app/app';

const debug = Debug('koa-typescript-boilerplate:server');
// fix vscode DEBUG CONSOLE not display.
debug.log = console.log.bind(console);

/**
 * Get port from environment and store.
 */

const port = normalizePort(process.env.PORT || '3001');

/**
 * Create HTTP server.
 */

const server = http.createServer(app.callback());
// const server = http.createServer();

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  // tslint:disable-next-line: no-shadowed-variable
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr?.port;
  debug('Listening on ' + bind);
}
