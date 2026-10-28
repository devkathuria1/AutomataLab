
import { epsilonClosure } from './epsilonClosure.js';

export function calculateAllClosures(automaton) {
  return automaton.states.map((state) => ({
    state,
    closure: epsilonClosure(automaton, state),
  }));
}
