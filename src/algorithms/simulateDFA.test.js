
import { simulateDFA } from './simulateDFA.js';

const automaton = {
  states: ['q0', 'q1', 'q2'],
  alphabet: ['0', '1'],
  startState: 'q0',
  acceptStates: ['q2'],
  transitions: [
    { from: 'q0', symbol: null, to: 'q1' },
    { from: 'q1', symbol: '0', to: 'q1' },
    { from: 'q1', symbol: '1', to: 'q2' },
  ],
};

const accepted = simulateDFA(automaton, '1');
console.log('Input "1":', accepted.reason);

if (!accepted.accepted) {
  throw new Error('Expected input "1" to be accepted.');
}

const rejected = simulateDFA(automaton, '0');
console.log('Input "0":', rejected.reason);

if (rejected.accepted) {
  throw new Error('Expected input "0" to be rejected.');
}

const invalid = simulateDFA(automaton, '2');
console.log('Input "2":', invalid.reason);

if (invalid.validInput) {
  throw new Error('Expected input "2" to be invalid.');
}

console.log('String simulation tests passed!');
