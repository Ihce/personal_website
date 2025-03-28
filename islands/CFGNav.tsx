const nodes = [
    {
      id: "home",
      label: ["lea eax, nav", "call [home]"],
      href: "/",
    },
    {
      id: "about",
      label: ["mov eax, about_me", "jmp /about"],
      href: "/about",
    },
    {
      id: "blog",
      label: ["cmp eax, blog_posts", "jne /blog"],
      href: "/blog",
    },
    {
      id: "future",
      label: ["mov eax, todo", "jmp /future"],
      href: "/future",
    },
  ];
  
  const edges = [
    { from: "home", to: "about" },
    { from: "home", to: "blog" },
    { from: "home", to: "future" },
  ];
  
  const colors = {
    surface: "#2a273f",
    overlay: "#393552",
    text: "#e0def4",
    muted: "#6e6a86",
    iris: "#c4a7e7",
  };
  
  const nodePositions: Record<string, { x: number; y: number }> = {
    home: { x: 600, y: 50 },    // Centered horizontally
    about: { x: 400, y: 200 },  // Spread out more evenly
    blog: { x: 600, y: 200 },   // Centered
    future: { x: 800, y: 200 }, // Spread out more evenly
  };
  
  export default function CFGNav() {
    return (
      <div className="flex justify-center w-full px-4">
        <svg
          viewBox="0 0 1200 350"
          width="100%" 
          height="auto"
          style={{
            fontFamily: "monospace",
            maxWidth: "1200px",
          }}
        >
          {/* Arrowhead marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={colors.iris} />
            </marker>
          </defs>
  
          {/* Edges */}
          {edges.map((edge) => {
            const from = nodePositions[edge.from];
            const to = nodePositions[edge.to];
  
            const startY = from.y + 40;
            const endY = to.y - 40;
            const midY = (startY + endY) / 2;
  
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={`
                  M ${from.x} ${startY}
                  L ${from.x} ${midY}
                  L ${to.x} ${midY}
                  L ${to.x} ${endY}
                `}
                stroke={colors.muted}
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
  
          {/* Nodes */}
          {nodes.map((node) => {
            const pos = nodePositions[node.id];
            const longestLine = node.label.reduce(
              (max, line) => (line.length > max.length ? line : max),
              ""
            );
            const charWidth = 7.5;
            const padding = 24;
            const width = Math.max(
              120,
              longestLine.length * charWidth + padding
            );
            const x = -width / 2;
            const height = 80;
  
            return (
              <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                {/* Clickable area */}
                <a href={node.href}>
                  <rect
                    x={x}
                    y={-height / 2}
                    width={width}
                    height={height}
                    fill="transparent"
                  />
                </a>
  
                {/* Block */}
                <rect
                  x={x}
                  y={-height / 2}
                  width={width}
                  height={height}
                  rx={6}
                  ry={6}
                  fill={colors.surface}
                  stroke={colors.overlay}
                  strokeWidth="1.5"
                />
  
                {/* Top bar */}
                <rect
                  x={x}
                  y={-height / 2}
                  width={width}
                  height={14}
                  fill={colors.overlay}
                />
  
                {/* Text lines */}
                {node.label.map((line, i) => (
                  <text
                    key={i}
                    x={-(line.length * charWidth) / 2}
                    y={-14 + i * 18}
                    fontSize="12"
                    textAnchor="start"
                    fill={colors.text}
                    dominantBaseline="middle"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }