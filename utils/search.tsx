// utils/search.ts
import { Writeup } from "./markdown.tsx";

// Simplified implementation that doesn't require external libraries
export function searchWriteups(
  writeups: Writeup[],
  query: string = "",
  tags: string[] = []
): Writeup[] {
  if (!query && (!tags || tags.length === 0)) {
    return writeups;
  }

  let results = [...writeups];
  
  // Filter by tags if specified
  if (tags && tags.length > 0) {
    results = results.filter(writeup => 
      tags.some(tag => writeup.metadata.tags.includes(tag))
    );
  }
  
  // Apply search if query is provided
  if (query && query.trim() !== "") {
    const lowerQuery = query.toLowerCase();
    results = results.filter(writeup => {
      return (
        writeup.metadata.title.toLowerCase().includes(lowerQuery) ||
        (writeup.metadata.description?.toLowerCase().includes(lowerQuery)) ||
        writeup.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        writeup.content.toLowerCase().includes(lowerQuery)
      );
    });
  }
  
  return results;
}

export function getAllTags(writeups: Writeup[]): string[] {
  const tagSet = new Set<string>();
  
  writeups.forEach(writeup => {
    writeup.metadata.tags.forEach(tag => {
      tagSet.add(tag);
    });
  });
  
  return [...tagSet].sort();
}

export function getAllCTFs(writeups: Writeup[]): string[] {
  const ctfSet = new Set<string>();
  
  writeups.forEach(writeup => {
    if (writeup.ctfName && writeup.ctfName !== "uncategorized") {
      ctfSet.add(writeup.ctfName);
    }
  });
  
  return [...ctfSet].sort();
}