"use client";

import React, { Fragment } from "react";
import ReactPlayer from "react-player";

import { useRouter } from "next/navigation";
import { Board, Sequence, Video } from "@/lib/schema";

export default function Player({ board }: { board: Board }) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(false);

  const playerRef = React.useRef<ReactPlayer>();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const [currentScene, setCurrentScene] = React.useState<{
    sequence: Sequence;
    video: Video;
  }>();

  const router = useRouter();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Extract play functionality to a reusable function
  const playSequence = (video: Video, sequence: Sequence) => {
    if (playerRef.current) {
      playerRef.current.seekTo(sequence.start, "seconds");
      setCurrentScene({
        sequence,
        video,
      });
      setIsPlaying(true);
    }
  };

  // Function to play a random sequence
  const playRandomSequence = () => {
    if (playerRef.current && board.videos && board.videos.length > 0) {
      // Select a random video
      const randomVideoIndex = Math.floor(Math.random() * board.videos.length);
      const randomVideo = board.videos[randomVideoIndex];

      // Select a random sequence from the video
      const randomSequenceIndex = Math.floor(
        Math.random() * randomVideo.sequences.length,
      );
      const randomSequence = randomVideo.sequences[randomSequenceIndex];

      // Use the extracted function to play the sequence
      playSequence(randomVideo, randomSequence);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {isBuffering && (
        <div className="fixed left-0 top-0 w-full overflow-hidden bg-black text-white">
          <div className="animate-pulse bg-red-500 p-2 text-center font-black uppercase">
            Buffering
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(board?.videos ?? []).map((video) => (
          <Fragment key={video.videoId}>
            {video.sequences.map((sequence) => (
              <Fragment key={sequence.start}>
                <button
                  className="border-4 border-black bg-yellow-300 p-4 text-xl font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-red-500 hover:text-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  onClick={() => playSequence(video, sequence)}
                >
                  {sequence.label}
                </button>
              </Fragment>
            ))}
          </Fragment>
        ))}
        <div className="relative row-start-1 h-64 border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:col-span-2 lg:col-span-2 lg:col-start-2 lg:row-span-3 lg:row-start-2">
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
            url={`https://www.youtube.com/watch?v=${currentScene?.video.videoId}${
              currentScene?.sequence
                ? `&start=${currentScene.sequence.start}&end=${currentScene.sequence.end}`
                : ""
            }`}
          />
          {!currentScene?.video && (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center ">
              <button
                onClick={playRandomSequence}
                className="border-4 border-black bg-yellow-300 p-6 text-2xl font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-red-500 hover:text-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                Play Random Clip! 🎬
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
