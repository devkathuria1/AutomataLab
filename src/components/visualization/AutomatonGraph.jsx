import { useMemo } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AutomatonEdge from './AutomatonEdge';
import AutomatonNode from './AutomatonNode';
import { buildGroupedEdges, getEllipsePosition } from './graphUtils';

const nodeTypes = { automaton: AutomatonNode };
const edgeTypes = { automaton: AutomatonEdge };

const NODE_WIDTH = 84;
const NODE_HEIGHT = 84;

function buildGraph(automaton) {
  const total = automaton.states.length;
  const rx = Math.max(165, total * 45);
  const ry = Math.max(115, total * 30);

  const nodes = automaton.states.map((state, index) => {
    const isStart = state === automaton.startState;
    const isAccept = automaton.acceptStates.includes(state);

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
    automaton.transitions,
    'edge',
    '#93a4c7',
    NODE_WIDTH,
    NODE_HEIGHT
  );
  return { nodes, edges };
}

export default function AutomatonGraph({ automaton }) {
  const graph = useMemo(() => buildGraph(automaton), [automaton]);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101625]">
      <div className="border-b border-white/10 p-4">
        <h3 className="text-base font-semibold">Automaton Graph (ε-NFA)</h3>
        <p className="mt-0.5 text-xs text-slate-400">
          Drag nodes to rearrange; scroll to zoom and pan.
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
