
import { calculateAllClosures } from '../../algorithms/calculateAllClosures';
import { Workflow } from 'lucide-react';

export default function EpsilonClosurePanel({ automaton }) {
  if (!automaton) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#101625] p-6">
        <h3 className="text-lg font-semibold">ε-Closure Results</h3>
        <p className="mt-2 text-sm text-slate-400">
          Validate an automaton to calculate its epsilon closures.
        </p>
      </section>
    );
  }

  const closures = calculateAllClosures(automaton);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#101625] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
          <Workflow size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">ε-Closure Results</h3>
          <p className="text-sm text-slate-400">
            States reachable without consuming input
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="px-3 py-3 font-medium">State</th>
              <th className="px-3 py-3 font-medium">ε-Closure</th>
            </tr>
          </thead>
          <tbody>
            {closures.map(({ state, closure }) => (
              <tr key={state} className="border-b border-white/[0.06]">
                <td className="px-3 py-3 font-mono text-blue-300">
                  {state}
                </td>
                <td className="px-3 py-3 font-mono text-slate-200">
                  {'{'}{closure.join(', ')}{'}'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
