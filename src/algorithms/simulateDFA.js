
import { subsetConstruction } from './subsetConstruction.js';

export function simulateDFA(automaton, input) {
  const dfa = subsetConstruction(automaton);

  let currentState = dfa.startState;
  const steps = [
    {
      position: 0,
      symbol: null,
      state: currentState,
    },
  ];

  // Treat the input as a sequence of alphabet symbols.
  const symbols = input === '' ? [] : input.match(/./gu) ?? [];

  for (let index = 0; index < symbols.length; index += 1) {
    const symbol = symbols[index];

    if (!dfa.alphabet.includes(symbol)) {
      return {
        accepted: false,
        validInput: false,
        reason: `Unknown input symbol: ${symbol}`,
        steps,
        finalState: currentState,
      };
    }

    const transition = dfa.transitions.find(
      (item) =>
        item.from === currentState &&
        item.symbol === symbol
    );

    if (!transition) {
      return {
        accepted: false,
        validInput: true,
        reason: `No transition for symbol "${symbol}"`,
        steps,
        finalState: currentState,
      };
    }

    currentState = transition.to;

    steps.push({
      position: index + 1,
      symbol,
      state: currentState,
    });
  }

  const accepted = dfa.acceptStates.includes(currentState);

  return {
    accepted,
    validInput: true,
    reason: accepted
      ? 'The DFA accepts this string.'
      : 'The DFA rejects this string.',
    steps,
    finalState: currentState,
  };
}
