import { useEffect } from "preact/hooks";

export default function DisassemblyEffect() {
  useEffect(() => {
    const elements = document.querySelectorAll(".disassemble");
    elements.forEach((el, index) => {
      const delay = index * 100; // staggered delay for each element
      setTimeout(() => {
        el.classList.add("animate");
      }, delay);
    });
  }, []);

  return (
    <div className="container">
      <div className="disassemble">Element 1</div>
      <div className="disassemble">Element 2</div>
      <div className="disassemble">Element 3</div>
      {/* Add more elements as needed */}
    </div>
  );
}