const nodeTypes = ["start", "task", "approval", "automation", "end"];

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-60 p-4 border-r bg-gray-50">
      <h2 className="font-bold mb-4">Nodes</h2>

      {nodeTypes.map((type) => (
        <div
          key={type}
          draggable
          onDragStart={(e) => onDragStart(e, type)}
          className="p-3 mb-2 bg-white rounded shadow cursor-grab hover:bg-gray-100"
        >
          {type.toUpperCase()}
        </div>
      ))}
    </div>
  );
}