import { useState, useRef } from 'react';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import Sidebar from './components/sidebar/Sidebar';
import ConfigPanel from './components/forms/ConfigPanel';
import SimulationPanel from './components/simulation/SimulationPanel';
import { useWorkflow } from './hooks/useWorkflow';

export default function App() {
  const [showSim, setShowSim] = useState(false);
  const { exportWorkflow, importWorkflow } = useWorkflow();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* NAVBAR */}
      <div style={{ padding: '0 20px', height: 52, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>HR Workflow Designer</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => fileRef.current?.click()} style={ghostBtn}>Import</button>
          <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) importWorkflow(e.target.files[0]); e.target.value = ''; }} />
          <button onClick={exportWorkflow} style={ghostBtn}>Export JSON</button>
          <button onClick={() => setShowSim(true)} style={primaryBtn}>▶ Run Workflow</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <WorkflowCanvas />
        <ConfigPanel />
      </div>

      {showSim && <SimulationPanel onClose={() => setShowSim(false)} />}
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  padding: '6px 14px', background: '#fff', border: '1px solid #e2e8f0',
  borderRadius: 7, fontSize: 13, cursor: 'pointer', color: '#475569', fontWeight: 500,
};

const primaryBtn: React.CSSProperties = {
  padding: '7px 16px', background: '#2563eb', border: 'none',
  borderRadius: 7, fontSize: 13, cursor: 'pointer', color: '#fff', fontWeight: 600,
};