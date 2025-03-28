import { useEffect, useState } from "preact/hooks";

interface HexDecoderProps {
  text: string;
}

export default function HexDecoder({ text }: HexDecoderProps) {
  const [decodedText, setDecodedText] = useState("");

  // Function to encode text to hexadecimal
  const encodeToHex = (str: string) => {
    return Array.from(str)
      .map((char) => char.charCodeAt(0).toString(16))
      .join(" ");
  };

  useEffect(() => {
    const hexEncoded = encodeToHex(text);
    setDecodedText(hexEncoded);

    const timer = setTimeout(() => {
      setDecodedText(text);
    }, 2000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <span className="inline-block overflow-hidden whitespace-nowrap transition-opacity duration-1000 opacity-100">
      {decodedText}
    </span>
  );
}
