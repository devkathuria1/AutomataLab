
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Workflow } from 'lucide-react';
import { subsetConstructionSteps } from '../../algorithms/subsetConstructionSteps.js';

export default function ConversionStepsPanel({ automaton }) {
  const [currentStep, setCurrentStep] = useState(0);

  const result = useMemo(
    () => (automaton ? subsetConstructionSteps(automaton) : null),
    [automaton]
  );

  if (!automaton) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#101625] p-6">
        <h3 className="text-lg font-semibold">Step-by-Step Conversion</h3>
        <p className="mt-2 text-sm text-slate-400">
          Validate an automaton to explore the conversion process.
        </p>
      </section>
    );
  }

  const steps = result.steps;
  const safeStep = Math.min(currentStep, steps.length - 1);
  const step = steps[safeStep];

  return (
    <section className="rounded-2xl border border-white/10 bg-[#101625] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
          <Workflow size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Step-by-Step Conversion</h3>
          <p className="text-sm text-slate-400">
            Explore how subset construction builds the DFA.
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-slate-400">Conversion progress</span>
        <span className="font-mono text-blue-300">
          Step {safeStep + 1} of {steps.length}
        </span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
          style={{
            width: `${((safeStep + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      <div className="min-h-36 rounded-xl border border-violet-400/20 bg-violet-400/[0.05] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-300">
          {step.type.replace('-', ' ')}
        </p>
        <p className="leading-7 text-slate-200">{step.message}</p>

        {step.type === 'transition' && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-black/20 p-3">
              <p className="text-xs text-slate-500">From</p>
              <p className="mt-1 break-words font-mono text-blue-300">
                {step.from}
              </p>
            </div>
            <div className="rounded-lg bg-black/20 p-3">
              <p className="text-xs text-slate-500">Input</p>
              <p className="mt-1 font-mono text-violet-300">
                {step.symbol}
              </p>
            </div>
            <div className="rounded-lg bg-black/20 p-3">
              <p className="text-xs text-slate-500">To</p>
              <p className="mt-1 break-words font-mono text-emerald-300">
                {step.to}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep((value) => Math.max(0, value - 1))}
          disabled={safeStep === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <button
          type="button"
          onClick={() => setCurrentStep(0)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
        >
          <RotateCcw size={15} />
          Restart
        </button>

        <button
          type="button"
          onClick={() =>
            setCurrentStep((value) =>
              Math.min(steps.length - 1, value + 1)
            )
          }
          disabled={safeStep === steps.length - 1}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
