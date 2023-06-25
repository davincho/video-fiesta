import fs from "fs";
import ytdl from "ytdl-core";

import Player from "./../components/Player";

async function getVideo() {
  const writer = fs.createWriteStream("test.mp3");

  const stream = ytdl("https://www.youtube.com/watch?v=P59kknO1wQY", {
    filter: "audioonly",
  });

  const info = await ytdl.getInfo(
    "https://www.youtube.com/watch?v=P59kknO1wQY"
  );

  const format = ytdl.chooseFormat(info.formats, {
    filter: "audioonly",
  });

  console.log("info", format.url);

  stream.pipe(writer);

  await new Promise((resolve) => writer.on("finish", resolve));

  return { url: format.url };
}

export default async function Home() {
  const data = await getVideo();

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-3xl text-center pb-5">Audio Nipple Board</h1>
      <Player url={data.url} />
    </main>
  );
}
