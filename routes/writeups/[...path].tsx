// filepath: /routes/writeups/[...path].ts
import { serveDir } from "https://deno.land/std@0.204.0/http/file_server.ts";

export const handler = (req: Request) => {
  return serveDir(req, {
    fsRoot: "./writeups",
    urlRoot: "/writeups",
    showDirListing: false,
    enableCors: true,
  });
};