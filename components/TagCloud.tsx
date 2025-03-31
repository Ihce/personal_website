// components/TagCloud.tsx
import { JSX } from "preact";

interface TagCloudProps {
  tags: string[];
  selectedTags?: string[];
  onTagClick?: (tag: string) => void;
  className?: string;
  linkToSearch?: boolean;
}

export default function TagCloud({ 
  tags, 
  selectedTags = [], 
  onTagClick,
  className = "",
  linkToSearch = false
}: TagCloudProps): JSX.Element {
  if (linkToSearch) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {tags.map(tag => (
          <a
            key={tag}
            href={`/writeups?tags=${tag}`}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
          >
            {tag}
          </a>
        ))}
      </div>
    );
  }
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedTags.includes(tag)
              ? "bg-accent text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}