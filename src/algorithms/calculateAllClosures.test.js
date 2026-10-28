
import { calculateAllClosures } from './calculateAllClosures.js';

const automaton = {
  states: ['q0', 'q1', 'q2'],
  alphabet: ['0', '1'],
  startState: 'q0',
  acceptStates: ['q2'],
  transitions: [
    { from: 'q0', symbol: null, to: 'q1' },
    { from: 'q1', symbol: null, to: 'q2' },
    { from: 'q1', symbol: '0', to: 'q1' },
  ],
};

console.log(
  JSON.stringify(calculateAllClosures(automaton), null, 2)
);
