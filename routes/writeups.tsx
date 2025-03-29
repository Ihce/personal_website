// /routes/writeups.tsx
import Header from "../components/Header.tsx";

export default function Writeups() {
  return (
    <div className="bg-base min-h-screen flex flex-col items-center">
      {/* Header at the top */}
      <Header />

      {/* Page Content */}
      <main className="flex flex-col items-center justify-center w-full px-4 py-8">
        <h1 className="text-4xl font-bold text-accent mb-4">Writeups</h1>
        <p className="text-lg text-muted text-center max-w-3xl">
          This section contains my thoughts, tutorials, and analyses on technology
          and reverse engineering.
        </p>
      </main>
    </div>
  );
}
