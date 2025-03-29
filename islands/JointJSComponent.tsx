import { useEffect, useRef } from 'preact/hooks';
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

// 🧱 Define a custom shape with body, header, headerLabel, and bodyLabel
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
    },
    header: {
      refWidth: '100%',
      height: 24,
      fill: colors.overlay,
      stroke: colors.overlay,  // Default stroke color
      strokeWidth: 2, // Stroke width for the header
      rx: 6,
      ry: 6,
    },
    headerLabel: {
      refX: '50%',
      refY: 12,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      fontSize: 10,
      fontFamily: 'JetBrains Mono, monospace',
      fill: colors.text,
    },
    bodyLabel: {
      refX: '50%',
      refY: 50,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      fontSize: 11,  // Slightly larger bottom text
      fontFamily: 'JetBrains Mono, monospace',
      fill: colors.text,
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

  useEffect(() => {
    if (!containerRef.current) return;

    const margin = 10;
    const scaleFactor = 1.15; // Scale the entire graph by 15%
    const paperWidth = (containerRef.current.clientWidth || 800) * scaleFactor;
    const paperHeight = 500 * scaleFactor;

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
        position: { x: x * scaleFactor, y: y * scaleFactor },  // Scale position
        size: { width: 160 * scaleFactor, height: 80 * scaleFactor }, // Scale size
        attrs: {
          body: {
            stroke: isActive ? colors.accent : colors.overlay,
          },
          header: {
            fill: colors.overlay,
            stroke: isActive ? colors.accent : colors.overlay, // Added stroke for header
            strokeWidth: 2,
          },
          headerLabel: {
            text: headerText,
            fill: isActive ? colors.accent : colors.text,
          },
          bodyLabel: {
            text: bodyAsm,
            fill: colors.text,
            fontSize: 11, // Slightly larger bottom text
          },
        },
      });

      block.addTo(graph);

      paper.once('render:done', () => {
        const blockView = paper.findViewByModel(block);
        if (!blockView) return;

        blockView.el.style.cursor = 'pointer';

        blockView.on('element:pointerclick', () => {
          globalThis.location.href = `/${id}`;
        });

        blockView.on('mouseenter', () => {
          block.attr('body/filter', {
            name: 'dropShadow',
            args: {
              dx: 0,
              dy: 0,
              blur: 12,
              color: colors.iris,
            },
          });
        });

        blockView.on('mouseleave', () => {
          block.removeAttr('body/filter');
        });
      });

      block.transition('attrs/body/opacity', {
        value: 1,
        duration: 300,
      });
      block.transition('attrs/headerLabel/opacity', {
        value: 1,
        duration: 300,
        delay: 100,
      });
      block.transition('attrs/bodyLabel/opacity', {
        value: 1,
        duration: 300,
        delay: 150,
      });
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
      makeBlock("home", 320, 40, "Home", "lea eax, nav\ncall [home]");
      makeBlock("about", 120, 200, "About", "mov eax, about*me\njmp /about");
      makeBlock("writeups", 320, 200, "Writeups", "cmp eax, blog*posts\njne /blog");
      makeBlock("projects", 520, 200, "Projects", "mov eax, todo\njmp /future");

      connect("home", "about");
      connect("home", "writeups");
      connect("home", "projects");

      const maybeBBox = graph.getBBox();
      if (maybeBBox) {
        const paperSize = paper.getComputedSize();
        const offsetX = (paperSize.width - maybeBBox.width) / 2 - maybeBBox.x;
        const offsetY = (paperSize.height - maybeBBox.height) / 2 - maybeBBox.y;

        // ✅ Re-center the graph after scaling
        paper.setOrigin(offsetX, offsetY);
      }
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
