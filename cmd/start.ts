import http from 'http';

import next from 'next';

const app = next({
  dev: false,
});
const handle = app.getRequestHandler();

export async function start() {
  app.prepare().then(() => {
    const server = http.createServer(
      (req, res) => {
        return handle(req, res);
      },
    );

    server.listen(8700);
  });
}
