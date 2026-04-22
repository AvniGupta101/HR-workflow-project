import { create } from "zustand";
import type { Node, Edge } from "reactflow";

type Store = {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNode: (id: string | null) => void;
  deleteNode: (id: string) => void;
};

export const useWorkflowStore = create<Store>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  deleteNode: (id) =>
  set((state) => ({
    nodes: state.nodes.filter((n) => n.id !== id),
    edges: state.edges.filter(
      (e) => e.source !== id && e.target !== id
    ),
  })),
}));