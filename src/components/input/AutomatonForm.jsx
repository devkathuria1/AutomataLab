import { useState } from 'react';
import {
  Plus,
  Trash2,
  Check,
  RotateCcw,
  ArrowRight,
  Info,
} from 'lucide-react';
import { sampleAutomata } from '../../data/sampleAutomata';

const emptyAutomaton = {
  states: ['q0', 'q1'],
  alphabet: ['0', '1'],
  startState: 'q0',
  acceptStates: ['q1'],
  transitions: [{ from: 'q0', symbol: '0', to: 'q1' }],
};

export default function AutomatonForm({ onGenerate }) {
  const [automaton, setAutomaton] = useState(emptyAutomaton);
  const [newState, setNewState] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [transition, setTransition] = useState({
    from: 'q0',
    symbol: 'ε',
    to: 'q1',
  });
  const [error, setError] = useState('');

  const update = (changes) => {
    setAutomaton((current) => ({ ...current, ...changes }));
    setError('');
  };

  const loadSample = (id) => {
    const sample = sampleAutomata.find((item) => item.id === id);
    if (!sample) return;

    const { id: _id, name: _name, description: _description, ...data } = sample;
    setAutomaton({
      ...data,
      states: [...data.states],
      alphabet: [...data.alphabet],
      acceptStates: [...data.acceptStates],
      transitions: data.transitions.map((item) => ({ ...item })),
    });
    setTransition({
      from: data.states[0],
      symbol: 'ε',
      to: data.states[1] ?? data.states[0],
    });
    setError('');
  };

  const addState = () => {
    const state = newState.trim();
    if (!state) return setError('Enter a state name.');
    if (automaton.states.includes(state)) {
      return setError('That state already exists.');
    }

    update({
      states: [...automaton.states, state],
      acceptStates: automaton.acceptStates,
    });
    setNewState('');
  };

  const removeState = (state) => {
    const states = automaton.states.filter((item) => item !== state);
    if (!states.length) return setError('At least one state is required.');

    update({
      states,
      startState:
        automaton.startState === state ? states[0] : automaton.startState,
      acceptStates: automaton.acceptStates.filter((item) => item !== state),
      transitions: automaton.transitions.filter(
        (item) => item.from !== state && item.to !== state,
      ),
    });
  };

  const addSymbol = () => {
    const symbol = newSymbol.trim();
    if (!symbol || symbol === 'ε') {
      return setError('Enter a valid input symbol other than ε.');
    }
    if ([...symbol].length !== 1) {
      return setError('For now, use single-character symbols.');
    }
    if (automaton.alphabet.includes(symbol)) {
      return setError('That symbol already exists.');
    }

    update({ alphabet: [...automaton.alphabet, symbol] });
    setNewSymbol('');
  };

  const removeSymbol = (symbol) => {
    update({
      alphabet: automaton.alphabet.filter((item) => item !== symbol),
      transitions: automaton.transitions.filter(
        (item) => item.symbol !== symbol,
      ),
    });
  };

  const addTransition = () => {
    const symbol = transition.symbol === 'ε' ? null : transition.symbol;

    if (
      !automaton.states.includes(transition.from) ||
      !automaton.states.includes(transition.to)
    ) {
      return setError('Choose valid source and destination states.');
    }
    if (symbol !== null && !automaton.alphabet.includes(symbol)) {
      return setError('Choose a symbol from the declared alphabet.');
    }
    if (
      automaton.transitions.some(
        (item) =>
          item.from === transition.from &&
          item.to === transition.to &&
          item.symbol === symbol,
      )
    ) {
      return setError('This transition already exists.');
    }

    update({
      transitions: [
        ...automaton.transitions,
        { ...transition, symbol },
      ],
    });
  };

  const removeTransition = (index) => {
    update({
      transitions: automaton.transitions.filter((_, i) => i !== index),
    });
  };

  const generate = () => {
    if (!automaton.states.includes(automaton.startState)) {
      return setError('Choose a valid start state.');
    }
    if (
      automaton.acceptStates.some(
        (state) => !automaton.states.includes(state),
      )
    ) {
      return setError('All accepting states must exist.');
    }

    setError('');
    onGenerate({
      ...automaton,
      states: [...automaton.states],
      alphabet: [...automaton.alphabet],
      acceptStates: [...automaton.acceptStates],
      transitions: automaton.transitions.map((item) => ({ ...item })),
    });
  };

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-[#0b1120] px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-blue-400/60';

  const buttonClass =
    'inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-400/40 hover:bg-white/[0.05]';

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Load an example
        </label>
        <select
          className={inputClass}
          value=""
          onChange={(event) => loadSample(event.target.value)}
        >
          <option value="" disabled>
            Choose a sample automaton...
          </option>
          {sampleAutomata.map((sample) => (
            <option key={sample.id} value={sample.id}>
              {sample.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-100">States</h3>
          <span className="text-xs text-slate-500">
            {automaton.states.length} states
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {automaton.states.map((state) => (
            <div
              key={state}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            >
              <span className="text-sm text-slate-200">{state}</span>
              <button
                type="button"
                title={`Remove ${state}`}
                onClick={() => removeState(state)}
                className="text-slate-500 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            className={inputClass}
            placeholder="New state name"
            value={newState}
            onChange={(event) => setNewState(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && addState()}
          />
          <button type="button" className={buttonClass} onClick={addState}>
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Start state
          </label>
          <select
            className={inputClass}
            value={automaton.startState}
            onChange={(event) => update({ startState: event.target.value })}
          >
            {automaton.states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Accepting states
          </label>
          <div className="flex min-h-11 flex-wrap gap-3 rounded-lg border border-white/10 bg-[#0b1120] p-3">
            {automaton.states.map((state) => (
              <label
                key={state}
                className="flex items-center gap-1.5 text-sm text-slate-300"
              >
                <input
                  type="checkbox"
                  checked={automaton.acceptStates.includes(state)}
                  onChange={(event) =>
                    update({
                      acceptStates: event.target.checked
                        ? [...automaton.acceptStates, state]
                        : automaton.acceptStates.filter(
                            (item) => item !== state,
                          ),
                    })
                  }
                  className="accent-blue-500"
                />
                {state}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-slate-100">Input alphabet</h3>

        <div className="flex flex-wrap gap-2">
          {automaton.alphabet.map((symbol) => (
            <div
              key={symbol}
              className="flex items-center gap-2 rounded-lg border border-blue-400/20 bg-blue-400/[0.06] px-3 py-2"
            >
              <span className="font-mono text-sm text-blue-300">{symbol}</span>
              <button
                type="button"
                title={`Remove symbol ${symbol}`}
                onClick={() => removeSymbol(symbol)}
                className="text-slate-500 hover:text-red-400"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            className={inputClass}
            placeholder="New symbol, e.g. a"
            value={newSymbol}
            maxLength={1}
            onChange={(event) => setNewSymbol(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && addSymbol()}
          />
          <button type="button" className={buttonClass} onClick={addSymbol}>
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-slate-100">Transitions</h3>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs text-slate-500">From</label>
            <select
              className={inputClass}
              value={transition.from}
              onChange={(event) =>
                setTransition({ ...transition, from: event.target.value })
              }
            >
              {automaton.states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-slate-500">Symbol</label>
            <select
              className={inputClass}
              value={transition.symbol}
              onChange={(event) =>
                setTransition({ ...transition, symbol: event.target.value })
              }
            >
              <option value="ε">ε (epsilon)</option>
              {automaton.alphabet.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-slate-500">To</label>
            <select
              className={inputClass}
              value={transition.to}
              onChange={(event) =>
                setTransition({ ...transition, to: event.target.value })
              }
            >
              {automaton.states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          className={`${buttonClass} mt-3`}
          onClick={addTransition}
        >
          <Plus size={16} />
          Add transition
        </button>

        <div className="mt-4 space-y-2">
          {automaton.transitions.map((item, index) => (
            <div
              key={`${item.from}-${item.symbol}-${item.to}-${index}`}
              className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5"
            >
              <span className="font-mono text-sm text-slate-300">
                {item.from}
                <span className="mx-2 text-blue-400">—</span>
                {item.symbol ?? 'ε'}
                <span className="mx-2 text-blue-400">→</span>
                {item.to}
              </span>
              <button
                type="button"
                title="Remove transition"
                onClick={() => removeTransition(index)}
                className="text-slate-500 transition hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {automaton.transitions.length === 0 && (
            <p className="text-sm text-slate-500">No transitions defined.</p>
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-400/20 bg-red-400/[0.06] p-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 border-t border-white/[0.08] pt-5">
        <button
          type="button"
          onClick={() => loadSample('basic-epsilon')}
          className={buttonClass}
        >
          <RotateCcw size={15} />
          Reset example
        </button>
        <button
          type="button"
          onClick={generate}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          <Check size={16} />
          Validate & continue
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex gap-2 rounded-xl border border-blue-400/10 bg-blue-400/[0.04] p-3 text-xs leading-5 text-slate-400">
        <Info size={16} className="mt-0.5 shrink-0 text-blue-400" />
        This editor prepares the automaton data. We will connect it to the
        actual conversion algorithm in the next steps.
      </div>
    </div>
  );
}