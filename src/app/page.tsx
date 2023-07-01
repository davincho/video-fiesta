import Link from "next/link";
import Player from "./../components/Player";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  return (
    <main className="min-h-screen sm:px-24 md:px-40 p-4">
      <Card>
        <CardHeader>
          <CardTitle>sdfsdf</CardTitle>
        </CardHeader>
        <CardContent>
          <Player />
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
