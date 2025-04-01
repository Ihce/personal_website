import NameCycle from "../islands/NameCycle.tsx";
import JointJSComponent from "../islands/JointJSComponent.tsx";
import SocialIcons from "../components/SocialIcons.tsx";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-base px-4 py-8 sm:px-2 sm:py-4 space-y-6 sm:space-y-3">
        {/* Logo */}
        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden">
          <img
            src="/logo.png"
            alt="Logo"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Name Cycle */}
        <div className="w-full text-center overflow-hidden whitespace-nowrap">
          <h1 className="text-4xl sm:text-6xl font-bold text-accent">
            <NameCycle />
          </h1>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-5 text-muted">
          <SocialIcons />
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted text-center">
          I like reverse engineering. Sometimes.
        </p>

        {/* Mobile-Only Cards */}
        <a
          href="/about"
          className="block sm:hidden w-full max-w-md bg-surface shadow-lg rounded-2xl px-6 py-4 text-center font-medium hover:bg-accent/20 transition"
        >
          About
        </a>
        <a
          href="/writeups"
          className="block sm:hidden w-full max-w-md bg-surface shadow-lg rounded-2xl px-6 py-4 text-center font-medium hover:bg-accent/20 transition"
        >
          Writeups
        </a>
        <a
          href="/projects"
          className="block sm:hidden w-full max-w-md bg-surface shadow-lg rounded-2xl px-6 py-4 text-center font-medium hover:bg-accent/20 transition"
        >
          Projects
        </a>

        {/* Desktop Diagram */}
        <div className="hidden sm:block w-full max-w-6xl">
          <JointJSComponent />
        </div>
      </div>
    </>
  );
}
