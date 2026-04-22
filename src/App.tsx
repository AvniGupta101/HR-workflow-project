import WorkflowCanvas from "./components/canvas/WorkflowCanvas";
import Sidebar from "./components/sidebar/Sidebar";
import ConfigPanel from "./components/forms/ConfigPanel";
import { useWorkflowStore } from "./store/workflowStore";

function App() {
 const handleRun = () => {
  const { nodes, edges } = useWorkflowStore.getState();

  if (nodes.length === 0) {
    alert("No workflow created");
    return;
  }

  const startNodes = nodes.filter((n) => n.data.label === "start");
  const endNodes = nodes.filter((n) => n.data.label === "end");

  if (startNodes.length !== 1) {
    alert("There must be exactly ONE start node");
    return;
  }

  if (endNodes.length === 0) {
    alert("At least one END node required");
    return;
  }

  let current = startNodes[0].id;
  const visited = new Set();
  const steps = [];

  while (current) {
    if (visited.has(current)) {
      alert("Cycle detected in workflow!");
      return;
    }

    visited.add(current);

    const node = nodes.find((n) => n.id === current);
    if (!node) break;

    steps.push(node.data.label);

    const outgoingEdges = edges.filter((e) => e.source === current);

    if (outgoingEdges.length > 1) {
      alert("Branching not supported yet");
      return;
    }

    if (outgoingEdges.length === 0) break;

    current = outgoingEdges[0].target;
  }

  alert(
    steps.map((step, i) => `Step ${i + 1}: ${step}`).join("\n")
  );
};

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      
      {/* TOP BAR */}
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid gray",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h3>HR Workflow Designer</h3>
        <button onClick={handleRun}>Run Workflow</button>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <WorkflowCanvas />
        <ConfigPanel />
      </div>
    </div>
  );
}

export default App;