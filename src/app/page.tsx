import Link from "next/link";
import Player from "./../components/Player";

import { decode, encode } from "@/lib/url";
import { getBoard } from "@/app/actions";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Board } from "@/lib/types";

import { Button } from "@/components/ui/button";

export default async function Home({ searchParams }: { searchParams: any }) {
  const { board: defaultBoard, canEdit } = await getBoard({
    id: "viech",
    adminToken: searchParams.editToken,
  });

  const encodedBoard = decode(searchParams.board);

  const board: Board =
    Object.keys(encodedBoard).length > 0 ? encodedBoard : defaultBoard;

  return (
    <main className="min-h-screen p-4 sm:px-24 lg:px-40">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="col-span-2 text-4xl font-extrabold tracking-tight">
              {board.title}
            </CardTitle>
            {canEdit && (
              <Button type="button" variant="outline" asChild>
                <a href={`/create?board=${encode(board)}`}>Edit ✏️</a>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Player board={board} />
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/create" className="p-6 underline underline-offset-2">
            Create your own video board 🤩
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
