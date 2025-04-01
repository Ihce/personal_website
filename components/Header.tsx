import SocialIcons from "./SocialIcons.tsx";
import HomeInteractive from "../islands/HomeInteractive.tsx"; // import the island

export default function Header() {
  return (
    <header className="relative w-full h-16">
      {/* Logo - top-left */}
      <a href="/" className="absolute top-0 left-0 p-2">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
      </a>

      {/* Island replaces name + toggle */}
      <HomeInteractive name="dylan stancil" />

      {/* Centered Social Icons */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-5 text-muted">
        <SocialIcons />
      </div>
    </header>
  );
}
