export type NodeType = 'start' | 'task' | 'approval' | 'automation' | 'end';

export interface KVPair {
  key: string;
  value: string;
}

export interface StartConfig {
  title?: string;
  metadata?: KVPair[];
}

export interface TaskConfig {
  title?: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: KVPair[];
}

export interface ApprovalConfig {
  title?: string;
  approverRole?: string;
  autoApproveThreshold?: number;
}

export interface AutomationConfig {
  title?: string;
  actionId?: string;
  params?: Record<string, string>;
}

export interface EndConfig {
  message?: string;
  showSummary?: boolean;
}

export type NodeConfig =
  | StartConfig
  | TaskConfig
  | ApprovalConfig
  | AutomationConfig
  | EndConfig;

export interface WorkflowNodeData {
  nodeType: NodeType;
  label?: string;
  config: NodeConfig;
}

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  status: 'success' | 'skipped' | 'error';
  message?: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
}

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}