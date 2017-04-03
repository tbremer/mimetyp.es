const { createServer } = require('http');
const { readFile } = require('fs');
const { resolve, extname } = require('path');
const mimeTypes = require('./assets/data/mime-by-ext.json');

const here = __dirname;

function listener(req, res) {
  const { url: _url } = req;
  const url = _url.replace(/^\//, '');
  const fileRequest = url.length ? resolve(here, url) : './index.html';
  const extension = extname(fileRequest).replace(/^\./, '');

  console.log('hi');

  readFile(fileRequest, (err, data) => {
    if (err) {
      console.error('404:', url);
      res.writeHead(404);
      res.end();
      return;
    }

    const response = data.toString();
    const type = (extension in mimeTypes) ? mimeTypes[extension] : 'text/plain';

    res.writeHead(200, {
      'Content-Length': response.length,
      'Content-Type': type,
    });

    res.end(response);
  });
}

const server = createServer(listener);

server.listen(1337, () => { console.log('http://localhost:1337'); });
