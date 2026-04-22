import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData } from '../types/workflow';

interface WorkflowStore {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  errorNodeIds: Set<string>;

  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNode: (id: string | null) => void;
  deleteNode: (id: string) => void;
  updateNodeConfig: (id: string, config: Partial<WorkflowNodeData['config']>) => void;
  setErrorNodeIds: (ids: Set<string>) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  errorNodeIds: new Set(),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNode: (id) => set({ selectedNodeId: id }),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  updateNodeConfig: (id, patch) => {
    const nodes = get().nodes.map((n) => {
      if (n.id !== id) return n;
      return {
        ...n,
        data: {
          ...n.data,
          config: { ...n.data.config, ...patch },
        },
      };
    });
    set({ nodes });
  },

  setErrorNodeIds: (ids) => set({ errorNodeIds: ids }),
}));