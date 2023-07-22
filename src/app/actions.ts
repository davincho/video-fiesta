"use server";

import "server-only";

import { kv } from "@vercel/kv";
import { encode } from "@/lib/url";

import { nanoid } from "nanoid";
import { KV_ENTRY } from "@/lib/schema";
import { notFound } from "next/navigation";

export const saveBoard = async (data: FormData) => {
  const boardId = nanoid();
  const adminToken = nanoid(64);

  await kv.hset(boardId, {
    board: encode(data),
    admin_token: adminToken,
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  });

  return { boardId, adminToken };
};

export async function getBoard(boardId: string, adminToken?: string) {
  const kvBoard = await kv.hgetall<KV_ENTRY>(boardId);

  if (kvBoard) {
    const { board, admin_token } = kvBoard;

    return {
      board,
      canEdit: String(admin_token) === adminToken,
    };
  }

  notFound();
}
