import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useRef, useCallback } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useWorkflow } from '../../hooks/useWorkflow';
import CustomNode from '../nodes/CustomNodes';

const nodeTypes: NodeTypes = { custom: CustomNode };

export default function WorkflowCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { selectedNodeId, setSelectedNode } = useWorkflowStore();
  const { nodes, edges } = useWorkflowStore();
  const { onNodesChange, onEdgesChange, onConnect, onDrop } = useWorkflow();

  const handleDrop = useCallback(
    (e: React.DragEvent) => onDrop(e, canvasRef.current),
    [onDrop]
  );

  const handlePaneClick = useCallback(() => {
    if (selectedNodeId) setSelectedNode(null);
  }, [selectedNodeId, setSelectedNode]);

  return (
    <div
      ref={canvasRef}
      style={{ flex: 1, height: '100%' }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        onPaneClick={handlePaneClick}
        deleteKeyCode="Delete"
        fitView
        defaultEdgeOptions={{ type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 2 } }}
      >
        <MiniMap nodeColor={(n) => {
          const map: Record<string, string> = { start: '#16a34a', task: '#2563eb', approval: '#ea580c', automation: '#7c3aed', end: '#dc2626' };
          return map[n.data?.nodeType] || '#94a3b8';
        }} />
        <Controls />
        <Background color="#e2e8f0" gap={20} />
      </ReactFlow>
    </div>
  );
}