export default function Footer() {
    return (
      <footer className="w-full py-6 flex justify-center items-center space-x-6 text-muted">
        {/* GitHub */}
        <a href="https://github.com/yourusername" aria-label="GitHub" className="hover:text-accent transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 1C5.924 1 1 5.924 1 12c0 4.865 3.152 8.986 7.523 10.441.55.102.751-.239.751-.53 0-.262-.01-1.126-.015-2.04-3.06.665-3.705-1.475-3.705-1.475-.5-1.27-1.22-1.607-1.22-1.607-.996-.682.075-.668.075-.668 1.102.078 1.68 1.132 1.68 1.132.977 1.673 2.564 1.189 3.188.91.098-.708.382-1.19.695-1.464-2.443-.278-5.01-1.221-5.01-5.437 0-1.201.43-2.183 1.132-2.953-.114-.278-.49-1.4.108-2.918 0 0 .924-.296 3.03 1.13a10.552 10.552 0 0 1 2.76-.372 10.57 10.57 0 0 1 2.76.372c2.105-1.426 3.028-1.13 3.028-1.13.6 1.518.224 2.64.11 2.918.704.77 1.13 1.752 1.13 2.953 0 4.227-2.57 5.155-5.018 5.427.392.34.743 1.017.743 2.05 0 1.48-.013 2.672-.013 3.034 0 .293.2.636.757.527C19.853 20.98 23 16.866 23 12c0-6.076-4.924-11-11-11z"/>
          </svg>
        </a>
  
        {/* Twitter */}
        <a href="https://twitter.com/yourusername" aria-label="Twitter" className="hover:text-accent transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
          </svg>
        </a>
  
        {/* Instagram */}
        <a href="https://instagram.com/yourusername" aria-label="Instagram" className="hover:text-accent transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        </a>
  
        {/* Email */}
        <a href="mailto:your@email.com" aria-label="Email" className="hover:text-accent transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v16H4z"/>
            <polyline points="4,4 12,13 20,4"/>
          </svg>
        </a>
      </footer>
    );
  }
  