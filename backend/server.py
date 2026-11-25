"""
Lightweight HTTP API server for AutomataLab's Python algorithms.
Uses only the Python standard library (no external dependencies).
"""

import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

# Ensure sibling imports work regardless of current working directory
sys.path.insert(0, str(Path(__file__).resolve().parent))

from automata_algorithms import (
    automaton_from_dict,
    automaton_to_dict,
    calculate_all_closures,
    simulate_dfa,
    subset_construction,
    subset_construction_steps,
)


class AutomataHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: object) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self._send_json(204, {})

    def do_GET(self) -> None:
        if self.path == "/api/health":
            self._send_json(200, {"status": "ok"})
            return
        self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length) if length > 0 else b"{}"
            data = json.loads(raw.decode("utf-8"))
        except (ValueError, json.JSONDecodeError) as exc:
            self._send_json(400, {"error": f"Invalid JSON: {exc}"})
            return

        try:
            if self.path == "/api/closures":
                automaton = automaton_from_dict(data)
                self._send_json(200, calculate_all_closures(automaton))
            elif self.path == "/api/dfa":
                automaton = automaton_from_dict(data)
                dfa = subset_construction(automaton)
                self._send_json(200, automaton_to_dict(dfa))
            elif self.path == "/api/steps":
                automaton = automaton_from_dict(data)
                dfa, steps = subset_construction_steps(automaton)
                self._send_json(200, {"dfa": automaton_to_dict(dfa), "steps": steps})
            elif self.path == "/api/simulate":
                automaton = automaton_from_dict(data["automaton"])
                input_str = data.get("input", "")
                self._send_json(200, simulate_dfa(automaton, input_str))
            else:
                self._send_json(404, {"error": "Not found"})
        except Exception as exc:  # noqa: BLE001
            self._send_json(500, {"error": str(exc)})


def run(host: str = "127.0.0.1", port: int = 8000) -> None:
    server = ThreadingHTTPServer((host, port), AutomataHandler)
    print(f"Python AutomataLab API listening on http://{host}:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    run()
