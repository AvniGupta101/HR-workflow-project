import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { WorkflowNodeData, NodeType } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

const palette: Record<NodeType, { bg: string; border: string; icon: string }> = {
  start:      { bg: '#dcfce7', border: '#16a34a', icon: '▶' },
  task:       { bg: '#dbeafe', border: '#2563eb', icon: '✓' },
  approval:   { bg: '#ffedd5', border: '#ea580c', icon: '⚑' },
  automation: { bg: '#ede9fe', border: '#7c3aed', icon: '⚙' },
  end:        { bg: '#fee2e2', border: '#dc2626', icon: '■' },
};

function CustomNode({ id, data, selected }: NodeProps<WorkflowNodeData>) {
  const colors = palette[data.nodeType];
  const errorNodeIds = useWorkflowStore((s) => s.errorNodeIds);
  const hasError = errorNodeIds.has(id);
  const config = data.config as Record<string, unknown>;
  const label = (config.title as string) || data.nodeType;

  return (
    <div
      style={{
        background: colors.bg,
        border: `2px solid ${hasError ? '#dc2626' : selected ? '#1e40af' : colors.border}`,
        borderRadius: 10,
        padding: '10px 16px',
        minWidth: 160,
        boxShadow: selected
          ? `0 0 0 3px ${colors.border}40`
          : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.15s, border 0.15s',
        cursor: 'grab',
        userSelect: 'none',
      }}
    >
      {data.nodeType !== 'start' && (
        <Handle type="target" position={Position.Left} style={{ background: colors.border }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontSize: 16,
            background: colors.border,
            color: '#fff',
            width: 26,
            height: 26,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {colors.icon}
        </span>
        <div>
          <div style={{ fontSize: 10, color: colors.border, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            {data.nodeType}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
          </div>
        </div>
      </div>

      {hasError && (
        <div style={{ fontSize: 10, color: '#dc2626', marginTop: 4 }}>⚠ Validation error</div>
      )}

      {data.nodeType !== 'end' && (
        <Handle type="source" position={Position.Right} style={{ background: colors.border }} />
      )}
    </div>
  );
}

export default memo(CustomNode);