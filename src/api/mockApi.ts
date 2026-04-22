import type { AutomationAction, SimulationResult } from '../types/workflow';
import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData } from '../types/workflow';

const AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create Ticket', params: ['project', 'title'] },
];

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(200);
  return AUTOMATIONS;
}

export async function simulateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Promise<SimulationResult> {
  await delay(600);

  const errors: string[] = [];
  const steps: SimulationResult['steps'] = [];

  const startNodes = nodes.filter((n) => n.data.nodeType === 'start');
  const endNodes = nodes.filter((n) => n.data.nodeType === 'end');

  if (startNodes.length !== 1) {
    errors.push('Workflow must have exactly one Start node.');
  }
  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one End node.');
  }

  // Cycle detection
  if (hasCycle(nodes, edges)) {
    errors.push('Cycle detected in workflow graph.');
  }

  if (errors.length > 0) {
    return { success: false, steps, errors };
  }

  // Traverse
  let currentId: string | null = startNodes[0].id;
  const visited = new Set<string>();

  while (currentId) {
    if (visited.has(currentId)) break;
    visited.add(currentId);

    const node = nodes.find((n) => n.id === currentId);
    if (!node) break;

    const config = node.data.config as Record<string, unknown>;
    const label = (config.title as string) || node.data.nodeType;

    steps.push({
      nodeId: node.id,
      nodeType: node.data.nodeType,
      label,
      status: 'success',
      message: getStepMessage(node.data.nodeType, config),
    });

    const out = edges.filter((e) => e.source === currentId);
    currentId = out.length > 0 ? out[0].target : null;
  }

  return { success: true, steps, errors: [] };
}

function getStepMessage(type: string, config: Record<string, unknown>): string {
  switch (type) {
    case 'start': return `Workflow started: ${config.title || 'Untitled'}`;
    case 'task': return `Task assigned to ${config.assignee || 'Unassigned'}`;
    case 'approval': return `Awaiting approval from ${config.approverRole || 'Role TBD'}`;
    case 'automation': return `Running automation: ${config.actionId || 'None selected'}`;
    case 'end': return config.message ? String(config.message) : 'Workflow completed.';
    default: return 'Processing...';
  }
}

function hasCycle(nodes: Node[], edges: Edge[]): boolean {
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => { adj[n.id] = []; });
  edges.forEach((e) => { adj[e.source]?.push(e.target); });

  const color: Record<string, 'white' | 'gray' | 'black'> = {};
  nodes.forEach((n) => { color[n.id] = 'white'; });

  function dfs(id: string): boolean {
    color[id] = 'gray';
    for (const nbr of adj[id] || []) {
      if (color[nbr] === 'gray') return true;
      if (color[nbr] === 'white' && dfs(nbr)) return true;
    }
    color[id] = 'black';
    return false;
  }

  return nodes.some((n) => color[n.id] === 'white' && dfs(n.id));
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}