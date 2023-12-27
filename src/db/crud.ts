"use server";

import "server-only";

import { buildDbClient } from "@/lib/dbClient";
import { boardsTable, sequencesTable } from "../../drizzle/schema";

import { eq } from "drizzle-orm";
import { Board, videosSchema } from "@/lib/schema";

const db = buildDbClient();

export const read = async (id: string) => {
  console.info(`Reading board with ID: ${id}`);

  const rows = await db
    .select({
      board: boardsTable,
      sequence: sequencesTable,
    })
    .from(boardsTable)
    .innerJoin(sequencesTable, eq(boardsTable.id, sequencesTable.boardId))
    .where(eq(boardsTable.id, id));

  const result = rows.reduce<
    Record<
      string,
      {
        board: typeof boardsTable.$inferSelect;
        videos: Record<string, Array<typeof sequencesTable.$inferSelect>>;
      }
    >
  >((acc, row) => {
    const board = row.board;
    const sequence = row.sequence;

    if (!acc[board.id]) {
      acc[board.id] = { board, videos: {} };
    }

    if (sequence) {
      if (!acc[board.id].videos[sequence.videoId]) {
        acc[board.id].videos[sequence.videoId] = [];
      }

      acc[board.id].videos[sequence.videoId].push(sequence);
    }
    return acc;
  }, {});

  const joinedBoard = Object.values(result)[0];

  return {
    ...joinedBoard.board,
    videos: videosSchema.parse(
      Object.values(joinedBoard.videos).map((sequences) => {
        return {
          videoId: sequences[0].videoId,
          sequences: sequences,
        };
      }),
    ),
  };
};

const writeBoardVideos = async (id: string, board: Board) => {
  console.log(`Writing board with ID: ${id}`);

  const { videos } = board;

  // Rewrite all sequences
  await db.delete(sequencesTable).where(eq(sequencesTable.boardId, id));

  const sequences: Array<typeof sequencesTable.$inferInsert> = [];

  videos.forEach((video, index) => {
    video.sequences.forEach((sequence) => {
      sequences.push({
        ...sequence,
        boardId: id,
        videoId: video.videoId,
        videoPlatform: "yt",
      });
    });
  });

  await db.insert(sequencesTable).values(sequences);
};

export const create = async (board: Board) => {
  const { title } = board;

  const res = await db
    .insert(boardsTable)
    .values({
      title,
    })
    .returning();

  const newBoard = res[0];

  if (!newBoard) {
    throw new Error("Could not create board");
  }

  await writeBoardVideos(newBoard.id, board);

  return read(newBoard.id);
};

export const update = async (id: string, board: Board) => {
  console.log(`Writing board with ID: ${id}`);

  const { title } = board;

  // Update board
  await db
    .update(boardsTable)
    .set({
      title,
    })
    .where(eq(boardsTable.id, id));

  // Writing videos
  await writeBoardVideos(id, board);

  return read(id);
};
