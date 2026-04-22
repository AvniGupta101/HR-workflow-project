import { useEffect, useRef, useState } from 'react';
import { useSimulation } from '../../hooks/useSimulation';
import type { SimulationStep } from '../../types/workflow';

const NODE_META: Record<string, { icon: string; color: string; bg: string }> = {
  start:      { icon: '▶', color: '#10b981', bg: '#d1fae5' },
  task:       { icon: '✓', color: '#3b82f6', bg: '#dbeafe' },
  approval:   { icon: '⚑', color: '#f59e0b', bg: '#fef3c7' },
  automation: { icon: '⚙', color: '#8b5cf6', bg: '#ede9fe' },
  end:        { icon: '■', color: '#ef4444', bg: '#fee2e2' },
};

function StepRow({ step, index, visible }: { step: SimulationStep; index: number; visible: boolean }) {
  const meta = NODE_META[step.nodeType] || { icon: '?', color: '#64748b', bg: '#f1f5f9' };
  const isSuccess = step.status === 'success';

  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        padding: '12px 16px',
        background: '#fff',
        borderRadius: 10,
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.35s ease ${index * 80}ms, transform 0.35s ease ${index * 80}ms`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: isSuccess ? meta.color : '#ef4444', borderRadius: '10px 0 0 10px' }} />

      {/* Step number */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingLeft: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: meta.bg, border: `2px solid ${meta.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: meta.color, fontWeight: 700, flexShrink: 0 }}>
          {meta.icon}
        </div>
        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>#{index + 1}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: 0.8, background: meta.bg, padding: '2px 7px', borderRadius: 20 }}>
              {step.nodeType}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {step.label}
            </span>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6,
            color: isSuccess ? '#10b981' : '#ef4444',
            background: isSuccess ? '#d1fae5' : '#fee2e2',
            padding: '2px 8px', borderRadius: 20, flexShrink: 0,
          }}>
            {step.status}
          </span>
        </div>
        {step.message && (
          <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{step.message}</p>
        )}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: 16 }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#64748b', fontSize: 14, margin: 0, fontWeight: 500 }}>Executing workflow...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function SandboxPanel({ onClose }: { onClose: () => void }) {
  const { result, loading, run, clear } = useSimulation();
  const [stepsVisible, setStepsVisible] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result?.steps?.length) {
      setStepsVisible(false);
      setTimeout(() => setStepsVisible(true), 50);
    }
  }, [result]);

  // Auto-run on open
  useEffect(() => { run(); }, []);

  const hasErrors = result && result.errors.length > 0;
  const hasSteps = result && result.steps.length > 0;
  const isEmpty = !loading && !result;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 999, backdropFilter: 'blur(2px)' }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 1000,
        width: 480, background: '#f8fafc',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.25s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        `}</style>

        {/* Header */}
        <div style={{ padding: '20px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: loading ? '#f59e0b' : result?.success ? '#10b981' : result ? '#ef4444' : '#94a3b8', animation: loading ? 'pulse 1s ease-in-out infinite' : 'none' }} />
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>Workflow Simulation</h2>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                {loading ? 'Running execution...' : result?.success ? `Completed · ${result.steps.length} steps` : result ? `Failed · ${result.errors.length} error(s)` : 'Ready to run'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 16, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
            >×</button>
          </div>

          {/* Status bar */}
          {result && (
            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: result.success ? '#f0fdf4' : '#fef2f2', border: `1px solid ${result.success ? '#bbf7d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>{result.success ? '✅' : '❌'}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: result.success ? '#15803d' : '#dc2626' }}>
                  {result.success ? 'Execution Successful' : 'Execution Failed'}
                </div>
                <div style={{ fontSize: 11, color: result.success ? '#166534' : '#b91c1c' }}>
                  {result.success ? `All ${result.steps.length} nodes executed without errors` : `${result.errors.length} validation error(s) found`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {loading && <LoadingSpinner />}

          {isEmpty && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16, color: '#94a3b8' }}>
              <div style={{ fontSize: 48, opacity: 0.3 }}>⚡</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: '#475569' }}>No workflow to execute</p>
                <p style={{ fontSize: 12, margin: 0 }}>Add nodes to the canvas and connect them, then run the simulation.</p>
              </div>
            </div>
          )}

          {/* Errors Section */}
          {hasErrors && (
            <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(239,68,68,0.1)' }}>
              <div style={{ padding: '10px 16px', background: '#fef2f2', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Validation Errors ({result!.errors.length})
                </span>
              </div>
              <div style={{ padding: '10px 16px' }}>
                {result!.errors.map((err, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < result!.errors.length - 1 ? 8 : 0, fontSize: 13, color: '#b91c1c' }}>
                    <span style={{ flexShrink: 0, marginTop: 1 }}>•</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps Section */}
          {hasSteps && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Execution Log
                </span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{result!.steps.length} steps</span>
              </div>

              {/* Timeline connector */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 29, top: 30, bottom: 30, width: 2, background: 'linear-gradient(to bottom, #e2e8f0, transparent)', zIndex: 0, pointerEvents: 'none' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result!.steps.map((step, i) => (
                    <StepRow key={step.nodeId} step={step} index={i} visible={stepsVisible} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', background: '#fff', display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => { clear(); run(); }}
            disabled={loading}
            style={{
              flex: 1, padding: '10px 0',
              background: loading ? '#93c5fd' : '#2563eb',
              color: '#fff', border: 'none', borderRadius: 8,
              fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s', letterSpacing: 0.3,
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#1d4ed8'; }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#2563eb'; }}
          >
            {loading ? '⏳  Running...' : '▶  Re-run Simulation'}
          </button>
          {result && (
            <button
              onClick={clear}
              style={{ padding: '10px 16px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </>
  );
}
