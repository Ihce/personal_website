import { useEffect, useRef } from 'preact/hooks';
import * as joint from 'https://esm.sh/jointjs@3.7.7';

// Rosé Pine Theme
const colors = {
  base: "#232136",
  surface: "#2a273f",
  overlay: "#393552",
  text: "#e0def4",
  muted: "#6e6a86",
  accent: "#eb6f92", // Rosé Pine red
  iris: "#c4a7e7",
  pine: "#3e8fb0",
};

export default function JointJSComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPath = globalThis.location?.pathname ?? '/';

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new joint.dia.Graph();

    const paper = new joint.dia.Paper({
      el: containerRef.current,
      model: graph,
      width: containerRef.current.clientWidth || 800,
      height: 500,
      gridSize: 10,
      background: { color: "transparent" },
      interactive: (cellView) => cellView.model.isElement(), // blocks only
      linkPinning: false,
      defaultConnectionPoint: { name: 'boundary' },
      linkView: joint.dia.LinkView.extend({
        pointerdown: () => {},
        mouseover: () => {},
      }),
    });

    const makeBlock = (id: string, x: number, y: number, label: string) => {
      const isActive =
        currentPath === `/${id}` ||
        (id === 'home' && (currentPath === '/' || currentPath === ''));

      const block = new joint.shapes.standard.Rectangle({
        id,
        position: { x, y },
        size: { width: 160, height: 80 },
        attrs: {
          body: {
            fill: colors.surface,
            stroke: isActive ? colors.accent : colors.overlay,
            strokeWidth: 2,
            rx: 6,
            ry: 6,
            filter: isActive
              ? {
                  name: 'dropShadow',
                  args: {
                    dx: 0,
                    dy: 0,
                    blur: 10,
                    color: colors.accent,
                  },
                }
              : undefined,
          },
          label: {
            text: label,
            fill: isActive ? colors.accent : colors.text,
            fontSize: 10.5,
            fontFamily: 'JetBrains Mono, monospace',
          },
        },
      });

      block.addTo(graph);
      return block;
    };

    const connect = (from: string, to: string) => {
      const link = new joint.shapes.standard.Link();

      link.source({ id: from });
      link.target({ id: to });

      link.router('orthogonal');

      link.attr({
        line: {
          stroke: colors.accent,
          strokeWidth: 2,
          pointerEvents: 'none',
          targetMarker: {
            type: 'path',
            d: 'M 10 -5 0 0 10 5 z',
            fill: colors.accent,
          },
        },
      });

      // Fully disable interactivity and tools
      link.set('interactive', false);
      link.removeAttr(['tools']);

      graph.addCell(link);
    };

    try {
      const home = makeBlock("home", 320, 40, "lea eax, nav\ncall [home]");
      const about = makeBlock("about", 120, 200, "mov eax, about*me\njmp /about");
      const writeups = makeBlock("writeups", 320, 200, "cmp eax, blog*posts\njne /blog");
      const projects = makeBlock("projects", 520, 200, "mov eax, todo\njmp /future");

      connect("home", "about");
      connect("home", "writeups");
      connect("home", "projects");
    } catch (error) {
      console.error("Error creating graph:", error);
    }
  }, [currentPath]);

  return (
    <div
      ref={containerRef}
      className="w-full joint-paper joint-theme-default"
      style={{ height: "500px" }}
    />
  );
}
