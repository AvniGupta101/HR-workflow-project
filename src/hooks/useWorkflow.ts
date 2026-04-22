import { useCallback } from 'react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
} from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';
import type { NodeType, WorkflowNodeData } from '../types/workflow';

const defaultConfigs: Record<NodeType, WorkflowNodeData['config']> = {
  start: { title: '', metadata: [] },
  task: { title: '', description: '', assignee: '', dueDate: '', customFields: [] },
  approval: { title: '', approverRole: '', autoApproveThreshold: 0 },
  automation: { title: '', actionId: '', params: {} },
  end: { message: '', showSummary: false },
};

export function useWorkflow() {
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes(applyNodeChanges(changes, nodes) as Node<WorkflowNodeData>[]),
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(applyEdgeChanges(changes, edges)),
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges(addEdge({ ...params, type: 'smoothstep' }, edges)),
    [edges, setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent, canvasRef: HTMLDivElement | null) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type || !canvasRef) return;

      const bounds = canvasRef.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 80,
        y: event.clientY - bounds.top - 20,
      };

      const newNode: Node<WorkflowNodeData> = {
        id: `${type}-${Date.now()}`,
        type: 'custom',
        position,
        data: {
          nodeType: type,
          config: { ...defaultConfigs[type] },
        },
      };

      setNodes([...nodes, newNode]);
    },
    [nodes, setNodes]
  );

  const exportWorkflow = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importWorkflow = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
        }
      } catch {
        alert('Invalid workflow file.');
      }
    };
    reader.readAsText(file);
  };

  return { onNodesChange, onEdgesChange, onConnect, onDrop, exportWorkflow, importWorkflow };
}