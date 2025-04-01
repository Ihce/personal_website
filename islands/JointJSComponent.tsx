import { useEffect, useRef, useState } from "preact/hooks";
import * as joint from "https://esm.sh/jointjs@3.7.7";

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

// Completely revised the tspan approach
const createBlockMarkup = (lineCount: number): any[] => {
  // Create an array of text elements instead of tspans
  const textElements = Array.from({ length: lineCount }, (_, i) => ({
    tagName: "text",
    selector: `line${i + 1}`,
  }));

  return [
    { tagName: "rect", selector: "body" },
    { tagName: "rect", selector: "header" },
    { tagName: "text", selector: "headerLabel" },
    ...textElements
  ];
};

const HeaderedBlock = joint.dia.Element.define("custom.HeaderedBlock", {
  attrs: {},
  markup: [],
});

export default function JointJSComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPath = globalThis.location?.pathname ?? "/";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const scaleFactor = 1.15;
    const paperWidth = containerRef.current!.clientWidth || 800;
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
      defaultConnectionPoint: { name: "boundary" },
      interactive: (cellView: joint.dia.CellView) => {
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
      bodyAsm: string,
    ) => {
      const isActive = currentPath === `/${id}` || (id === "home" && (currentPath === "/" || currentPath === ""));
      const lines = bodyAsm.split("\n").filter(Boolean);
      
      // Calculate the block height based on the number of lines
      const lineHeight = 18; // Height per line of text
      const headerHeight = 24;
      const paddingTop = 10; // Space after header before text starts
      const paddingBottom = 12; // Space after last line
      const totalHeight = headerHeight + paddingTop + (lines.length * lineHeight) + paddingBottom;

      const highlightedLines = lines.map((line: string) => {
        if (line.includes("'writeups'")) return { text: line, fill: colors.iris };
        if (line.includes("'about'")) return { text: line, fill: colors.pine };
        if (line.includes("'projects'")) return { text: line, fill: colors.accent };
        return { text: line, fill: colors.text };
      });

      // Create attributes for each line
      const lineAttrs: Record<string, any> = {};
      highlightedLines.forEach((line, i) => {
        lineAttrs[`line${i + 1}`] = {
          text: line.text,
          fill: line.fill,
          textAnchor: "start",
          textVerticalAnchor: "middle",
          fontSize: 11,
          fontFamily: "JetBrains Mono, monospace",
          x: 12,
          y: headerHeight + paddingTop + (i * lineHeight),
          cursor: "pointer",
        };
      });

      const block = new HeaderedBlock({
        id,
        position: { x, y },
        size: { width: 220, height: totalHeight },
        markup: createBlockMarkup(lines.length),
        attrs: {
          body: {
            refWidth: "100%",
            refHeight: "100%",
            fill: colors.surface,
            stroke: isActive ? colors.accent : colors.overlay,
            strokeWidth: 2,
            rx: 6,
            ry: 6,
            cursor: "pointer",
          },
          header: {
            refWidth: "100%",
            height: headerHeight,
            fill: colors.overlay,
            stroke: isActive ? colors.accent : colors.overlay,
            strokeWidth: 2,
            rx: 6,
            ry: 6,
            cursor: "pointer",
          },
          headerLabel: {
            refX: 12,
            refY: headerHeight / 2,
            textAnchor: "start",
            textVerticalAnchor: "middle",
            fontSize: 10,
            fontFamily: "JetBrains Mono, monospace",
            fill: isActive ? colors.accent : colors.text,
            cursor: "pointer",
            text: headerText,
          },
          ...lineAttrs
        },
      });

      block.addTo(graph);
    };

    const connect = (from: string, to: string) => {
      const link = new joint.shapes.standard.Link();
      link.source({ id: from });
      link.target({ id: to });
      link.router("orthogonal");
      link.attr({
        line: {
          stroke: colors.accent,
          strokeWidth: 2,
          pointerEvents: "none",
          targetMarker: {
            type: "path",
            d: "M 10 -5 0 0 10 5 z",
            fill: colors.accent,
          },
        },
      });
      link.set("interactive", false);
      link.removeAttr(["tools"]);
      graph.addCell(link);
    };

    try {
      // Increased spacing between boxes both horizontally and vertically
      
      // Home box positioned higher up
      makeBlock(
        "home",
        320,
        20,  // Moved up from 40
        "0x08048000 (Home)",
        "xor eax, eax\nmov al, [current_selection]\ncmp al, 3\njae default_page\njmp [jump_table + eax*4]"
      );

      // Increased vertical spacing from home to second row (from 200 to 240)
      // Increased horizontal spacing between boxes (wider spread)
      makeBlock(
        "about",
        80,   // Further left from 120
        240,  // Further down from 200
        "0x08048100 (About)",
        "push ebp\nmov ebp, esp\npush 'about'\ncall render_page\nadd esp, 4\nret"
      );

      makeBlock(
        "writeups",
        320,  // Center position maintained
        240,  // Further down from 200
        "0x08048200 (Writeups)",
        "push ebp\nmov ebp, esp\npush 'writeups'\ncall render_page\nadd esp, 4\nret"
      );

      makeBlock(
        "projects",
        560,  // Further right from 520
        240,  // Further down from 200
        "0x08048300 (Projects)",
        "push ebp\nmov ebp, esp\npush 'projects'\ncall render_page\nadd esp, 4\nret"
      );

      connect("home", "about");
      connect("home", "writeups");
      connect("home", "projects");

      paper.scale(scaleFactor, scaleFactor);

      const paperElement = paper.el as HTMLDivElement;
      // paperElement.style.border = "5px solid #eb6f92";
      // paperElement.style.borderRadius = "10px";

      // Center the graph content
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
      setLoading(false);
    }

    paper.on("cell:pointerclick", (cellView) => {
      const cell = cellView.model;
      if (cell.isElement()) {
        const id = cell.id;
        globalThis.location.href = id === "home" ? "/" : `/${id}`;
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