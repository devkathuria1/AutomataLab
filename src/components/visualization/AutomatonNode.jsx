import { Handle, Position } from '@xyflow/react';

export default function AutomatonNode({ data }) {
  const { label, isStart, isAccept, width = 84, height = 84 } = data;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: '50%',
        background: isAccept ? '#123b32' : '#172554',
        color: '#f8fafc',
        border: isAccept
          ? '4px double #34d399'
          : isStart
            ? '2px solid #60a5fa'
            : '1px solid #64748b',
        fontSize: width > 100 ? 12 : 15,
        fontWeight: 600,
        padding: 8,
      }}
      className="relative flex items-center justify-center text-center shadow-md"
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <span className="select-none leading-tight">{label}</span>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
