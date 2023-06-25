import Player from "./../components/Player";

export default async function Home() {
  return (
    <main className="min-h-screen p-24">
      <h1 className="text-3xl text-center pb-5">Audio Nipple Board</h1>
      <Player url={""} />
    </main>
  );
}
