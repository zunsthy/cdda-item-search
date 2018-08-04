# CataclysmDDA Item Search

A simple search page for CataclysmDDA items and recipes.

## Usage

1. Download data
Download [`CleverRaven/Cataclysm-DDA`](https://github.com/CleverRaven/Cataclysm-DDA) data to local folder.

```shell
repository="git@github.com:CleverRaven/Cataclysm-DDA.git"
branch="master"

dstdir="data/json"
srcdir="data/json"
mkdir -p ${dstdir}
git archive -v --remote=${repository} ${branch} ${srcdir} | tar -xv -C ${dstdir}

dstdir="data/core"
srcdir="data/core"
mkdir -p ${dstdir}
git archive -v --remote=${repository} ${branch} ${srcdir} | tar -xv -C ${dstdir}

dstdir="data/lang/po"
srcdir="lang/po"
mkdir -p ${dstdir}
git archive -v --remote=${repository} ${branch} ${srcdir} | tar -xv -C ${dstdir}
```

2. Config server

If **Nginx**, use this config:

```
server {
  listen 8080;
  location /cdda-recipe/data/ {
    alias "<THIS_PROJECT_PATH>";
    expires 1d;
    autoindex on;
    autoindex_format json;
  }
}
```

__notice__: '.js' and '.mjs' require `Content-Type: application/javascript` in response header.

If **Node.js**, run this script:

```js
const fs = require('fs');
const url = require('url');
const path = require('path');
const http = require('http');

const resourceDir = path.resolve(__dirname);

const types = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '': 'application/octet-stream',
};

const main = (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const ext = path.parse(pathname).ext;
  const truepath = path.normalize(path.join(resourceDir, pathname));

  if (!truepath.startsWith(resourceDir + '/')
    || !fs.existsSync(truepath)
  ) {
    res.writeHead(404); res.end(); return;
  }

  const isFile = fs.lstatSync(truepath).isFile();

  if (isFile) {
    res.writeHead(200, { 'Content-Type': types[ext] || types[''] });
    fs.createReadStream(truepath, 'utf-8').pipe(res);
  } else {
    const data = fs.readdirSync(truepath).map(p => {
      const pp = path.join(truepath, p),
      return { name: p, type: fs.lstatSync(pp).isFile() ? 'file' : 'directory' };
    });
    res.writeHead(200, { 'Content-Type': types['.json'] });
    res.write(JSON.stringify(data));
    res.end();
  }
};

http.createServer(main).listen(8080, '127.0.0.1');
```

3. Open Browser

Open [`index.html`](http://localhost:8080/index.html) use browser.


## License

MPL-2.0
