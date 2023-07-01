import Link from "next/link";
import Player from "./../components/Player";

import { decode, encode } from "@/lib/url";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Board } from "@/lib/types";
import { Button } from "@/components/ui/button";

const DEFAULT_BOARD =
  "N4IgLglmA2CmIC4QHUKwHawE4AIByEADoXDgEID2AhlgCYgA0IAbhLbBQM6IDaor7CgEl6SAAoBWAJwBrGegDyARgDuARQCajEOiIlY3BHxDQqAI1jREIABIBBAFoBVPAHFtnMDTDWlAJm0MURAlADYQAF8GUFMLKyQAWQAdgBUAUQ8vLB8kAA5A9GD-SOiTc0trGzSAJWqcBKE8IQBldOrM72tQgHYC4O6AFkiAXSj+Ng4RazVcgAt0MWQzAGkAMTEAY21dYjhDY1iKpDIsCHQAcy8cM1OLrw7s6wklPqeJEpjy+NsqMBw7C6eHC0NA4JyebBYWAQDazbAPHIhAAMvSYQV8fiRIzGLAmwmCsGaAClzgBPADChAAGhoNHZtno9rxPnFrNUqDJYGAMFgqABXWHwpieTpICTvNGFJ5SD5lVlIZpgKEwuHQdAIrovSX9F4RUalASTYKcNRidAAL1cuXQAFoqecGbsDMy5UcQHgACewiHA2DEX6wHCrLAUB3CrKIgDMQ21Tyxepxhvx1lWYAA+mncrlzWpXFIhI79PsWW6AGqwc5cmhoLAapADCUgdH1mUJg14qb12jdG2ENOrCREzgJQtMowl77LX7mwOrCCcWGzKiFaB8i51kCRyP5WNIaO9BOjIA";

export default async function Home({ searchParams }: { searchParams: any }) {
  const encodedBoard = decode(searchParams.board);

  const board: Board =
    Object.keys(encodedBoard).length > 0 ? encodedBoard : decode(DEFAULT_BOARD);

  return (
    <main className="min-h-screen p-4 sm:px-24 md:px-40">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="col-span-2 text-4xl font-extrabold tracking-tight">
              {board.title}
            </CardTitle>
            <Button type="button" variant="outline" asChild>
              <a href={`/create?board=${encode(board)}`}>✏️ Edit</a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Player board={board} />
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/create" className="p-6 underline underline-offset-2">
            Create your own nipple audio board 🤩
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
