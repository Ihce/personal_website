import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../../components/Header.tsx";
import WriteupPage from "../../islands/WriteupPage.tsx";
import { getAllWriteups, Writeup } from "../../utils/markdown.tsx";
import { getAllTags, searchWriteups } from "../../utils/search.tsx";

interface WriteupData {
  writeups: Writeup[];
  allTags: string[];
}

export const handler: Handlers<WriteupData> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    const tagsParam = url.searchParams.get("tags") || "";
    const tags = tagsParam ? tagsParam.split(",") : [];
    
    const allWriteups = await getAllWriteups();
    const allTags = getAllTags(allWriteups);
    
    // Filter writeups based on query and tags
    const filteredWriteups = searchWriteups(allWriteups, query, tags);
    
    return ctx.render({ 
      writeups: filteredWriteups,
      allTags,
    });
  },
};

export default function WriteupsRoute({ data }: PageProps<WriteupData>) {
  return (
    <div className="bg-base min-h-screen flex flex-col">
      <Header />
      <main className="w-full px-4 py-8">
        {/* Center container */}
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl font-bold text-accent mb-4 text-center">
            Writeups
          </h1>
          <p className="text-lg text-muted text-center mb-8">
            This section contains my thoughts, tutorials, and analyses on
            technology and reverse engineering.
          </p>

          {/* Render the interactive island */}
          <WriteupPage data={data} />
        </div>
      </main>
    </div>
  );
}
