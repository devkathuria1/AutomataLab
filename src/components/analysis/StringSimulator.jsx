
import { useState } from 'react';
import { Play, CheckCircle2, XCircle, Route } from 'lucide-react';
import { simulateDFA } from '../../algorithms/simulateDFA.js';

export default function StringSimulator({ automaton }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  function runSimulation() {
    if (!automaton) return;
    setResult(simulateDFA(automaton, input));
  }

  if (!automaton) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#101625] p-6">
        <h3 className="text-lg font-semibold">String Simulator</h3>
        <p className="mt-2 text-sm text-slate-400">
          Define and validate an automaton before testing strings.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#101625] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
          <Route size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">String Simulator</h3>
          <p className="text-sm text-slate-400">
            Test a string against your generated DFA.
          </p>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          runSimulation();
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label className="sr-only" htmlFor="simulator-input">
          Input string
        </label>
        <input
          id="simulator-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter a string, e.g. 0101"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#090d18] px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
        />

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          <Play size={16} />
          Run simulation
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-500">
        Alphabet: {automaton.alphabet.join(', ') || '(empty)'} · Leave the input
        blank to test the empty string.
      </p>

      {result && (
        <div className="mt-6 space-y-4">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              result.accepted
                ? 'border-emerald-400/30 bg-emerald-400/[0.08]'
                : 'border-rose-400/30 bg-rose-400/[0.08]'
            }`}
          >
            {result.accepted ? (
              <CheckCircle2 className="mt-0.5 text-emerald-300" size={22} />
            ) : (
              <XCircle className="mt-0.5 text-rose-300" size={22} />
            )}
            <div>
              <p className="font-semibold">
                {result.accepted
                  ? 'String accepted'
                  : result.validInput
                    ? 'String rejected'
                    : 'Invalid input'}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {result.reason}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-medium">Simulation trace</h4>
            <div className="space-y-2">
              {result.steps.map((step, index) => (
                <div
                  key={`${step.position}-${index}`}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-3 text-sm"
                >
                  <span className="text-slate-500">
                    Step {step.position}
                  </span>
                  <span className="font-mono text-violet-300">
                    {step.symbol === null
                      ? 'Start'
                      : `Read "${step.symbol}"`}
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="font-mono text-blue-300">
                    {step.state}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-3 text-sm text-slate-400">
              Final state:{' '}
              <span className="font-mono text-white">
                {result.finalState}
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
