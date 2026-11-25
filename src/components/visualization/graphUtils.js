import { MarkerType } from '@xyflow/react';

export function getEllipsePosition(index, total, rx = 190, ry = 125) {
  if (total <= 1) return { x: 200, y: 150 };
  if (total === 2) {
    return index === 0 ? { x: 80, y: 150 } : { x: 340, y: 150 };
  }
  // Start state (index 0) at left-top, remaining states distributed clockwise on a convex ellipse
  const angle = Math.PI + (index * 2 * Math.PI) / total;
  return {
    x: 240 + Math.cos(angle) * rx,
    y: 170 + Math.sin(angle) * ry,
  };
}

export function buildGroupedEdges(
  transitions,
  prefix,
  strokeColor,
  nodeWidth,
  nodeHeight
) {
  const grouped = new Map();

  for (const t of transitions) {
    const key = `${t.from}__TO__${t.to}`;
    const symbolLabel = t.symbol ?? 'ε';
    if (!grouped.has(key)) {
      grouped.set(key, { from: t.from, to: t.to, symbols: [symbolLabel] });
    } else if (!grouped.get(key).symbols.includes(symbolLabel)) {
      grouped.get(key).symbols.push(symbolLabel);
    }
  }

  const entries = [...grouped.values()];
  const rx = nodeWidth / 2;
  const ry = nodeHeight / 2;

  return entries.map((entry, index) => {
    const hasReverse =
      entry.from !== entry.to &&
      grouped.has(`${entry.to}__TO__${entry.from}`);

    return {
      id: `${prefix}-${index}`,
      source: entry.from,
      target: entry.to,
      label: entry.symbols.join(', '),
      type: 'automaton',
      data: {
        curveOffset: hasReverse ? 42 : 0,
        sourceRx: rx,
        sourceRy: ry,
        targetRx: rx,
        targetRy: ry,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: strokeColor,
      },
      style: { stroke: strokeColor, strokeWidth: 2 },
    };
  });
}
