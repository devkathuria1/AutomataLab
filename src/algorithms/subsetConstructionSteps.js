
import { epsilonClosure } from './epsilonClosure.js';

export function subsetConstructionSteps(automaton) {
  const steps = [];
  const startClosure = epsilonClosure(
    automaton,
    automaton.startState
  );

  const stateKey = (states) => JSON.stringify(states);
  const stateName = (states) =>
    states.length === 0 ? '∅' : `{${states.join(', ')}}`;

  const discovered = new Map();
  const queue = [];

  function discover(states) {
    const key = stateKey(states);

    if (!discovered.has(key)) {
      discovered.set(key, [...states]);
      queue.push([...states]);

      steps.push({
        type: 'new-state',
        state: stateName(states),
        message: `Discovered DFA state ${stateName(states)}.`,
      });
    }

    return stateName(discovered.get(key));
  }

  const startName = discover(startClosure);

  steps.unshift({
    type: 'start',
    state: startName,
    message: `Calculate the ε-closure of the start state ${automaton.startState}: ${startName}. This is the DFA start state.`,
  });

  const transitions = [];
  const acceptingStates = [];

  while (queue.length > 0) {
    const currentStates = queue.shift();
    const currentName = stateName(currentStates);

    if (
      currentStates.some((state) =>
        automaton.acceptStates.includes(state)
      )
    ) {
      if (!acceptingStates.includes(currentName)) {
        acceptingStates.push(currentName);
      }

      steps.push({
        type: 'accepting',
        state: currentName,
        message: `${currentName} is accepting because it contains an accepting ε-NFA state.`,
      });
    }

    for (const symbol of automaton.alphabet) {
      const moved = new Set();

      for (const transition of automaton.transitions) {
        if (
          currentStates.includes(transition.from) &&
          transition.symbol === symbol
        ) {
          moved.add(transition.to);
        }
      }

      const moveStates = automaton.states.filter((state) =>
        moved.has(state)
      );
      const nextStates = epsilonClosure(automaton, moveStates);
      const nextName = discover(nextStates);

      transitions.push({
        from: currentName,
        symbol,
        to: nextName,
      });

      steps.push({
        type: 'transition',
        from: currentName,
        symbol,
        move: moveStates,
        closure: nextStates,
        to: nextName,
        message:
          `From ${currentName}, read "${symbol}". ` +
          `Move gives {${moveStates.join(', ') || '∅'}}; ` +
          `its ε-closure is ${nextName}.`,
      });
    }
  }

  return {
    dfa: {
      states: [...discovered.values()].map(stateName),
      alphabet: [...automaton.alphabet],
      startState: startName,
      acceptStates: acceptingStates,
      transitions,
    },
    steps,
  };
}
