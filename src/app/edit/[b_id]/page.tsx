import { getBoard } from "@/app/actions";

import CreateOrEdit from "@/components/CreateOrEdit";

export default async function Edit({
  params,
  searchParams,
}: {
  params: { b_id: string };
  searchParams: { b_id?: string; admin_token?: string };
}) {
  const { admin_token } = searchParams;
  const { b_id } = params;

  const { board, canEdit } = await getBoard({ id: b_id, adminToken: admin_token });

  // if (!canEdit) {
  //   redirect("/");
  // }

  return (
    <div className="p-2">
      <CreateOrEdit  b_id={b_id} admin_token={admin_token} />
    </div>
  );
}
