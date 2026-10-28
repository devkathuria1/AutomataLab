
import { subsetConstruction } from './subsetConstruction.js';

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

const dfa = subsetConstruction(automaton);

console.log('DFA states:', dfa.states);
console.log('DFA start state:', dfa.startState);
console.log('DFA accepting states:', dfa.acceptStates);
console.log('DFA transitions:', dfa.transitions);

if (!dfa.acceptStates.length) {
  throw new Error('Expected at least one accepting DFA state.');
}

console.log('Subset construction test passed!');
