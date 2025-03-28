import { useEffect, useState } from "preact/hooks";

const variants = [
  { label: "ascii", value: "Dylan Stancil" },
  { label: "hex", value: "44796c616e205374616e63696c" },
  { label: "b64", value: "RHlsYW4gU3RhbmNpbA==" },
];

export default function NameCycle() {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = variants[index];
    setDisplay("");
    setCharIndex(0);

    const interval = setInterval(() => {
      setCharIndex((i) => {
        const next = i + 1;
        if (next > current.value.length) {
          clearInterval(interval);
          // wait a bit before switching formats
          setTimeout(() => {
            setIndex((prev) => (prev + 1) % variants.length);
          }, 1500); // 1.5 seconds before switching format
        }
        setDisplay(current.value.slice(0, next));
        return next;
      });
    }, 60); // speed of text appearance (in ms)

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="text-center font-mono text-accent">
      <div className="text-sm uppercase text-muted tracking-widest mb-2"></div>
      <div className="text-5xl sm:text-6xl font-bold">
        {display}
        <span className="ml-1 inline-block w-[2px] h-[1.2em] bg-accent align-middle animate-blink" />
      </div>
    </div>
  );
}
