import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-base px-4 py-12">
        {/* Logo */}
        <div className="mb-8 w-48 h-48 rounded-full overflow-hidden">
          <img 
            src="/logo.png" 
            alt="Logo"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-accent">
          404 - Page not found
        </h1>

        {/* Description */}
        <p className="my-4 text-lg sm:text-xl text-muted text-center">
          The page you were looking for doesn't exist.
        </p>

        {/* Link to home */}
        <a href="/" className="underline text-accent">Go back home</a>
      </div>
    </>
  );
}
