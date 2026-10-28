
/**
 * Calculates the epsilon closure of one or more states.
 *
 * An epsilon transition is represented by symbol: null.
 *
 * @param {object} automaton
 * @param {string|string[]} inputStates
 * @returns {string[]} All states reachable using zero or more epsilon transitions.
 */
export function epsilonClosure(automaton, inputStates) {
  const statesToVisit = Array.isArray(inputStates)
    ? [...inputStates]
    : [inputStates];

  const closure = new Set(statesToVisit);

  while (statesToVisit.length > 0) {
    const currentState = statesToVisit.pop();

    for (const transition of automaton.transitions) {
      if (
        transition.from === currentState &&
        transition.symbol === null &&
        !closure.has(transition.to)
      ) {
        closure.add(transition.to);
        statesToVisit.push(transition.to);
      }
    }
  }

  return automaton.states.filter((state) => closure.has(state));
}
