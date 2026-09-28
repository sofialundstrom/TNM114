import type { Agent as AgentType } from "../types/types";

type AgentProps = {
  agent: AgentType;
};

function Agent({ agent }: AgentProps) {
  return <span className="agent">{agent.id}</span>;
}

export default Agent;
