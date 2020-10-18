import fs from 'fs';
import path from 'path';
import http from 'http';

const selfpath = new URL(import.meta.url).pathname;
const dir = path.dirname(selfpath);

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '': 'application/octet-stream',
};

const main = (req, res) => {
  const error = (code, msg) => { res.statusCode = code; res.end(msg); };

  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const ext = path.parse(pathname).ext;
  const fullpath = path.normalize(path.join(dir, pathname.slice(1)));

  if (!fullpath.startsWith(dir + '/')) { error(403); return; }
  if (!fs.existsSync(fullpath)) { error(404); return; }

  const isFile = fs.lstatSync(fullpath).isFile();

  if (isFile) {
    res.setHeader('content-type', types[ext] || types['']);
    res.statusCode = 200;
    fs.createReadStream(fullpath, 'utf-8').pipe(res);
  } else {
    const data = fs.readdirSync(fullpath).map(name => {
      const subpath = path.join(fullpath, name);
      return { name, type: fs.lstatSync(subpath).isFile() ? 'file' : 'directory' };
    });
    res.statusCode = 200;
    res.setHeader('content-type', types['.json']);
    res.end(JSON.stringify(data));
  }
};

http.createServer(main).listen(8080, '127.0.0.1');
