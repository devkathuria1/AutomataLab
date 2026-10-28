
import { useState } from 'react';
import AutomatonForm from './components/input/AutomatonForm';
import EpsilonClosurePanel from './components/analysis/EpsilonClosurePanel';
import DfaResultsPanel from './components/analysis/DfaResultsPanel';
import AutomatonGraph from './components/visualization/AutomatonGraph';
import DfaGraph from './components/visualization/DfaGraph';
import StringSimulator from './components/analysis/StringSimulator';
import ConversionStepsPanel from './components/analysis/ConversionStepsPanel';
import {
  GitBranch,
  CircleHelp,
  Network,
  Workflow,
  Play,
  Sparkles,
  ArrowRight,
  Code2,
} from 'lucide-react';

const features = [
  {
    icon: Network,
    title: 'Automaton Editor',
    description:
      'Define states, input symbols, start states, accepting states, and transitions.',
    number: '01',
  },
  {
    icon: Workflow,
    title: 'Step-by-Step Conversion',
    description:
      'Understand epsilon closures and discover DFA states through subset construction.',
    number: '02',
  },
  {
    icon: Play,
    title: 'String Simulator',
    description:
      'Run strings through your generated DFA and visualize acceptance or rejection.',
    number: '03',
  },
];

export default function App() {
  const [showGuide, setShowGuide] = useState(false);
  const [automaton, setAutomaton] = useState(null);

  const scrollToWorkspace = () => {
    document
      .getElementById('workspace')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090d18] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/[0.08] bg-[#090d18]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-950/40">
              <GitBranch size={22} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Automata<span className="text-blue-400">Lab</span>
              </h1>
              <p className="text-xs text-slate-500">
                ε-NFA → DFA Visualizer
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGuide((current) => !current)}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-400/40 hover:bg-white/[0.04] hover:text-white"
          >
            <CircleHelp size={16} />
            <span className="hidden sm:inline">How it works</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-[#121c35] via-[#11182b] to-[#171329] p-7 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-3 py-1.5 text-xs font-medium text-blue-300">
              <Sparkles size={14} />
              Interactive Automata Learning
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              From
              <span className="text-blue-400"> ε-NFA </span>
              to
              <span className="text-violet-400"> DFA.</span>
              <br />
              See every step.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Explore finite automata through interactive visualizations.
              Calculate epsilon closures, follow subset construction, and
              understand how nondeterministic automata become deterministic.
            </p>

            <button
              onClick={scrollToWorkspace}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-400"
            >
              Explore workspace
              <ArrowRight size={18} />
            </button>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Interactive learning
              </span>
              <span className="flex items-center gap-2">
                <Code2 size={15} />
                Algorithm-driven results
              </span>
            </div>
          </div>
        </section>

        {showGuide && (
          <section className="mt-5 rounded-2xl border border-blue-400/20 bg-blue-400/[0.05] p-6">
            <h3 className="font-semibold text-white">
              How the conversion works
            </h3>
            <p className="mt-2 leading-7 text-slate-400">
              An epsilon-NFA can change states without consuming an input
              symbol. We calculate epsilon closures, apply subset construction
              to generate DFA states, and then simulate input strings on the
              resulting deterministic automaton.
            </p>
          </section>
        )}

        <section className="mt-12" id="workspace">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Your workspace
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Start exploring
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Create an automaton and inspect your input below.
              </p>
            </div>

            <span className="w-fit rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
              Interactive editor · Phase 2
            </span>
          </div>

          <div className="mb-6 grid gap-5 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="group rounded-2xl border border-white/[0.08] bg-[#101625] p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#131c2e]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/[0.08] text-blue-300">
                      <Icon size={21} />
                    </div>
                    <span className="font-mono text-xs text-slate-600">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-100">
                    {feature.title}
                  </h3>

                  <p className="mt-2 min-h-14 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                    {feature.number === '01'
                      ? 'Input editor available below'
                      : 'Coming in the next development phases'}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-[#101625] p-5 sm:p-6">
              <h3 className="mb-2 text-lg font-semibold">
                ε-NFA Input Editor
              </h3>
              <p className="mb-6 text-sm text-slate-400">
                Define your states, alphabet, and transitions.
              </p>

              <AutomatonForm onGenerate={setAutomaton} />
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#101625] p-5 sm:p-6">
              <h3 className="text-lg font-semibold">Automaton Preview</h3>
              <p className="mt-2 text-sm text-slate-400">
                {automaton
                  ? 'Your input has been passed to the preview.'
                  : 'Load an example or define an automaton, then select Validate & continue.'}
              </p>

              {automaton && (
                <div className="mt-5 space-y-4 text-sm text-slate-300">
                  <div className="rounded-lg border border-white/[0.08] bg-black/20 p-3">
                    <p className="mb-1 text-slate-500">States</p>
                    <p className="break-words">
                      {automaton.states.join(', ')}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/[0.08] bg-black/20 p-3">
                    <p className="mb-1 text-slate-500">Input alphabet</p>
                    <p>{automaton.alphabet.join(', ') || 'Empty'}</p>
                  </div>

                  <div className="rounded-lg border border-white/[0.08] bg-black/20 p-3">
                    <p className="mb-1 text-slate-500">Start state</p>
                    <p>{automaton.startState}</p>
                  </div>

                  <div className="rounded-lg border border-white/[0.08] bg-black/20 p-3">
                    <p className="mb-1 text-slate-500">Accepting states</p>
                    <p>
                      {automaton.acceptStates.join(', ') || 'None'}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/[0.08] bg-black/20 p-3">
                    <p className="mb-1 text-slate-500">Transitions</p>
                    <p>{automaton.transitions.length}</p>
                  </div>
                </div>
              )}
            </section>
            <EpsilonClosurePanel automaton={automaton} />
            <DfaResultsPanel automaton={automaton} />
            {automaton && <AutomatonGraph automaton={automaton} />}
            {automaton && <DfaGraph automaton={automaton} />}
            <StringSimulator automaton={automaton} />
            <ConversionStepsPanel automaton={automaton} />

          </div>
        </section>

        <footer className="mt-14 border-t border-white/[0.07] py-6 text-center text-xs text-slate-600">
          AutomataLab · Learn automata theory visually
        </footer>
      </main>
    </div>
  );
}
