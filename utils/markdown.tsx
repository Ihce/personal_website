// utils/markdown.ts
import { walk } from "https://deno.land/std@0.204.0/fs/walk.ts";
import { parse as parseYAML } from "https://deno.land/std@0.204.0/yaml/mod.ts";

export interface WriteupMetadata {
  title: string;
  date: string;
  tags: string[];
  ctf?: string;
  description?: string;
  difficulty?: string;
  [key: string]: any;
}

export interface Writeup {
  slug: string;
  ctfName: string;
  fileName: string;
  metadata: WriteupMetadata;
  content: string;
}

export async function getAllWriteups(): Promise<Writeup[]> {
  const writeups: Writeup[] = [];
  const baseDir = "writeups";

  // Check if the writeups directory exists
  try {
    const dirInfo = await Deno.stat(baseDir);
    if (!dirInfo.isDirectory) {
      console.error("writeups is not a directory");
      return [];
    }
  } catch (error) {
    console.error("Error accessing writeups directory:", error);
    return [];
  }

  // Walk through all directories and files
  for await (const entry of walk(baseDir, { exts: [".md"] })) {
    if (entry.isFile) {
      try {
        const pathParts = entry.path.split("/");
        const ctfName = pathParts[1] || "uncategorized";
        const fileName = pathParts[pathParts.length - 1];
        const fileContent = await Deno.readTextFile(entry.path);
        
        // Parse front matter metadata (YAML between --- markers)
        const metadataMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        let metadata: WriteupMetadata = { title: fileName, date: new Date().toISOString(), tags: [] };
        let content = fileContent;
        
        if (metadataMatch) {
          try {
            metadata = {
              ...metadata,
              ...parseYAML(metadataMatch[1]) as WriteupMetadata,
            };
            content = metadataMatch[2].trim();
          } catch (e) {
            console.error(`Error parsing YAML metadata in ${entry.path}:`, e);
          }
        }
        
        // If ctf name is not in metadata, add it from the directory structure
        if (!metadata.ctf) {
          metadata.ctf = ctfName;
        }
        
        // Add tags based on directory structure if none provided
        if (!metadata.tags || metadata.tags.length === 0) {
          metadata.tags = [ctfName];
        }
        
        // Create slug from filename
        const slug = fileName.replace(/\.md$/, "").toLowerCase().replace(/\s+/g, "-");
        
        writeups.push({
          slug,
          ctfName,
          fileName,
          metadata,
          content,
        });
      } catch (error) {
        console.error(`Error processing ${entry.path}:`, error);
      }
    }
  }
  
  // Sort by date, newest first
  writeups.sort((a, b) => 
    new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
  
  return writeups;
}

export async function getWriteupByPath(ctfName: string, slug: string): Promise<Writeup | null> {
  const writeups = await getAllWriteups();
  return writeups.find(w => w.ctfName === ctfName && w.slug === slug) || null;
}