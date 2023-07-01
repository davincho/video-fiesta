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
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {isBuffering && (
        <div className="w-full bg-gray-300 overflow-hidden fixed top-0 left-0 text-white">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse text-center">
            Buffering
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-3 h-56 relative">
          {!isPlaying && (
            <div className="absolute w-full h-full flex items-center">
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
                  className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold  rounded-full shadow"
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
