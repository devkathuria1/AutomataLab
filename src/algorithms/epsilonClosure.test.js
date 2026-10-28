
import { epsilonClosure } from './epsilonClosure.js';

const automaton = {
  states: ['q0', 'q1', 'q2', 'q3'],
  alphabet: ['0', '1'],
  startState: 'q0',
  acceptStates: ['q3'],
  transitions: [
    { from: 'q0', symbol: null, to: 'q1' },
    { from: 'q1', symbol: null, to: 'q2' },
    { from: 'q2', symbol: '0', to: 'q3' },
  ],
};

const result1 = epsilonClosure(automaton, 'q0');
console.log('Closure of q0:', result1);
// Expected: ['q0', 'q1', 'q2']

const result2 = epsilonClosure(automaton, 'q2');
console.log('Closure of q2:', result2);
// Expected: ['q2']
