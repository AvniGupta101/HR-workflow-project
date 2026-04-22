import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData } from '../types/workflow';

export interface ValidationError {
  nodeId?: string;
  message: string;
}

export function validateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  const starts = nodes.filter((n) => n.data.nodeType === 'start');
  const ends = nodes.filter((n) => n.data.nodeType === 'end');

  if (starts.length === 0) errors.push({ message: 'Missing Start node.' });
  if (starts.length > 1) errors.push({ message: 'Only one Start node allowed.' });
  if (ends.length === 0) errors.push({ message: 'Missing End node.' });

  // Disconnected nodes
  nodes.forEach((n) => {
    const hasConnection =
      edges.some((e) => e.source === n.id || e.target === n.id);
    if (!hasConnection && nodes.length > 1) {
      errors.push({ nodeId: n.id, message: `Node "${n.data.nodeType}" is disconnected.` });
    }
  });

  return errors;
}