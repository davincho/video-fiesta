import Link from "next/link";
import Player from "./../components/Player";

import { decode, encode } from "@/lib/url";
import { getBoard } from "@/app/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Board } from "@/lib/types";

import { Button } from "@/components/ui/button";

export default async function Home({ searchParams }: { searchParams: any }) {
  const { board: defaultBoard, canEdit } = await getBoard({
    id: "2afeac38-be2f-4e15-b8aa-18dbdc2d011d",
    adminToken: searchParams.editToken,
  });

  const encodedBoard = decode(searchParams.board);

  const board: Board =
    Object.keys(encodedBoard).length > 0 ? encodedBoard : defaultBoard;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-90" />
        <div className="relative z-20 flex h-full flex-col items-center justify-center p-4">
          <h1 className="mb-6 -rotate-2 transform text-center text-8xl font-black uppercase md:text-9xl">
            Video
            <br />
            Fiesta
          </h1>
          <p className="mb-8 rotate-1 transform font-mono text-2xl md:text-3xl">
            Create. Share. Experience.
          </p>
          <Link
            href="/create"
            className="transform bg-white px-8 py-4 text-xl font-bold uppercase text-black transition-transform hover:rotate-2 hover:bg-gray-200"
          >
            Start Creating
          </Link>
          <Link
            href="#featured-board"
            className="mt-4 transform border-4 border-white bg-transparent px-8 py-4 text-xl font-bold uppercase text-white transition-transform hover:rotate-2 hover:bg-white hover:text-black"
          >
            See Sample Board
          </Link>
        </div>
      </section>

      {/* Featured Board Section */}
      <section
        id="featured-board"
        className="bg-blue-600 px-4 py-20 sm:px-24 lg:px-40"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 -rotate-1 transform text-6xl font-black uppercase text-white">
            Featured Board
          </h2>
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="rotate-1 transform text-4xl font-extrabold tracking-tight">
                  {board.title}
                </CardTitle>
                {canEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="border-2 border-black hover:bg-black hover:text-white"
                  >
                    <a href={`/create?board=${encode(board)}`}>Edit ✏️</a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Player board={board} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y-8 border-black bg-white px-4 py-20 sm:px-24 lg:px-40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="transform bg-red-500 p-8 text-white transition-transform hover:-rotate-2">
            <h3 className="mb-4 text-3xl font-black uppercase">
              Youtube Integration
            </h3>
            <p className="font-mono">
              Pull your favorite clips directly from YouTube
            </p>
          </div>
          <div className="transform bg-blue-500 p-8 text-white transition-transform hover:rotate-2">
            <h3 className="mb-4 text-3xl font-black uppercase">Easy Sharing</h3>
            <p className="font-mono">Share your boards with anyone, anywhere</p>
          </div>
          <div className="transform bg-green-500 p-8 text-white transition-transform hover:-rotate-2">
            <h3 className="mb-4 text-3xl font-black uppercase">Customizable</h3>
            <p className="font-mono">Make your boards uniquely yours</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 px-4 py-20 text-center text-white sm:px-24 lg:px-40">
        <h2 className="mb-8 -rotate-1 transform text-7xl font-black uppercase">
          Ready to Start?
        </h2>
        <Link
          href="/create"
          className="inline-block transform bg-white px-12 py-6 text-2xl font-bold uppercase text-purple-600 transition-transform hover:rotate-2 hover:bg-gray-200"
        >
          Create Your Board Now
        </Link>
      </section>
    </main>
  );
}
