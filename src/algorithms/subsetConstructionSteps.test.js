
import { subsetConstructionSteps } from './subsetConstructionSteps.js';

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

const result = subsetConstructionSteps(automaton);

console.log('DFA start:', result.dfa.startState);
console.log('DFA states:', result.dfa.states);
console.log('DFA accepting states:', result.dfa.acceptStates);
console.log('Conversion steps:');

result.steps.forEach((step, index) => {
  console.log(`${index + 1}. ${step.message}`);
});

if (result.dfa.startState !== '{q0, q1}') {
  throw new Error('Incorrect DFA start state.');
}

if (!result.dfa.acceptStates.includes('{q2}')) {
  throw new Error('Expected {q2} to be accepting.');
}

if (!result.steps.some((step) => step.type === 'transition')) {
  throw new Error('Expected transition steps.');
}

console.log('Step-by-step conversion test passed!');
