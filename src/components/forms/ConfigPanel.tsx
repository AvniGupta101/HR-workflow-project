import { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { getAutomations } from '../../api/mockApi';
import type { AutomationAction, TaskConfig, ApprovalConfig, AutomationConfig, StartConfig, EndConfig, KVPair } from '../../types/workflow';

const input: React.CSSProperties = {
  display: 'block', width: '100%', padding: '7px 10px', marginBottom: 12,
  border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, color: '#1e293b',
  outline: 'none', boxSizing: 'border-box', background: '#fff',
};

const label: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5,
};

function Label({ children }: { children: React.ReactNode }) {
  return <span style={label}>{children}</span>;
}

function KVEditor({ pairs, onChange }: { pairs: KVPair[]; onChange: (p: KVPair[]) => void }) {
  const add = () => onChange([...pairs, { key: '', value: '' }]);
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'key' | 'value', val: string) => {
    const updated = pairs.map((p, idx) => idx === i ? { ...p, [field]: val } : p);
    onChange(updated);
  };

  return (
    <div>
      {pairs.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          <input style={{ ...input, marginBottom: 0, flex: 1 }} placeholder="Key" value={p.key} onChange={(e) => update(i, 'key', e.target.value)} />
          <input style={{ ...input, marginBottom: 0, flex: 1 }} placeholder="Value" value={p.value} onChange={(e) => update(i, 'value', e.target.value)} />
          <button onClick={() => remove(i)} style={{ padding: '0 8px', background: '#fee2e2', border: 'none', borderRadius: 4, cursor: 'pointer', color: '#dc2626', fontSize: 14 }}>×</button>
        </div>
      ))}
      <button onClick={add} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: '1px dashed #93c5fd', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', width: '100%' }}>
        + Add Field
      </button>
    </div>
  );
}

export default function ConfigPanel() {
  const { selectedNodeId, nodes, updateNodeConfig, deleteNode } = useWorkflowStore();
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  useEffect(() => {
    getAutomations().then(setAutomations);
  }, []);

  if (!selectedNode) {
    return (
      <div style={{ width: 260, padding: 20, borderLeft: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>Select a node to configure</p>
      </div>
    );
  }

  const { nodeType, config } = selectedNode.data;
  const upd = (patch: object) => updateNodeConfig(selectedNode.id, patch);

  const colorMap: Record<string, string> = { start: '#16a34a', task: '#2563eb', approval: '#ea580c', automation: '#7c3aed', end: '#dc2626' };
  const accent = colorMap[nodeType] || '#64748b';

  return (
    <div style={{ width: 260, borderLeft: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
        <div style={{ fontSize: 10, color: accent, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Configure</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginTop: 2, textTransform: 'capitalize' }}>{nodeType} Node</div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '14px 16px', overflowY: 'auto' }}>

        {nodeType === 'start' && (() => {
          const c = config as StartConfig;
          return <>
            <Label>Title</Label>
            <input style={input} placeholder="Workflow title" value={c.title || ''} onChange={(e) => upd({ title: e.target.value })} />
            <Label>Metadata</Label>
            <KVEditor pairs={c.metadata || []} onChange={(metadata) => upd({ metadata })} />
          </>;
        })()}

        {nodeType === 'task' && (() => {
          const c = config as TaskConfig;
          return <>
            <Label>Title *</Label>
            <input style={input} placeholder="Task name" value={c.title || ''} onChange={(e) => upd({ title: e.target.value })} />
            <Label>Description</Label>
            <textarea style={{ ...input, resize: 'vertical', minHeight: 60 }} placeholder="Task description" value={c.description || ''} onChange={(e) => upd({ description: e.target.value })} />
            <Label>Assignee</Label>
            <input style={input} placeholder="e.g. john@company.com" value={c.assignee || ''} onChange={(e) => upd({ assignee: e.target.value })} />
            <Label>Due Date</Label>
            <input style={input} type="date" value={c.dueDate || ''} onChange={(e) => upd({ dueDate: e.target.value })} />
            <Label>Custom Fields</Label>
            <KVEditor pairs={c.customFields || []} onChange={(customFields) => upd({ customFields })} />
          </>;
        })()}

        {nodeType === 'approval' && (() => {
          const c = config as ApprovalConfig;
          return <>
            <Label>Title</Label>
            <input style={input} placeholder="Approval title" value={c.title || ''} onChange={(e) => upd({ title: e.target.value })} />
            <Label>Approver Role</Label>
            <input style={input} placeholder="e.g. HR Manager" value={c.approverRole || ''} onChange={(e) => upd({ approverRole: e.target.value })} />
            <Label>Auto-Approve Threshold (%)</Label>
            <input style={input} type="number" min={0} max={100} placeholder="e.g. 80" value={c.autoApproveThreshold ?? ''} onChange={(e) => upd({ autoApproveThreshold: Number(e.target.value) })} />
          </>;
        })()}

        {nodeType === 'automation' && (() => {
          const c = config as AutomationConfig;
          const selected = automations.find((a) => a.id === c.actionId);
          return <>
            <Label>Title</Label>
            <input style={input} placeholder="Automation title" value={c.title || ''} onChange={(e) => upd({ title: e.target.value })} />
            <Label>Action</Label>
            <select style={{ ...input, cursor: 'pointer' }} value={c.actionId || ''} onChange={(e) => upd({ actionId: e.target.value, params: {} })}>
              <option value="">Select action...</option>
              {automations.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
            {selected && <>
              <Label>Parameters</Label>
              {selected.params.map((p) => (
                <div key={p}>
                  <Label>{p}</Label>
                  <input style={input} placeholder={p} value={(c.params || {})[p] || ''} onChange={(e) => upd({ params: { ...(c.params || {}), [p]: e.target.value } })} />
                </div>
              ))}
            </>}
          </>;
        })()}

        {nodeType === 'end' && (() => {
          const c = config as EndConfig;
          return <>
            <Label>End Message</Label>
            <input style={input} placeholder="e.g. Workflow complete!" value={c.message || ''} onChange={(e) => upd({ message: e.target.value })} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={c.showSummary || false} onChange={(e) => upd({ showSummary: e.target.checked })} />
              <span style={{ fontSize: 13, color: '#475569' }}>Show Summary</span>
            </label>
          </>;
        })()}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}>
        <button
          onClick={() => { if (confirm('Delete this node?')) deleteNode(selectedNode.id); }}
          style={{ width: '100%', padding: '8px 0', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}