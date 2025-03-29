import { useEffect, useRef, useState } from 'preact/hooks';
import * as joint from 'https://esm.sh/jointjs@3.7.7';

const colors = {
  base: "#232136",
  surface: "#2a273f",
  overlay: "#393552",
  text: "#e0def4",
  muted: "#6e6a86",
  accent: "#eb6f92",
  iris: "#c4a7e7",
  pine: "#3e8fb0",
};

// Define a custom shape with cursor pointer on all parts
const HeaderedBlock = joint.dia.Element.define('custom.HeaderedBlock', {
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      fill: colors.surface,
      stroke: colors.overlay,
      strokeWidth: 2,
      rx: 6,
      ry: 6,
      cursor: 'pointer',
    },
    header: {
      refWidth: '100%',
      height: 24,
      fill: colors.overlay,
      stroke: colors.overlay,
      strokeWidth: 2,
      rx: 6,
      ry: 6,
      cursor: 'pointer',
    },
    headerLabel: {
      refX: '50%',
      refY: 12,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      fontSize: 10,
      fontFamily: 'JetBrains Mono, monospace',
      fill: colors.text,
      cursor: 'pointer',
    },
    bodyLabel: {
      refX: '50%',
      refY: 50,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      fontSize: 11,
      fontFamily: 'JetBrains Mono, monospace',
      fill: colors.text,
      cursor: 'pointer',
    },
  },
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'rect', selector: 'header' },
    { tagName: 'text', selector: 'headerLabel' },
    { tagName: 'text', selector: 'bodyLabel' },
  ],
});

export default function JointJSComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPath = globalThis.location?.pathname ?? '/';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const scaleFactor = 1.15;
    const paperWidth = containerRef.current.clientWidth || 800;
    const paperHeight = 500;

    const graph = new joint.dia.Graph();

    const paper = new joint.dia.Paper({
      el: containerRef.current,
      model: graph,
      width: paperWidth,
      height: paperHeight,
      gridSize: 10,
      background: { color: "transparent" },
      linkPinning: false,
      defaultConnectionPoint: { name: 'boundary' },
      interactive: (cellView) => {
        if (cellView.model.isElement()) {
          return {
            elementMove: false,
            vertexAdd: false,
            vertexMove: false,
            arrowheadMove: false,
            labelMove: false,
            useLinkTools: false,
          };
        }
        return false;
      },
      linkView: joint.dia.LinkView.extend({
        pointerdown: () => {},
        mouseover: () => {},
      }),
    });

    const makeBlock = (
      id: string,
      x: number,
      y: number,
      headerText: string,
      bodyAsm: string
    ) => {
      const isActive =
        currentPath === `/${id}` ||
        (id === 'home' && (currentPath === '/' || currentPath === ''));
      const block = new HeaderedBlock({
        id,
        position: { x, y },
        size: { width: 160, height: 80 },
        attrs: {
          body: {
            stroke: isActive ? colors.accent : colors.overlay,
          },
          header: {
            fill: colors.overlay,
            stroke: isActive ? colors.accent : colors.overlay,
            strokeWidth: 2,
          },
          headerLabel: {
            text: headerText,
            fill: isActive ? colors.accent : colors.text,
          },
          bodyLabel: {
            text: bodyAsm,
            fill: colors.text,
            fontSize: 11,
          },
        },
      });
      block.addTo(graph);
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
      link.set('interactive', false);
      link.removeAttr(['tools']);
      graph.addCell(link);
    };

    try {
      // Create blocks
      makeBlock("home", 320, 40, "Home", "lea eax, nav\ncall [home]");
      makeBlock("about", 120, 200, "About", "mov eax, about*me\njmp /about");
      makeBlock("writeups", 320, 200, "Writeups", "cmp eax, blog*posts\njne /blog");
      makeBlock("projects", 520, 200, "Projects", "mov eax, todo\njmp /future");

      // Connect blocks
      connect("home", "about");
      connect("home", "writeups");
      connect("home", "projects");

      // Scale the graph
      paper.scale(scaleFactor, scaleFactor);

      // Style the paper container
      const paperElement = paper.el as HTMLDivElement;
      paperElement.style.border = '5px solid #eb6f92';
      paperElement.style.borderRadius = '10px';

      // Center the content accounting for scaling
      const maybeBBox = graph.getBBox();
      const paperSize = paper.getComputedSize();

      if (maybeBBox) {
        const scaledBBox = {
          x: maybeBBox.x * scaleFactor,
          y: maybeBBox.y * scaleFactor,
          width: maybeBBox.width * scaleFactor,
          height: maybeBBox.height * scaleFactor,
        };
        const offsetX = (paperSize.width - scaledBBox.width) / 2 - scaledBBox.x;
        const offsetY = (paperSize.height - scaledBBox.height) / 2 - scaledBBox.y;
        paper.setOrigin(offsetX, offsetY);
      }
    } catch (error) {
      console.error("Error creating graph:", error);
    } finally {
      // Mark graph as loaded so that the spinner is hidden
      setLoading(false);
    }

    // Add click event to navigate when a node is clicked
    paper.on('cell:pointerclick', (cellView, evt) => {
      const cell = cellView.model;
      if (cell.isElement()) {
        const id = cell.id;
        window.location.href = id === 'home' ? '/' : `/${id}`;
      }
    });
  }, [currentPath]);

  return (
    <div className="relative" style={{ height: "500px", width: "100%" }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-base z-50">
          <div
            className="animate-spin rounded-full"
            style={{
              width: "4rem",
              height: "4rem",
              border: "4px solid #393552",
              borderTopColor: "#eb6f92",
            }}
          />
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full joint-paper joint-theme-default"
        style={{ height: "500px" }}
      />
    </div>
  );
}
