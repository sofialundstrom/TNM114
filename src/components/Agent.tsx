import type { Agent as AgentType } from "../types/types";
import redAgent from "../assets/people/red_agent.png";
import explorerImage from "../assets/people/explorer.png";

type AgentProps = {
  agent: AgentType;
};

function Agent({ agent }: AgentProps) {
  const image = agent.role === "scout" ? explorerImage : redAgent;

  return (
    <img 
      src={image} 
      alt={`Agent ${agent.id}`} 
      className="agent" 
    />
  );
}

export default Agent;
