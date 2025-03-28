import NameCycle from "../islands/NameCycle.tsx";
// import CFGNavWrapper from "../islands/CFGNavWrapper.tsx";
import JointJSComponent from "../islands/JointJSComponent.tsx";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-base px-4 py-12">
      {/* Logo */}
      <div className="mb-8 w-48 h-48 rounded-full overflow-hidden">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="object-cover w-full h-full"
        />
      </div>

      {/* Name Cycle */}
      <div className="w-full text-center overflow-hidden whitespace-nowrap">
        <h1 className="text-5xl sm:text-6xl font-bold text-accent">
          <NameCycle />
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-muted text-center mt-4">
        I like reverse engineering. Sometimes.
      </p>

      {/* JointJS Diagram */}
      <div className="mt-12 w-full max-w-6xl">
        <JointJSComponent />
      </div>
    </div>
  );
}
