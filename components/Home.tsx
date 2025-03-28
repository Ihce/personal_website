import NameCycle from "../islands/NameCycle.tsx";
import CFGNav from "../islands/CFGNav.tsx";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-base px-4 py-12">
      {/* Name Cycle */}
      <div className="w-full text-center overflow-hidden whitespace-nowrap">
        <h1 className="text-5xl sm:text-6xl font-bold text-accent">
          <NameCycle />
        </h1>
      </div>
      
      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-muted text-center mt-4">
        Reverse engineering, CTFs, binaries, and breaking stuff.
      </p>
      
      {/* CFG Graph */}
      <div className="mt-12 w-full max-w-5xl"> {/* Added max-w-5xl for better control */}
        <CFGNav />
      </div>
    </div>
  );
}