"use client";

import { decode } from "@/lib/url";

import Player from "./../../components/Player";
import { Button } from "@/components/ui/button";

import { useHash } from "../useHash";

export default function Preview() {
  const [hash] = useHash();
  const decodedBoard = decode(hash?.substring(1) || null);

  console.log("decodedBoard", decodedBoard);

  return (
    <div className="p-2">
      <Button variant="outline" asChild className="m-2">
        <a href={`/create${hash}`}>👈🏻 Back to editing</a>
      </Button>

      <Player board={decodedBoard} />
    </div>
  );
}
