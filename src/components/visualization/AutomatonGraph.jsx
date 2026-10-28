
import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function buildGraph(automaton) {
  const nodes = automaton.states.map((state, index) => {
    const isStart = state === automaton.startState;
    const isAccept = automaton.acceptStates.includes(state);

    return {
      id: state,
      position: {
        x: 100 + (index % 3) * 210,
        y: 100 + Math.floor(index / 3) * 150,
      },
      data: {
        label: `${isStart ? '→ ' : ''}${state}`,
      },
      style: {
        width: 90,
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
        fontSize: 16,
        fontWeight: 600,
      },
    };
  });

  const edges = automaton.transitions.map((transition, index) => ({
    id: `edge-${index}`,
    source: transition.from,
    target: transition.to,
    label: transition.symbol ?? 'ε',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#93a4c7', strokeWidth: 2 },
    labelStyle: { fill: '#e2e8f0', fontWeight: 600 },
    labelBgStyle: { fill: '#101625' },
  }));

  return { nodes, edges };
}

export default function AutomatonGraph({ automaton }) {
  const graph = useMemo(
    () => buildGraph(automaton),
    [automaton]
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101625]">
      <div className="border-b border-white/10 p-5">
        <h3 className="text-lg font-semibold">Automaton Graph</h3>
        <p className="mt-1 text-sm text-slate-400">
          Drag nodes to rearrange them; zoom and pan to explore.
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
              automaton.acceptStates.includes(node.id)
                ? '#34d399'
                : '#60a5fa'
            }
            maskColor="rgba(9, 13, 24, 0.7)"
          />
        </ReactFlow>
      </div>
    </section>
  );
}
