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
// import { memo } from 'react';
// import { Handle, Position, type NodeProps } from 'reactflow';
// import type { WorkflowNodeData, NodeType } from '../../types/workflow';
// import { useWorkflowStore } from '../../store/workflowStore';

// const palette: Record<NodeType, { bg: string; border: string; icon: string; label: string }> = {
//   start:      { bg: '#d1fae5', border: '#10b981', icon: '▶', label: 'Start' },
//   task:       { bg: '#dbeafe', border: '#3b82f6', icon: '✓', label: 'Task' },
//   approval:   { bg: '#fef3c7', border: '#f59e0b', icon: '⚑', label: 'Approval' },
//   automation: { bg: '#ede9fe', border: '#8b5cf6', icon: '⚙', label: 'Automation' },
//   end:        { bg: '#fee2e2', border: '#ef4444', icon: '■', label: 'End' },
// };

// function CustomNode({ id, data, selected }: NodeProps<WorkflowNodeData>) {
//   const colors = palette[data.nodeType];
//   const errorNodeIds = useWorkflowStore((s) => s.errorNodeIds);
//   const hasError = errorNodeIds.has(id);
//   const config = data.config as Record<string, unknown>;
//   const title = (config.title as string) || '';
//   const displayLabel = title || colors.label;

//   const borderColor = hasError ? '#ef4444' : selected ? '#2563eb' : colors.border;
//   const shadow = selected
//     ? `0 0 0 3px ${colors.border}30, 0 4px 16px rgba(0,0,0,0.12)`
//     : '0 2px 8px rgba(0,0,0,0.08)';

//   return (
//     <div
//       style={{
//         background: '#fff',
//         border: `2px solid ${borderColor}`,
//         borderRadius: 12,
//         padding: '10px 14px',
//         minWidth: 170,
//         maxWidth: 220,
//         boxShadow: shadow,
//         transition: 'box-shadow 0.15s, border-color 0.15s',
//         cursor: 'default',
//         userSelect: 'none',
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Top accent stripe */}
//       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: colors.border, borderRadius: '12px 12px 0 0' }} />

//       {/* Handles */}
//       {data.nodeType !== 'start' && (
//         <Handle
//           type="target"
//           position={Position.Left}
//           style={{ width: 10, height: 10, background: '#fff', border: `2px solid ${colors.border}`, left: -5 }}
//         />
//       )}

//       <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingTop: 4 }}>
//         {/* Icon badge */}
//         <div style={{
//           width: 30, height: 30, borderRadius: 8,
//           background: colors.bg,
//           border: `1.5px solid ${colors.border}30`,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           fontSize: 13, color: colors.border, flexShrink: 0,
//         }}>
//           {colors.icon}
//         </div>

//         <div style={{ minWidth: 0, flex: 1 }}>
//           <div style={{ fontSize: 9, fontWeight: 800, color: colors.border, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
//             {data.nodeType}
//           </div>
//           <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//             {displayLabel}
//           </div>
//           {title && (
//             <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>
//               {data.nodeType}
//             </div>
//           )}
//         </div>
//       </div>

//       {hasError && (
//         <div style={{ marginTop: 8, fontSize: 10, color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, background: '#fee2e2', borderRadius: 4, padding: '3px 7px' }}>
//           ⚠ Validation error
//         </div>
//       )}

//       {data.nodeType !== 'end' && (
//         <Handle
//           type="source"
//           position={Position.Right}
//           style={{ width: 10, height: 10, background: '#fff', border: `2px solid ${colors.border}`, right: -5 }}
//         />
//       )}
//     </div>
//   );
// }

// export default memo(CustomNode);
