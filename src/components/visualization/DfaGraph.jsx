
import { useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { fetchSubsetConstruction } from '../../api/automataApi.js';

export default function DfaGraph({ automaton }) {
  const [dfa, setDfa] = useState(null);

  useEffect(() => {
    if (!automaton) return;
    let cancelled = false;

    fetchSubsetConstruction(automaton)
      .then((data) => {
        if (!cancelled) setDfa(data);
      })
      .catch(() => {
        if (!cancelled) setDfa(null);
      });

    return () => {
      cancelled = true;
    };
  }, [automaton]);

  const graph = useMemo(() => {
    if (!dfa) return { nodes: [], edges: [] };

    const nodes = dfa.states.map((state, index) => {
      const isStart = state === dfa.startState;
      const isAccept = dfa.acceptStates.includes(state);

      return {
        id: state,
        position: {
          x: 100 + (index % 3) * 220,
          y: 100 + Math.floor(index / 3) * 160,
        },
        data: { label: `${isStart ? '→ ' : ''}${state}` },
        style: {
          width: 130,
          height: 90,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isAccept ? '#123b32' : '#172554',
          color: '#f8fafc',
          border: isAccept
            ? '4px double #34d399'
            : isStart
              ? '2px solid #60a5fa'
              : '1px solid #64748b',
          fontSize: 12,
          fontWeight: 600,
          padding: 8,
        },
      };
    });

    const edges = dfa.transitions.map((transition, index) => ({
      id: `dfa-edge-${index}`,
      source: transition.from,
      target: transition.to,
      label: transition.symbol,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#a78bfa', strokeWidth: 2 },
      labelStyle: { fill: '#e2e8f0', fontWeight: 600 },
      labelBgStyle: { fill: '#101625' },
    }));

    return { nodes, edges };
  }, [dfa]);

  if (!automaton) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#101625] p-6">
        <h3 className="text-lg font-semibold">DFA Graph</h3>
        <p className="mt-2 text-sm text-slate-400">
          Validate an input automaton to visualize the converted DFA.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101625]">
      <div className="border-b border-white/10 p-5">
        <h3 className="text-lg font-semibold">Generated DFA Graph</h3>
        <p className="mt-1 text-sm text-slate-400">
          Each DFA node represents a set of ε-NFA states.
        </p>
      </div>

      <div style={{ height: 360 }}>
        <ReactFlow
          nodes={graph.nodes}
          edges={graph.edges}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
        >
          <Background color="#334155" gap={24} />
          <Controls className="!rounded-lg !border !border-white/10 !bg-[#0b1120] [&>button]:!border-white/10 [&>button]:!bg-[#0b1120] [&>button]:!fill-slate-200 [&>button:hover]:!bg-white/10" />
        </ReactFlow>
      </div>
    </section>
  );
}
