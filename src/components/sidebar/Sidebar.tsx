const NODE_TYPES = [
  { type: 'start',      label: 'Start',      color: '#16a34a', icon: '▶', desc: 'Workflow entry point' },
  { type: 'task',       label: 'Task',        color: '#2563eb', icon: '✓', desc: 'Assign work to someone' },
  { type: 'approval',   label: 'Approval',    color: '#ea580c', icon: '⚑', desc: 'Request approval' },
  { type: 'automation', label: 'Automation',  color: '#7c3aed', icon: '⚙', desc: 'Trigger an action' },
  { type: 'end',        label: 'End',         color: '#dc2626', icon: '■', desc: 'Workflow exit point' },
];

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ width: 200, padding: '16px 12px', borderRight: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
        Node Types
      </div>

      {NODE_TYPES.map(({ type, label, color, icon, desc }) => (
        <div
          key={type}
          draggable
          onDragStart={(e) => onDragStart(e, type)}
          style={{
            padding: '10px 12px',
            background: '#fff',
            border: `1.5px solid ${color}20`,
            borderLeft: `4px solid ${color}`,
            borderRadius: 8,
            cursor: 'grab',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            transition: 'transform 0.1s, box-shadow 0.1s',
            userSelect: 'none',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateX(2px)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = '';
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color, fontSize: 13 }}>{icon}</span>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{label}</span>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{desc}</div>
        </div>
      ))}

      <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 8, textAlign: 'center' }}>
        Drag nodes onto canvas
      </div>
    </div>
  );
}