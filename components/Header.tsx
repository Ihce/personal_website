// /components/Header.tsx
export default function Header() {
    return (
      <header className="relative w-full h-16">
        {/* Logo in the top-left */}
        <div className="absolute top-0 left-0 p-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10"
          />
        </div>
  
        {/* "dylan stancil" text in the top-right */}
        <div className="absolute top-0 right-0 p-2 flex items-center">
          <h2 className="text-[1.75rem] leading-none font-bold text-accent">
            dylan stancil
          </h2>
        </div>
      </header>
    );
  }
  