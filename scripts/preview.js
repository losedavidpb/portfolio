import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Configuration
// ==========================

const script_dir = path.dirname(fileURLToPath(import.meta.url));
const dist_dir = path.resolve(script_dir, '..', 'dist');
const port = Number(process.env.PORT ?? 4173);

// Content types
// ==========================

// Map supported file extensions to their HTTP content types
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

// Preview server
// ==========================

const server = http.createServer(async (request, response) => {
    try {
        // Resolve the requested URL relative to the generated dist directory
        const url = new URL(request.url, `http://${request.headers.host}`);
        let relative_path = decodeURIComponent(url.pathname).replace(/^\/+/, '');
        let file = path.resolve(dist_dir, relative_path);

        // Prevent requests from escaping dist through path traversal
        if (!file.startsWith(`${dist_dir}${path.sep}`) && file !== dist_dir) {
            response.writeHead(403).end('Forbidden');
            return;
        }

        const details = await stat(file);

        // Serve a directory's index page when no file is specified
        if (details.isDirectory()) {
            file = path.join(file, 'index.html');
        }

        const extension = path.extname(file).toLowerCase();

        response.writeHead(200, {
            'Content-Type': mime_types[extension] ?? 'application/octet-stream'
        });

        // Stream the file instead of loading it entirely into memory
        createReadStream(file).pipe(response);
    } catch {
        // Treat missing, invalid, and unreadable files as not found
        response.writeHead(404).end('Not found');
    }
});

// Only expose the preview server to the local machine
server.listen(port, '127.0.0.1', () => {
    console.log(`Previewing dist at http://127.0.0.1:${port}`);
});
