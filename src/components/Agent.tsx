import type { Agent as AgentType } from "../types/types";
import redAgent from "../assets/agents/red_agent.png";

type AgentProps = {
  agent: AgentType;
};

function Agent({ agent }: AgentProps) {
  return <img src={redAgent} alt={`Agent ${agent.id}`} className="agent" />;
}

export default Agent;
