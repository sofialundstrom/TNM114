import type { ReactNode } from "react";
import redAgent from "../assets/people/red_agent.png";
import explorer from "../assets/people/explorer.png";

type Row = {
  icon: ReactNode;
  name: string;
  text: string;
  extra: string;
};

type Group = {
  title: string;
  rows: Row[];
};

const groups: Group[] = [
  
  {
    title: "Agents",
    rows: [
      {
        icon: (
          <img src={redAgent} alt="Clue agent" className="legend-icon legend-agent" />
        ),
        name: "Clue agent",
        text: "Follows the clue and searches the areas with the highest probability.",
        extra: "Focus: the area the clue points to",
      },
      {
        icon: (
          <img src={explorer} alt="Scout" className="legend-icon legend-agent" />
        ),
        name: "Scout",
        text: "Explores less likely areas close to the highly likely areas.",
        extra: "Focus: the surrounding area",
      },
    ],
  },

  {
    title: "Map symbols",
    rows: [
      {
        icon: <div className="legend-icon legend-target">×</div>,
        name: "Target",
        text: "The person the agents are trying to find.",
        extra: "Placed randomly on land",
      },
      {
        icon: <div className="legend-icon urban searched" />,
        name: "Searched cell",
        text: "A cell that has already been searched by an agent.",
        extra: "Is not searched again",
      },
    ],
  },

  {
    title: "Terrain",
    rows: [
      {
        icon: <div className="legend-icon forest" />,
        name: "Forest",
        text: "Dense forest.",
        extra: "Movement: 3 steps per tile",
      },
      {
        icon: <div className="legend-icon park" />,
        name: "Park",
        text: "Open park.",
        extra: "Movement: 2 steps per tile",
      },
      {
        icon: <div className="legend-icon urban" />,
        name: "Urban",
        text: "Built-up area.",
        extra: "Movement: 2 steps per tile",
      },
      {
        icon: <div className="legend-icon field" />,
        name: "Field",
        text: "Open field.",
        extra: "Movement: 1 step per tile",
      },
      {
        icon: <div className="legend-icon water" />,
        name: "Water",
        text: "Cannot be crossed. Agents walk around it.",
        extra: "Movement: blocked",
      },
    ],
  },
];

function Legend() {
  return (
    <div className="legend">
      <h2>Legend</h2>
      <table className="legend-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Description</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <>
              <tr className="legend-group" key={group.title}>
                <td colSpan={4}>{group.title}</td>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.name}>
                  <td>{row.icon}</td>
                  <td className="legend-name">{row.name}</td>
                  <td>{row.text}</td>
                  <td>{row.extra}</td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Legend;