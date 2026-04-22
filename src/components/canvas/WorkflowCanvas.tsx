import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback } from "react";
import { useWorkflowStore } from "../../store/workflowStore";

export default function WorkflowCanvas() {
  const { nodes, edges, setNodes, setEdges, setSelectedNode } =
    useWorkflowStore();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, edges));
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges(addEdge(params, edges));
    },
    [edges, setEdges]
  );

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("application/reactflow");

    const newNode: Node = {
      id: `${Date.now()}`,
      type: "default",
      position: {
        x: event.clientX - 250,
        y: event.clientY,
      },
      data: { label: type },
    };

    setNodes([...nodes, newNode]);
  };

  return (
     <div
    style={{
      flex: 1,
      height: "100vh",
    }}
    onDrop={onDrop}
    onDragOver={(e) => e.preventDefault()}
  >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}