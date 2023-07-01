"use client";

import React, { Fragment } from "react";
import ReactPlayer from "react-player";

import { decode, encode } from "@/lib/url";
import { Board, Nipple, Video } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const DEFAULT_BOARD =
  "N4IgLglmA2CmIC4QHUKwHawE4AIByEADoXDgEID2AhlgCYgA0IAbhLbBQM6IDaor7CgEl6SAAoBWAJwBrGegDyARgDuARQCajEOiIlY3BHxDQqAI1jREIABIBBAFoBVPAHFtnMDTDWlAJm0MURAlADYQAF8GUFMLKyQAWQAdgBUAUQ8vLB8kAA5A9GD-SOiTc0trGzSAJWqcBKE8IQBldOrM72tQgHYC4O6AFkiAXSj+Ng4RazVcgAt0MWQzAGkAMTEAY21dYjhDY1iKpDIsCHQAcy8cM1OLrw7s6wklPqeJEpjy+NsqMBw7C6eHC0NA4JyebBYWAQDazbAPHIhAAMvSYQV8fiRIzGLAmwmCsGaAClzgBPADChAAGhoNHZtno9rxPnFrNUqDJYGAMFgqABXWHwpieTpICTvNGFJ5SD5lVlIZpgKEwuHQdAIrovSX9F4RUalASTYKcNRidAAL1cuXQAFoqecGbsDMy5UcQHgACewiHA2DEX6wHCrLAUB3CrKIgDMQ21Tyxepxhvx1lWYAA+mncrlzWpXFIhI79PsWW6AGqwc5cmhoLAapADCUgdH1mUJg14qb12jdG2ENOrCREzgJQtMowl77LX7mwOrCCcWGzKiFaB8i51kCRyP5WNIaO9BOjIA";

function Video({
  video,
  toggleBuffering,
}: {
  video: Video;
  toggleBuffering: (buffering: boolean) => void;
}) {
  const playerRef = React.useRef<ReactPlayer>();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const [currentNipple, setCurrentNipple] = React.useState<Nipple>();

  return (
    <>
      <div className="overflow-hidden">
        <ReactPlayer
          playing={isPlaying}
          ref={playerRef as any}
          config={{
            youtube: {
              embedOptions: {},
            },
          }}
          onBuffer={() => {
            toggleBuffering(true);
          }}
          onBufferEnd={() => {
            toggleBuffering(false);
          }}
          onProgress={({ playedSeconds }) => {
            if (!currentNipple || playedSeconds > currentNipple.end) {
              setIsPlaying(false);
            }
          }}
          onEnded={() => setIsPlaying(false)}
          url={`https://www.youtube.com/watch?v=${video.videoId}`}
        />
      </div>

      <div className="grid grid-cols-4 gap-5">
        {video.nipples.map((nipple) => (
          <button
            key={nipple.start}
            className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold  rounded-full shadow"
            onClick={() => {
              if (playerRef.current) {
                playerRef.current.seekTo(nipple.start, "seconds");
                setCurrentNipple(nipple);
                setIsPlaying(true);
              }
            }}
          >
            {nipple.label}
          </button>
        ))}
      </div>
    </>
  );
}

export default function Player() {
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

  const hashBoard = decode(document.location.hash.substring(1));
  const board: Board =
    Object.keys(hashBoard).length > 0 ? hashBoard : decode(DEFAULT_BOARD);

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
        <h1 className="text-4xl col-span-2 font-extrabold tracking-tight">
          {board.title}
        </h1>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            router.push(`/create#${encode(board)}`);
          }}
        >
          ✏️ Edit
        </Button>

        <div className="col-span-3 h-56">
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

        {board.videos.map((video) => (
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
