import { decode } from "@/lib/url";

import Player from "./../../components/Player";
import { Button } from "@/components/ui/button";

export default function Preview({
  searchParams,
}: {
  searchParams: { board: string };
}) {
  const decodedBoard = decode(searchParams.board);

  return (
    <div className="p-2">
      <Button variant="outline" asChild className="m-2">
        <a href={`/create?board=${searchParams.board}`}>👈🏻 Back to editing</a>
      </Button>

      <Player board={decodedBoard} />
    </div>
  );
}
