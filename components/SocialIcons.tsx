// components/SocialIcons.tsx

import { Github, Twitter, Instagram, Mail } from "https://esm.sh/lucide-preact@0.270.0";

export default function SocialIcons() {
  return (
    <>
      <a href="https://github.com/yourusername" className="hover:text-accent transition" aria-label="GitHub">
        <Github className="w-5 h-5" />
      </a>

      <a href="https://twitter.com/yourusername" className="hover:text-accent transition" aria-label="Twitter">
        <Twitter className="w-5 h-5" />
      </a>

      <a href="https://instagram.com/yourusername" className="hover:text-accent transition" aria-label="Instagram">
        <Instagram className="w-5 h-5" />
      </a>

      <a href="mailto:you@example.com" className="hover:text-accent transition" aria-label="Email">
        <Mail className="w-5 h-5" />
      </a>
    </>
  );
}
