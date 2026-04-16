import os
import sys
import http.server
import socketserver
from pathlib import Path

# Get the root directory of the SliceVice project
ROOT_DIR = Path(__file__).parent.parent
PORT = 8080

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
        print(f"=========================================================")
        print(f" 🛰️  SLICE VICE: MISSION CONTROL SERVER ONLINE")
        print(f"=========================================================")
        print(f" 🟢 LINK: http://localhost:{PORT}/mission-control/")
        print(f"          Serving from: {ROOT_DIR}")
        print(f"          Press Ctrl+C to stop the server.")
        print(f"=========================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down Mission Control.")
            sys.exit(0)
