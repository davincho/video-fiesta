"use client";

import React from "react";
import ReactPlayer from "react-player";

const AUDIO_NIPPLES = [
  {
    label: "HAZUNG",
    start: 12,
    end: 16,
  },
  {
    label: "MÜTE",
    start: 8,
    end: 12,
  },
  { label: "HERR MINISTER", start: 67, end: 68 },
];

export default function Player({ url }: { url: string }) {
  const playerRef = React.useRef<any>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [info, setInfo] = React.useState(AUDIO_NIPPLES[0]);

  return (
    <>
      <div className="w-1 h-1 overflow-hidden">
        <ReactPlayer
          playing={isPlaying}
          ref={playerRef as any}
          onProgress={({ playedSeconds }) => {
            if (playedSeconds > info.end) {
              setIsPlaying(false);
            }
          }}
          onEnded={() => setIsPlaying(false)}
          url="https://www.youtube.com/watch?v=P59kknO1wQY"
        />
      </div>
      <div className="grid grid-cols-1 gap-5">
        {AUDIO_NIPPLES.map((nipple) => (
          <button
            key={nipple.start}
            className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold  rounded-full shadow"
            onClick={() => {
              if (playerRef.current) {
                playerRef.current.seekTo(nipple.start, "seconds");
                setInfo(nipple);
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
