import { useSimulation } from '../../hooks/useSimulation';

export default function SimulationPanel({ onClose }: { onClose: () => void }) {
  const { result, loading, run, clear } = useSimulation();

  const statusColor = (s: string) => ({ success: '#16a34a', error: '#dc2626', skipped: '#94a3b8' }[s] || '#64748b');
  const typeIcon: Record<string, string> = { start: '▶', task: '✓', approval: '⚑', automation: '⚙', end: '■' };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: '#fff', borderRadius: 12, width: 520, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Workflow Simulation</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Test your workflow execution</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {!result && !loading && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
              <div style={{ fontSize: 14 }}>Click "Run Simulation" to execute your workflow</div>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
              <div style={{ fontSize: 14 }}>Running simulation...</div>
            </div>
          )}

          {result && (
            <div>
              {/* Validation errors */}
              {result.errors.length > 0 && (
                <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: '#dc2626', fontSize: 13, marginBottom: 8 }}>❌ Validation Errors</div>
                  {result.errors.map((e, i) => <div key={i} style={{ fontSize: 13, color: '#b91c1c', marginBottom: 4 }}>• {e}</div>)}
                </div>
              )}

              {/* Steps */}
              {result.steps.length > 0 && (
                <div>
                  <div style={{ fontWeight: 700, color: '#475569', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                    Execution Log ({result.steps.length} steps)
                  </div>
                  {result.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, borderLeft: `3px solid ${statusColor(step.status)}` }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: statusColor(step.status), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                        {typeIcon[step.nodeType] || '?'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>Step {i + 1}: {step.label}</span>
                          <span style={{ fontSize: 11, color: statusColor(step.status), fontWeight: 600, textTransform: 'uppercase' }}>{step.status}</span>
                        </div>
                        {step.message && <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{step.message}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.success && (
                <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px', marginTop: 8, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                  ✓ Simulation completed successfully
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
          <button onClick={run} disabled={loading} style={{ flex: 1, padding: '9px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 7, fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Running...' : '▶  Run Simulation'}
          </button>
          {result && <button onClick={clear} style={{ padding: '9px 14px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Clear</button>}
        </div>
      </div>
    </div>
  );
}