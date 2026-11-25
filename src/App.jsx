import { useState } from 'react';
import AutomatonForm from './components/input/AutomatonForm';
import EpsilonClosurePanel from './components/analysis/EpsilonClosurePanel';
import DfaResultsPanel from './components/analysis/DfaResultsPanel';
import AutomatonGraph from './components/visualization/AutomatonGraph';
import DfaGraph from './components/visualization/DfaGraph';
import StringSimulator from './components/analysis/StringSimulator';
import ConversionStepsPanel from './components/analysis/ConversionStepsPanel';
import { sampleAutomata } from './data/sampleAutomata';
import { GitBranch, CircleHelp, Network, Workflow, Table2 } from 'lucide-react';

const initialSample = {
  states: [...sampleAutomata[0].states],
  alphabet: [...sampleAutomata[0].alphabet],
  startState: sampleAutomata[0].startState,
  acceptStates: [...sampleAutomata[0].acceptStates],
  transitions: sampleAutomata[0].transitions.map((item) => ({ ...item })),
};

const tabs = [
  { id: 'graphs', label: 'Graphs & Simulator', icon: Network },
  { id: 'steps', label: 'Steps & ε-Closures', icon: Workflow },
  { id: 'table', label: 'DFA Transition Table', icon: Table2 },
];

export default function App() {
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('graphs');
  const [automaton, setAutomaton] = useState(initialSample);

  return (
    <div className="min-h-screen bg-[#090d18] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/[0.08] bg-[#090d18]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-950/40">
              <GitBranch size={20} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight sm:text-lg">
                Automata<span className="text-blue-400">Lab</span>
              </h1>
              <p className="text-xs text-slate-500">
                ε-NFA → DFA Visualizer &amp; Simulator
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGuide((current) => !current)}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-blue-400/40 hover:bg-white/[0.04] hover:text-white"
          >
            <CircleHelp size={16} />
            <span className="hidden sm:inline">How it works</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6">
        {showGuide && (
          <section className="mb-5 rounded-2xl border border-blue-400/20 bg-blue-400/[0.05] p-4 text-sm">
            <h2 className="font-semibold text-white">
              How the conversion works
            </h2>
            <p className="mt-1 leading-6 text-slate-400">
              1. Pick an example or edit your ε-NFA on the left, then click{' '}
              <strong className="text-slate-200">Validate &amp; continue</strong>.{' '}
              2. Inspect the <strong className="text-slate-200">ε-NFA</strong> and{' '}
              <strong className="text-slate-200">Generated DFA</strong> graphs.{' '}
              3. Test strings in the{' '}
              <strong className="text-slate-200">String Simulator</strong> or
              switch tabs to view step-by-step subset construction and the full
              DFA transition table.
            </p>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-12" id="workspace">
          <section className="h-fit rounded-2xl border border-white/10 bg-[#101625] p-5 lg:col-span-4">
            <h2 className="mb-1 text-lg font-semibold">ε-NFA Input Editor</h2>
            <p className="mb-4 text-xs text-slate-400">
              Load an example (updates immediately) or customize states and
              transitions, then click Validate &amp; continue.
            </p>
            <AutomatonForm onGenerate={setAutomaton} />
          </section>

          <div className="space-y-5 lg:col-span-8">
            <nav
              aria-label="Workspace views"
              className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#101625] p-2"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-950/50'
                        : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className={activeTab === 'graphs' ? 'space-y-5' : 'hidden'}>
              <div className="grid gap-5 md:grid-cols-2">
                <AutomatonGraph automaton={automaton} />
                <DfaGraph automaton={automaton} />
              </div>
              <StringSimulator automaton={automaton} />
            </div>

            <div className={activeTab === 'steps' ? 'grid gap-5 md:grid-cols-2' : 'hidden'}>
              <ConversionStepsPanel automaton={automaton} />
              <EpsilonClosurePanel automaton={automaton} />
            </div>

            <div className={activeTab === 'table' ? 'space-y-5' : 'hidden'}>
              <DfaResultsPanel automaton={automaton} />
            </div>
          </div>
        </div>

        <footer className="mt-10 border-t border-white/[0.07] py-4 text-center text-xs text-slate-600">
          AutomataLab · Learn automata theory visually
        </footer>
      </main>
    </div>
  );
}
