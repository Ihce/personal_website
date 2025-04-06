// types.d.ts (create this file in your project root)

// Declare global type for highlight.js
declare global {
  interface Window {
    hljs: {
      highlightElement: (element: HTMLElement) => void;
      highlightAll: () => void;
      // Add other hljs methods you might use
    };
  }
}

export {};
