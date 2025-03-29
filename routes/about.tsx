import NameCycle from "../islands/NameCycle.tsx";

export default function About() {
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

      {/* Page Title */}
      <div className="w-full text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-accent">About Me</h1>
      </div>

      {/* Name Cycle (optional) */}
      <div className="mt-4">
        <NameCycle />
      </div>

      {/* Content */}
      <p className="text-lg sm:text-xl text-muted text-center mt-4 max-w-2xl">
        I'm a developer with a passion for reverse engineering, design, and technology.
        I enjoy digging into how things work and sharing my findings. This page is a brief overview
        of my background, skills, and interests.
      </p>
    </div>
  );
}
