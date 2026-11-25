import { useEffect, useMemo, useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { fetchSubsetConstruction } from '../../api/automataApi.js';
import AutomatonEdge from './AutomatonEdge';
import AutomatonNode from './AutomatonNode';
import { buildGroupedEdges, getEllipsePosition } from './graphUtils';

const nodeTypes = { automaton: AutomatonNode };
const edgeTypes = { automaton: AutomatonEdge };

const NODE_WIDTH = 124;
const NODE_HEIGHT = 82;

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

    const total = dfa.states.length;
    const rx = Math.max(195, total * 48);
    const ry = Math.max(130, total * 34);

    const nodes = dfa.states.map((state, index) => {
      const isStart = state === dfa.startState;
      const isAccept = dfa.acceptStates.includes(state);

      return {
        id: state,
        type: 'automaton',
        position: getEllipsePosition(index, total, rx, ry),
        data: {
          label: `${isStart ? '→ ' : ''}${state}`,
          isStart,
          isAccept,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        },
      };
    });

    const edges = buildGroupedEdges(
      dfa.transitions,
      'dfa-edge',
      '#a78bfa',
      NODE_WIDTH,
      NODE_HEIGHT
    );
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
      <div className="border-b border-white/10 p-4">
        <h3 className="text-base font-semibold">Generated DFA Graph</h3>
        <p className="mt-0.5 text-xs text-slate-400">
          Each DFA node represents a set of ε-NFA states.
        </p>
      </div>

      <div style={{ height: 380 }}>
        <ReactFlow
          nodes={graph.nodes}
          edges={graph.edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
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
