import { type PageProps } from "$fresh/server.ts";
import Footer from "../components/Footer.tsx";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>personal_website</title>
        <link rel="stylesheet" href="/styles.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
        />
        <style>{`
          html, body {
            background-color: #232136; /* rosepine base */
            color: #e0def4; /* rosepine text color */
            margin: 0;
            padding: 0;
            min-height: 100%;
          }
        `}</style>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
