// islands/CodeHighlight.tsx
import { useEffect } from "preact/hooks";

/**
 * A client-side island component that applies syntax highlighting 
 * to code blocks after the component mounts
 */
export default function CodeHighlight() {
  useEffect(() => {
    // This will only run in the browser
    console.log("CodeHighlight component mounted");
    
    // Add a small delay to ensure scripts are loaded
    setTimeout(() => {
      console.log("Attempting to initialize syntax highlighting after delay");
      if (typeof globalThis !== "undefined") {
      const hljs = (globalThis as Record<string, any>)["hljs"];
      
      if (hljs) {
        console.log("Highlight.js found", hljs);
        
        try {
          // Try to use highlightAll first (simpler approach)
          if (typeof hljs.highlightAll === "function") {
            console.log("Using hljs.highlightAll()");
            hljs.highlightAll();
          } 
          // Fallback to manual highlighting
          else if (typeof hljs.highlightElement === "function") {
            console.log("Using hljs.highlightElement() for each block");
            const codeBlocks = document.querySelectorAll('pre code');
            console.log(`Found ${codeBlocks.length} code blocks`);
            
            codeBlocks.forEach((block, index) => {
              console.log(`Highlighting block ${index}, classes: ${(block as HTMLElement).className}`);
              try {
                hljs.highlightElement(block as HTMLElement);
              } catch (e) {
                console.error(`Error highlighting block ${index}:`, e);
              }
            });
          } else {
            console.error("No highlighting method found on hljs object");
          }
        } catch (error) {
          console.error("Error applying syntax highlighting:", error);
        }
      } else {
        console.error("Highlight.js not found in globalThis");
        
        // Try to detect if the script is loaded but not available yet
        const scripts = document.querySelectorAll('script');
        let highlightJsFound = false;
        
        scripts.forEach(script => {
          if (script.src && script.src.includes('highlight.js')) {
            highlightJsFound = true;
            console.log("Found highlight.js script:", script.src);
          }
        });
        
        if (highlightJsFound) {
          console.log("Script found but hljs not available - may need to wait for it to load");
        } else {
          console.error("No highlight.js script found in the document");
        }
      }
    }
    }, 100); // 100ms delay to ensure scripts are loaded
  }, []);

  return null;
}