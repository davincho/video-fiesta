import { kv } from "@vercel/kv";

import { decode } from "@/lib/url";

import Player from "./../../components/Player";

import { notFound } from "next/navigation";
import { KV_ENTRY } from "@/lib/schema";
import PublishedDialog from "./PublishedDialog";

async function getBoard({
  b_id,
  admin_token,
}: {
  b_id?: string;
  admin_token?: string;
}) {
  if (!b_id) {
    notFound();
  }

  const result = await kv.hgetall<KV_ENTRY>(b_id);

  if (!result) {
    notFound();
  }

  console.log(result, result.admin_token === admin_token);

  const board = decode(result.board);

  return { board, canEdit: result.admin_token === admin_token };
}

export default async function View({
  searchParams,
}: {
  searchParams: { b_id?: string; admin_token?: string; published?: boolean };
}) {
  const { b_id, admin_token, published } = searchParams;
  const { board, canEdit } = await getBoard({ b_id, admin_token });

  return (
    <div className="p-2">
      {published && <PublishedDialog />}

      {canEdit && <button>EDIT me</button>}
      <Player board={board} />
    </div>
  );
}
