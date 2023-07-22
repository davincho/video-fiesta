import { getBoard } from "@/app/actions";
import { notFound } from "next/navigation";

import { decode } from "@/lib/url";
import Player from "@/components/Player";

export default async function Edit({
  searchParams,
}: {
  searchParams: { b_id?: string; admin_token?: string };
}) {
  const { b_id, admin_token } = searchParams;

  if (!b_id) {
    notFound();
  }

  const { board } = await getBoard(b_id, admin_token);

  return (
    <div className="p-2">
      <Player board={decode(board)} />
    </div>
  );
}
