import { useWorkflowStore } from "../../store/workflowStore";

export default function ConfigPanel() {
  const { selectedNodeId, nodes, setNodes, deleteNode } = useWorkflowStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div
        style={{
          width: 250,
          padding: 10,
          borderLeft: "1px solid gray",
          height: "100vh",
        }}
      >
        <p>Select a node</p>
      </div>
    );
  }

  const updateField = (key: string, value: any) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            config: {
              ...node.data.config,
              [key]: value,
            },
          },
        };
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    marginBottom: 10,
    padding: 6,
  };

  return (
    <div
      style={{
        width: 250,
        padding: 10,
        borderLeft: "1px solid gray",
        height: "100vh",
        overflowY: "auto", // 🔥 enables scrolling
      }}
    >
      <h3 style={{ marginBottom: 10 }}>
        {selectedNode.data.label.toUpperCase()} CONFIG
      </h3>

      {/* START */}
      {selectedNode.data.label === "start" && (
        <input
          style={inputStyle}
          placeholder="Title"
          onChange={(e) => updateField("title", e.target.value)}
        />
      )}

      {/* TASK */}
      {selectedNode.data.label === "task" && (
        <>
          <input
            style={inputStyle}
            placeholder="Title"
            onChange={(e) => updateField("title", e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Assignee"
            onChange={(e) => updateField("assignee", e.target.value)}
          />
        </>
      )}

      {/* APPROVAL */}
      {selectedNode.data.label === "approval" && (
        <>
          <input
            style={inputStyle}
            placeholder="Role"
            onChange={(e) => updateField("role", e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Threshold"
            onChange={(e) => updateField("threshold", e.target.value)}
          />
        </>
      )}

      {/* AUTOMATION */}
      {selectedNode.data.label === "automation" && (
        <input
          style={inputStyle}
          placeholder="Action"
          onChange={(e) => updateField("action", e.target.value)}
        />
      )}

      {/* END */}
      {selectedNode.data.label === "end" && (
        <input
          style={inputStyle}
          placeholder="Message"
          onChange={(e) => updateField("message", e.target.value)}
        />
      )}

      {/* Divider */}
      <hr style={{ margin: "15px 0" }} />

      {/* DELETE BUTTON */}
      <button
        onClick={() => {
          if (confirm("Delete this node?")) {
            deleteNode(selectedNode.id);
          }
        }}
        style={{
          padding: "10px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Delete Node
      </button>
    </div>
  );
}