import Link from "next/link";
import Player from "./../components/Player";

export default async function Home() {
  return (
    <main className="min-h-screen sm:p-24 md:p-40 p-4">
      <Player />
      <div className="p-6 text-center underline underline-offset-2">
        <Link href="/create">Create your own nipple audio board 🤩</Link>
      </div>
    </main>
  );
}
