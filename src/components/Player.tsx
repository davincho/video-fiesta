"use client";

import React, { Fragment } from "react";
import ReactPlayer from "react-player";

import { Board, Nipple, Video } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function Player({ board }: { board: Board }) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(false);

  const playerRef = React.useRef<ReactPlayer>();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const [currentScene, setCurrentScene] = React.useState<{
    nipple: Nipple;
    video: Video;
  }>();

  const router = useRouter();

  React.useEffect(() => {
    setIsMounted(true);

    console.log('document.querySelector("button")?.click();');
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {isBuffering && (
        <div className="fixed left-0 top-0 w-full overflow-hidden bg-gray-300 text-white">
          <div className="animate-pulse bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-center">
            Buffering
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="relative h-56 md:col-span-3">
          {!isPlaying && (
            <div className="absolute flex h-full w-full items-center">
              Click one of the buttons
            </div>
          )}
          <ReactPlayer
            height="100%"
            width="100%"
            playing={isPlaying}
            ref={playerRef as any}
            config={{
              youtube: {
                embedOptions: {},
              },
            }}
            onBuffer={() => {
              setIsBuffering(true);
            }}
            onBufferEnd={() => {
              setIsBuffering(false);
            }}
            onEnded={() => setIsPlaying(false)}
            url={`https://www.youtube.com/watch?v=${currentScene?.video.videoId}&start=${currentScene?.nipple.start}&end=${currentScene?.nipple.end}`}
          />
        </div>

        {(board?.videos ?? []).map((video) => (
          <Fragment key={video.videoId}>
            {video.nipples.map((nipple) => (
              <Fragment key={nipple.start}>
                <button
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-4 font-bold text-white shadow  hover:from-pink-500 hover:to-purple-500"
                  onClick={() => {
                    if (playerRef.current) {
                      playerRef.current.seekTo(nipple.start, "seconds");

                      setCurrentScene({
                        nipple,
                        video,
                      });

                      setIsPlaying(true);
                    }
                  }}
                >
                  {nipple.label}
                </button>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </>
  );
}
