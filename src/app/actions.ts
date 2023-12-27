"use server";

import "server-only";

import { encode } from "@/lib/url";
import { boardSchema } from "@/lib/schema";

import { nanoid } from "nanoid";

import { buildDbClient } from "@/lib/dbClient";
import { boardsTable, sequencesTable, videosTable } from "../../drizzle/schema";

import { notFound } from "next/navigation";
import { z, ZodError } from "zod";

import { FieldError } from "react-hook-form";
import { eq } from "drizzle-orm";
import { Board, Sequence } from "@/lib/types";

const db = buildDbClient();

const read = async (id?: string) => {
  if (!id) {
    return null;
  }

  console.info(`Reading board with ID: ${id}`);

  // Fetch containing board
  const board = (
    await db.select().from(boardsTable).where(eq(boardsTable.id, id))
  )[0];

  if (!board) {
    console.warn(`Could not find board with id ${id}`);
    return null;
  }

  // Fetch respective videos

  const videos = [
    {
      videoId: "P59kknO1wQY",
      sequences: [
        {
          label: "HAZUNG",
          start: "12",
          end: "16",
        },
      ],
    },
  ];

  return {
    ...board,
    videos,
  };
};

const write = async (id: string, board: Board) => {
  console.log(`Writing board with ID: ${id}`);

  const { title, videos } = board;

  // Write board
  await db
    .update(boardsTable)
    .set({
      title,
    })
    .where(eq(boardsTable.id, id));

  // Writing videos

  await db
    .insert(videosTable)
    .values(
      videos.map((video) => ({
        id: video.videoId,
      })),
    )
    .onConflictDoNothing();

  // Cleanup the whole mess
  await db.delete(sequencesTable).where(eq(sequencesTable.board_id, id));

  const sequences: Array<typeof sequencesTable.$inferInsert> = [];

  videos.forEach((video) => {
    video.sequences.forEach((sequence) => {
      sequences.push({
        ...sequence,
        board_id: id,
        video_id: video.videoId,
      });
    });
  });

  await db.insert(sequencesTable).values(sequences);
};

const parseErrorSchema = (
  zodErrors: z.ZodIssue[],
  validateAllFieldCriteria: boolean,
) => {
  const errors: Record<string, FieldError> = {};
  for (; zodErrors.length; ) {
    const error = zodErrors[0];
    const { code, message, path } = error;
    const _path = path.join(".");

    if (!errors[_path]) {
      if ("unionErrors" in error) {
        const unionError = error.unionErrors[0].errors[0];

        errors[_path] = {
          message: unionError.message,
          type: unionError.code,
        };
      } else {
        errors[_path] = { message, type: code };
      }
    }

    if ("unionErrors" in error) {
      error.unionErrors.forEach((unionError) =>
        unionError.errors.forEach((e) => zodErrors.push(e)),
      );
    }

    zodErrors.shift();
  }

  return errors;
};

export const saveBoard = async (
  data: object,
  { b_id, admin_token }: { b_id: string; admin_token?: string },
) => {
  const { title, ...rest } = data;

  const parsedData = boardSchema.safeParse(rest);

  if (!parsedData.success) {
    console.log("error", parsedData.error.toString());

    return {
      success: false,
      errors: parseErrorSchema(parsedData.error.issues, false),
    };
  }

  // Update
  if (b_id) {
    const result = await read(b_id);

    if (!result || result.adminToken !== admin_token) {
      return {
        success: false,
      };
    }

    await write(b_id, {
      board: encode(parsedData.data),
    });

    return {
      success: true,
      data: {
        board: parsedData.data,
      },
    };
  }

  const boardId = nanoid();
  const adminToken = nanoid(64);

  await write(boardId, {
    board: encode(parsedData.data),
    admin_token: adminToken,
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  });

  return { boardId, adminToken, success: true };
};

export const getBoard = async ({
  id,
  adminToken,
}: {
  id?: string;
  adminToken?: string;
}) => {
  const result = await read(id);

  if (!result) {
    notFound();
  }

  const { adminToken: boardAdminToken, ...board } = result;

  return { board, canEdit: boardAdminToken === adminToken };
};
