
import { GitBranch } from 'lucide-react';
import { subsetConstruction } from '../../algorithms/subsetConstruction.js';

export default function DfaResultsPanel({ automaton }) {
  if (!automaton) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#101625] p-6">
        <h3 className="text-lg font-semibold">Generated DFA</h3>
        <p className="mt-2 text-sm text-slate-400">
          Validate an ε-NFA to generate its DFA.
        </p>
      </section>
    );
  }

  const dfa = subsetConstruction(automaton);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#101625] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
          <GitBranch size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Generated DFA</h3>
          <p className="text-sm text-slate-400">
            Built using subset construction
          </p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white/[0.04] p-3">
          <p className="text-xs text-slate-400">DFA states</p>
          <p className="mt-1 text-2xl font-bold">{dfa.states.length}</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] p-3">
          <p className="text-xs text-slate-400">Transitions</p>
          <p className="mt-1 text-2xl font-bold">
            {dfa.transitions.length}
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.04] p-3">
          <p className="text-xs text-slate-400">Accepting states</p>
          <p className="mt-1 text-2xl font-bold">
            {dfa.acceptStates.length}
          </p>
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-300">
        <span className="text-slate-400">Start state:</span>{' '}
        <span className="font-mono text-blue-300">{dfa.startState}</span>
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {dfa.states.map((state) => (
          <span
            key={state}
            className={`rounded-lg border px-3 py-2 font-mono text-sm ${
              dfa.acceptStates.includes(state)
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                : state === dfa.startState
                  ? 'border-blue-400/30 bg-blue-400/10 text-blue-300'
                  : 'border-white/10 bg-white/[0.03] text-slate-200'
            }`}
          >
            {state}
            {dfa.acceptStates.includes(state) ? ' ✓' : ''}
          </span>
        ))}
      </div>

      <h4 className="mb-3 font-medium">DFA Transition Table</h4>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-slate-400">
            <tr>
              <th className="px-3 py-3 font-medium">From state</th>
              <th className="px-3 py-3 font-medium">Input</th>
              <th className="px-3 py-3 font-medium">To state</th>
            </tr>
          </thead>
          <tbody>
            {dfa.transitions.map((transition, index) => (
              <tr key={index} className="border-t border-white/[0.06]">
                <td className="px-3 py-3 font-mono text-blue-300">
                  {transition.from}
                </td>
                <td className="px-3 py-3 font-mono">
                  {transition.symbol}
                </td>
                <td className="px-3 py-3 font-mono text-violet-300">
                  {transition.to}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
