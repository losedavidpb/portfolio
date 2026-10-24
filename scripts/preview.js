import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script_dir = path.dirname(fileURLToPath(import.meta.url));
const dist_dir = path.resolve(script_dir, '..', 'dist');
const port = Number(process.env.PORT ?? 4173);

const mime_types = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.xml': 'application/xml; charset=utf-8'
};

const server = http.createServer(async (request, response) => {
    try {
        const url = new URL(request.url, `http://${request.headers.host}`);
        let relative_path = decodeURIComponent(url.pathname).replace(/^\/+/, '');
        let file = path.resolve(dist_dir, relative_path);

        if (!file.startsWith(`${dist_dir}${path.sep}`) && file !== dist_dir) {
            response.writeHead(403).end('Forbidden');
            return;
        }

        const details = await stat(file);

        if (details.isDirectory()) {
            file = path.join(file, 'index.html');
        }

        const extension = path.extname(file).toLowerCase();

        response.writeHead(200, {
            'Content-Type': mime_types[extension] ?? 'application/octet-stream'
        });

        createReadStream(file).pipe(response);
    } catch {
        response.writeHead(404).end('Not found');
    }
});

server.listen(port, '127.0.0.1', () => {
    console.log(`Previewing dist at http://127.0.0.1:${port}`);
});
