import Link from "next/link";
import Player from "./../components/Player";

export default async function Home() {
  return (
    <main className="min-h-screen sm:p-24 md:p-40 p-4 flex flex-col justify-center">
      <Player url={""} />
      <Link href="/create">Create your own</Link>
    </main>
  );
}
