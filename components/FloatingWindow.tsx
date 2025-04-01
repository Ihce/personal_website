import { JSX } from "preact/jsx-runtime";
import { useEffect, useRef } from "preact/hooks";

interface FloatingWindowProps {
  title?: string;
  children: JSX.Element;
  onClose?: () => void;
}

export default function FloatingWindow({ title, children, onClose }: FloatingWindowProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-50 top-10 left-1/2 -translate-x-1/2 bg-base border border-overlay shadow-xl rounded-xl w-[90vw] max-w-4xl"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-overlay bg-overlay rounded-t-xl">
        <h3 className="text-sm font-semibold text-muted tracking-wide uppercase">
          {title ?? "Floating Window"}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            className="text-muted hover:text-accent transition focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 bg-base rounded-b-xl">
        {children}
      </div>
    </div>
  );
}
