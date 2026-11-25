async function postJson(endpoint, body) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Python API error (${response.status}): ${text}`);
  }

  return response.json();
}

export function fetchAllClosures(automaton) {
  return postJson('/api/closures', automaton);
}

export function fetchSubsetConstruction(automaton) {
  return postJson('/api/dfa', automaton);
}

export function fetchSubsetConstructionSteps(automaton) {
  return postJson('/api/steps', automaton);
}

export function fetchSimulateDFA(automaton, input) {
  return postJson('/api/simulate', { automaton, input });
}
