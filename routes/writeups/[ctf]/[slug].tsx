import { Handlers, PageProps } from "$fresh/server.ts";
import { render, CSS } from "@deno/gfm";
import Header from "../../../components/Header.tsx";
import { getWriteupByPath, Writeup } from "../../../utils/markdown.tsx";

interface WriteupDetailData {
  writeup: Writeup | null;
  html: string;
  error?: string;
}

export const handler: Handlers<WriteupDetailData> = {
  async GET(_req, ctx) {
    const { ctf, slug } = ctx.params;

    try {
      const writeup = await getWriteupByPath(ctf, slug);

      if (!writeup) {
        return ctx.render({
          writeup: null,
          html: "",
          error: "Writeup not found",
        });
      }

      // ✅ Enable Shiki-based syntax highlighting
      const html = await render(writeup.content, {
        useShiki: true,
      });

      return ctx.render({ writeup, html });
    } catch (error) {
      console.error("Error loading writeup:", error);
      return ctx.render({
        writeup: null,
        html: "",
        error: "Error loading writeup",
      });
    }
  },
};

export default function WriteupDetailPage({ data }: PageProps<WriteupDetailData>) {
  const { writeup, html, error } = data;

  return (
    <div className="bg-base min-h-screen flex flex-col items-center">
      <Header />

      <main className="w-full max-w-4xl px-4 py-8">
        {error ? (
          <div className="text-center py-8">
            <p className="text-lg text-accent">{error}</p>
            <a href="/writeups" className="text-accent hover:underline mt-4 block">
              ← Back to all writeups
            </a>
          </div>
        ) : writeup && (
          <>
            <div className="mb-6">
              <a href="/writeups" className="text-accent hover:underline">
                ← Back to all writeups
              </a>
            </div>

            <article>
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-accent mb-4">
                  {writeup.metadata.title}
                </h1>

                {writeup.metadata.description && (
                  <p className="text-xl text-muted mb-4">
                    {writeup.metadata.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                  {writeup.metadata.date && (
                    <div>
                      <span className="font-semibold text-text">Date:</span>{" "}
                      {new Date(writeup.metadata.date).toLocaleDateString()}
                    </div>
                  )}

                  {writeup.metadata.ctf && (
                    <div>
                      <span className="font-semibold text-text">CTF:</span>{" "}
                      {writeup.metadata.ctf}
                    </div>
                  )}

                  {writeup.metadata.difficulty && (
                    <div>
                      <span className="font-semibold text-text">Difficulty:</span>{" "}
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
                </div>

                {writeup.metadata.tags && writeup.metadata.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {writeup.metadata.tags.map(tag => (
                        <a 
                          key={tag}
                          href={`/writeups?tags=${tag}`}
                          className="px-3 py-1 bg-surface hover:bg-overlay rounded-full text-sm text-text"
                        >
                          {tag}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </header>

              {/* ✅ Add GFM base CSS (includes Shiki styles) */}
              <style dangerouslySetInnerHTML={{ __html: CSS }} />

              {/* ✅ Optional: override block layout */}
              <style>
                {`
                  .markdown-body {
                    background-color: transparent;
                    color: inherit;
                    padding: 0;
                  }

                  .markdown-body pre {
                    border-radius: 0.5rem;
                    padding: 1rem;
                    overflow-x: auto;
                  }

                  .markdown-body code {
                    font-family: ui-monospace, SFMono-Regular, monospace;
                    font-size: 0.875rem;
                  }
                `}
              </style>

              {/* ✅ Render HTML with Shiki-applied highlighting */}
              <div 
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </article>
          </>
        )}
      </main>
    </div>
  );
}
