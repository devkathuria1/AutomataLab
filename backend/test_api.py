import json
import threading
import urllib.request
from http.server import ThreadingHTTPServer

from server import AutomataHandler


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 0), AutomataHandler)
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()

    sample = {
        "states": ["q0", "q1", "q2"],
        "alphabet": ["0", "1"],
        "startState": "q0",
        "acceptStates": ["q2"],
        "transitions": [
            {"from": "q0", "symbol": None, "to": "q1"},
            {"from": "q1", "symbol": "0", "to": "q1"},
            {"from": "q1", "symbol": "1", "to": "q2"},
        ],
    }

    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))

    def post(path: str, payload: dict) -> object:
        req = urllib.request.Request(
            f"http://127.0.0.1:{port}{path}",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with opener.open(req) as resp:
            return json.loads(resp.read().decode("utf-8"))

    closures = post("/api/closures", sample)
    dfa = post("/api/dfa", sample)
    steps = post("/api/steps", sample)
    sim = post("/api/simulate", {"automaton": sample, "input": "01"})

    assert len(closures) == 3 and closures[0]["closure"] == ["q0", "q1"]
    assert dfa["startState"] == "{q0, q1}" and "{q2}" in dfa["acceptStates"]
    assert len(steps["steps"]) == 13
    assert sim["accepted"] is True and sim["finalState"] == "{q2}"

    server.shutdown()
    print("Python API /api/closures, /api/dfa, /api/steps, /api/simulate all passed!")


if __name__ == "__main__":
    main()
