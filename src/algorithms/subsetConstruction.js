
import { epsilonClosure } from './epsilonClosure.js';

function getMove(automaton, states, symbol) {
  const destinations = new Set();

  for (const transition of automaton.transitions) {
    if (
      states.includes(transition.from) &&
      transition.symbol === symbol
    ) {
      destinations.add(transition.to);
    }
  }

  return [...destinations];
}

function getDfaStateName(states) {
  return states.length === 0 ? '∅' : `{${states.join(', ')}}`;
}

export function subsetConstruction(automaton) {
  const startStates = epsilonClosure(automaton, automaton.startState);
  const queue = [startStates];
  const visited = new Map();
  const dfaTransitions = [];
  const dfaStates = [];

  function addState(states) {
    const key = JSON.stringify(states);

    if (!visited.has(key)) {
      visited.set(key, getDfaStateName(states));
      queue.push(states);
    }

    return visited.get(key);
  }

  // Register the DFA start state.
  visited.set(JSON.stringify(startStates), getDfaStateName(startStates));
  dfaStates.push(getDfaStateName(startStates));

  while (queue.length > 0) {
    const currentStates = queue.shift();
    const currentName = getDfaStateName(currentStates);

    for (const symbol of automaton.alphabet) {
      const movedStates = getMove(automaton, currentStates, symbol);

      const nextStates = epsilonClosure(automaton, movedStates);
      const nextName = addState(nextStates);

      dfaTransitions.push({
        from: currentName,
        symbol,
        to: nextName,
      });

      if (!dfaStates.includes(nextName)) {
        dfaStates.push(nextName);
      }
    }
  }

  const dfaAcceptStates = dfaStates.filter((dfaStateName) => {
    const matchingEntry = [...visited.entries()].find(
      ([, name]) => name === dfaStateName
    );

    if (!matchingEntry) return false;

    const nfaStates = JSON.parse(matchingEntry[0]);

    return nfaStates.some((state) =>
      automaton.acceptStates.includes(state)
    );
  });

  return {
    states: dfaStates,
    alphabet: [...automaton.alphabet],
    startState: getDfaStateName(startStates),
    acceptStates: dfaAcceptStates,
    transitions: dfaTransitions,
  };
}
