from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver

PORT = 8000

Handler = SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    httpd.serve_forever()
