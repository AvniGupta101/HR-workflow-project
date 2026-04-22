import { useState } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { simulateWorkflow } from '../api/mockApi';
import type { SimulationResult } from '../types/workflow';

export function useSimulation() {
  const { nodes, edges } = useWorkflowStore();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await simulateWorkflow(nodes, edges);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => setResult(null);

  return { result, loading, run, clear };
}