import { Head } from "$fresh/runtime.ts";
import Home from "../components/Home.tsx";

export default function Index() {
  return (
    <>
      <Head>
        <title>Dylan Stancil</title>
        <link rel="stylesheet" href="/styles/output.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
        />
      </Head>
      <Home />
    </>
  );
}
