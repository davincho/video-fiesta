import Player from "../../../components/Player";

import PublishedDialog from "../PublishedDialog";
import { getBoard } from "../../actions";

export default async function View({
  params,
  searchParams,
}: {
  params: { b_id: string };
  searchParams: { admin_token?: string; published?: boolean };
}) {
  const { admin_token, published } = searchParams;
  const { b_id } = params;

  console.log("params", params);

  const { board, canEdit } = await getBoard({ b_id, admin_token });

  return (
    <div className="p-2">
      {published && canEdit && <PublishedDialog />}

      {canEdit && <button>EDIT me</button>}
      <Player board={board} />
    </div>
  );
}
