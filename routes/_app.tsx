// routes/_app.tsx
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
        
        {/* Highlight.js for syntax highlighting - More direct approach */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/c.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/javascript.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/python.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/bash.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/typescript.min.js"></script>
        
        {/* Global initialization script - this is key */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.onload = function() {
            document.querySelectorAll('pre code').forEach((el) => {
              hljs.highlightElement(el);
            });
          }
        ` }} />

        {/* Rosepine theme base styles */}
        <style>{`
          html, body {
            background-color: #232136; /* rosepine base */
            color: #e0def4; /* rosepine text color */
            margin: 0;
            padding: 0;
            min-height: 100%;
            font-family: 'JetBrains Mono', monospace;
          }
          
          /* Customize highlight.js to better match Rose Pine theme */
          .hljs {
            background: transparent !important;
          }
          
          /* Rose Pine theme adjustments for syntax highlighting */
          .hljs-keyword,
          .hljs-selector-tag,
          .hljs-built_in,
          .hljs-name {
            color: #c4a7e7; /* Iris */
          }
          
          .hljs-string,
          .hljs-attr,
          .hljs-doctag,
          .hljs-template-tag {
            color: #9ccfd8; /* Foam */
          }
          
          .hljs-title,
          .hljs-section,
          .hljs-selector-id {
            color: #eb6f92; /* Rose */
          }
          
          .hljs-literal,
          .hljs-number,
          .hljs-type,
          .hljs-params {
            color: #f6c177; /* Gold */
          }
          
          .hljs-comment,
          .hljs-quote,
          .hljs-meta {
            color: #908caa; /* Muted */
          }
          
          .hljs-variable,
          .hljs-template-variable,
          .hljs-tag,
          .hljs-regexp {
            color: #eb6f92; /* Rose */
          }
          
          .hljs-symbol,
          .hljs-bullet,
          .hljs-link {
            color: #ea9a97; /* Love */
          }
          
          .hljs-operator {
            color: #908caa; /* Subtle */
          }
          
          /* Additional styles for markdown content */
          .markdown-body {
            background-color: #232136;
            color: #e0def4;
            padding: 1rem;
          }
          
          .markdown-body a {
            color: #eb6f92;
          }
          
          .markdown-body blockquote {
            border-left-color: #393552;
            color: #e0def4;
          }
          
          .markdown-body code {
            background-color: #2a273f;
            color: #e0def4;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'JetBrains Mono', monospace;
          }
          
          .markdown-body pre {
            background-color: #2a273f;
            color: #e0def4;
            padding: 1rem;
            border-radius: 0.375rem;
            margin: 1rem 0;
            overflow: auto;
          }
          
          .markdown-body pre code {
            padding: 0;
            background-color: transparent;
          }
        `}</style>
      </head>
      <body>
        <Component />
        <Footer />
      </body>
    </html>
  );
}