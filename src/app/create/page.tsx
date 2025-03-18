import CreateOrEdit from "@/components/CreateOrEdit";
import { Suspense } from "react";

export default async function Home() {
  return  (

    <Suspense fallback={<div>Loading...</div>}>
      <CreateOrEdit />
    </Suspense>
  );
}
