import { BaseEdge, EdgeLabelRenderer } from '@xyflow/react';

function ellipseRadiusAtAngle(rx, ry, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return (rx * ry) / Math.hypot(ry * cos, rx * sin);
}

export default function AutomatonEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  style,
  markerEnd,
  data,
}) {
  const isSelfLoop = source === target;
  const sRx = data?.sourceRx ?? 42;
  const sRy = data?.sourceRy ?? 42;
  const tRx = data?.targetRx ?? 42;
  const tRy = data?.targetRy ?? 42;

  let edgePath;
  let labelX;
  let labelY;

  if (isSelfLoop) {
    const topY = sourceY - sRy;
    const loopHeight = 56;
    const spread = 36;

    edgePath = `M ${sourceX - 15} ${topY} C ${sourceX - spread} ${topY - loopHeight}, ${sourceX + spread} ${topY - loopHeight}, ${sourceX + 15} ${topY - 2}`;
    labelX = sourceX;
    labelY = topY - loopHeight * 0.78;
  } else {
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const len = Math.hypot(dx, dy) || 1;
    const offset = data?.curveOffset ?? 0;

    // Control point for quadratic bezier (collinear midpoint when offset === 0)
    const nx = -dy / len;
    const ny = dx / len;
    const cx = midX + nx * offset;
    const cy = midY + ny * offset;

    const startAngle = Math.atan2(cy - sourceY, cx - sourceX);
    const endAngle = Math.atan2(cy - targetY, cx - targetX);

    const startR = ellipseRadiusAtAngle(sRx, sRy, startAngle);
    const endR = ellipseRadiusAtAngle(tRx, tRy, endAngle) + 3;

    const sx = sourceX + Math.cos(startAngle) * startR;
    const sy = sourceY + Math.sin(startAngle) * startR;
    const tx = targetX + Math.cos(endAngle) * endR;
    const ty = targetY + Math.sin(endAngle) * endR;

    edgePath = `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
    labelX = 0.25 * sx + 0.5 * cx + 0.25 * tx;
    labelY = 0.25 * sy + 0.5 * cy + 0.25 * ty;
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="rounded-md border border-white/15 bg-[#0b1120]/95 px-2 py-0.5 font-mono text-xs font-semibold text-slate-100 shadow-sm"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
