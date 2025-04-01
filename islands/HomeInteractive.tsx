import { useState } from "preact/hooks";
import FloatingWindow from "../components/FloatingWindow.tsx";
import JointJSComponent from "./JointJSComponent.tsx";

export default function HomeInteractive(props: { name: string }) {
  const [showCFG, setShowCFG] = useState(false);

  return (
    <>
      <div className="absolute top-0 right-0 p-2 flex items-center space-x-2">
        <button
          onClick={() => setShowCFG(true)}
          className="text-accent hover:text-accent/80 transition focus:outline-none"
          type="button"
          aria-label="Toggle CFG Viewer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <a href="/" className="flex items-center">
          <h2 className="text-[1.75rem] leading-none font-bold text-accent">
            {props.name}
          </h2>
        </a>
      </div>

      {showCFG && (
        <FloatingWindow title="CFG Viewer" onClose={() => setShowCFG(false)}>
          <JointJSComponent />
        </FloatingWindow>
      )}
    </>
  );
}
