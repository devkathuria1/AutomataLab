
import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { subsetConstruction } from '../../algorithms/subsetConstruction.js';

export default function DfaGraph({ automaton }) {
  const dfa = useMemo(
    () => (automaton ? subsetConstruction(automaton) : null),
    [automaton]
  );

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

      <div style={{ height: 480 }}>
        <ReactFlow
          nodes={graph.nodes}
          edges={graph.edges}
          fitView
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
        >
          <Background color="#334155" gap={24} />
          <Controls />
          <MiniMap
            nodeColor={(node) =>
              dfa.acceptStates.includes(node.id)
                ? '#34d399'
                : '#a78bfa'
            }
            maskColor="rgba(9, 13, 24, 0.7)"
          />
        </ReactFlow>
      </div>
    </section>
  );
}
