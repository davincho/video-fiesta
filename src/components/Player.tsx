"use client";

import React from "react";
import ReactPlayer from "react-player";

import { decode } from "@/lib/url";

const encoded =
  "N4IgLglmA2CmIC4QDkIAc1wAQCED2AhgE4AmIANCAG4Qmx4DOiA2qDXXgJJlIAKArAE4A1sIB2AeQCMAdwCKATQogx6TLCYJWIaAQBGsaIhAAJAIIAtAKrIA4soZhiYY1IBMy2GJ4gpANhAAX3JQXQMjJABZAB2AFQBRByciFyQADk9vVw9g0P1DYxN4gCVirEjOZE4AZQTipOdjPwB2TJ8-DMCAXW7AoA";

export default function Player({
  board = decode(encoded),
}: {
  url: string;
  board: {
    title: string;
    videos: [
      {
        videoId: string;
        nipples: [{ label: string; start: number; end: number }];
      }
    ];
  };
}) {
  const playerRef = React.useRef<any>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(false);
  const [currentNipple, setCurrentNipple] = React.useState();

  return (
    <>
      {isBuffering && (
        <div className="w-full bg-gray-300 overflow-hidden fixed top-0 left-0 text-white">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse text-center">
            Buffering
          </div>
        </div>
      )}
      <h1 className="text-3xl text-center pb-10">{board.title}</h1>
      {board.videos.map((video) => (
        <React.Fragment key={video.videoId}>
          <div className="w-1 h-1 overflow-hidden">
            <ReactPlayer
              playing={isPlaying}
              ref={playerRef as any}
              onBuffer={() => {
                setIsBuffering(true);
              }}
              onBufferEnd={() => {
                setIsBuffering(false);
              }}
              onProgress={({ playedSeconds }) => {
                if (playedSeconds > currentNipple.end) {
                  setIsPlaying(false);
                }
              }}
              onEnded={() => setIsPlaying(false)}
              url={`https://www.youtube.com/watch?v=${video.videoId}`}
            />
          </div>

          <div className="grid grid-cols-1 gap-5">
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
        </React.Fragment>
      ))}
    </>
  );
}
