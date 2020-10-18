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

__notice__: '.js' and '.mjs' require `Content-Type: text/javascript` in response header.

If **Node.js**, run [`server.mjs`](server.mjs) script.

```bash
node server.mjs
```

3. Open Browser

Open [`index.html`](http://localhost:8080/index.html) use browser.


## License

MPL-2.0
