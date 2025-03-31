import { useState } from "preact/hooks";
import { Writeup } from "../utils/markdown.tsx";
import { searchWriteups } from "../utils/search.tsx";

interface WriteupData {
  writeups: Writeup[];
  allTags: string[];
}

export default function WriteupPage({ data }: { data: WriteupData }) {
  const { writeups, allTags } = data;
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [clientSideWriteups, setClientSideWriteups] = useState(writeups);
  
  const handleSearch = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setQuery(target.value);
    updateResults(target.value, selectedTags);
  };
  
  const toggleTag = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    updateResults(query, newSelectedTags);
  };
  
  const updateResults = (searchQuery: string, tags: string[]) => {
    setClientSideWriteups(searchWriteups(writeups, searchQuery, tags));
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search writeups..."
          value={query}
          onInput={handleSearch}
          className="w-full p-2 border border-overlay rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2 text-text">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? "bg-accent text-white"
                  : "bg-surface text-text hover:bg-overlay"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {clientSideWriteups.length === 0 ? (
        <div className="w-full text-center py-8 max-w-3xl">
          <p className="text-lg text-text">No writeups found matching your criteria.</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientSideWriteups.map(writeup => (
              <a 
                href={`/writeups/${writeup.ctfName}/${writeup.slug}`}
                key={`${writeup.ctfName}/${writeup.slug}`}
                className="block p-4 border rounded-lg border-overlay transform transition-all duration-200 ease-in-out hover:shadow-md hover:border-accent hover:scale-105"
              >
                <h3 className="text-xl font-semibold mb-2 text-text">
                  {writeup.metadata.title}
                </h3>
                {writeup.metadata.description && (
                  <p className="text-muted mb-3 line-clamp-2">
                    {writeup.metadata.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {writeup.metadata.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-surface text-text text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {writeup.metadata.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-surface text-text text-xs rounded">
                        +{writeup.metadata.tags.length - 3}
                      </span>
                    )}
                  </div>
                  {writeup.metadata.date && (
                    <span className="text-xs text-muted">
                      {new Date(writeup.metadata.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {writeup.metadata.difficulty && (
                  <div className="mt-2">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      writeup.metadata.difficulty === "Easy"
                        ? "bg-pine text-text"
                        : writeup.metadata.difficulty === "Medium"
                        ? "bg-iris text-text"
                        : writeup.metadata.difficulty === "Hard"
                        ? "bg-accent text-white"
                        : "bg-surface text-text"
                    }`}>
                      {writeup.metadata.difficulty}
                    </span>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
