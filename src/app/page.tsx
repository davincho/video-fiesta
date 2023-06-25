import Player from "./../components/Player";

export default async function Home() {
  return (
    <main className="min-h-screen sm:p-24 md:p-40 p-4">
      <h1 className="text-3xl text-center pb-5">Audio Nipple Board</h1>
      <Player url={""} />
    </main>
  );
}
