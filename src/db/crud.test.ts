import { vi, test, beforeAll, expect, assert, beforeEach } from "vitest";
import { read, create, update } from "./crud";

import setupDB from "../../drizzle/migrate_local";
import { InStatement } from "@libsql/client";
import { Video } from "@/lib/schema";

vi.mock("server-only", () => {
  return {};
});

const DUMMY_BOARD = {
  title: "Wiener Nipple Board",
  videos: [
    {
      videoId: "P59kknO1wQY",
      sequences: [
        {
          start: 12,
          end: 16,
          label: "HAZUNG",
        },
      ],
    },
    {
      videoId: "P55kknO1wQY",
      sequences: [
        {
          start: 12,
          end: 16,
          label: "MIETE",
        },
      ],
    },
  ],
};

const { client, doMigration, db } = setupDB("viech");

beforeAll(async () => {
  await doMigration();
});

beforeEach(async () => {
  // Clean DB
  await client.execute("DELETE FROM boards");
  await client.execute("DELETE FROM sequences");
});

const getRowsCount = async (sql: InStatement) => {
  let res = await client.execute(sql);
  return res.rows.length;
};

test("it should create a new board", async () => {
  expect(await getRowsCount("SELECT * from boards")).toEqual(0);

  const newBoard = await create(DUMMY_BOARD);

  assert(newBoard.id, "New board should have an id");
  expect(
    await getRowsCount({
      sql: "SELECT * from boards WHERE id = ?",
      args: [newBoard.id],
    }),
  ).toEqual(1);

  expect(
    await getRowsCount({
      sql: "SELECT * from sequences WHERE board_id = ?",
      args: [newBoard.id],
    }),
  ).toEqual(2);
});

test("it should update a board that already exists in the DB", async () => {
  const newBoard = await create(DUMMY_BOARD);

  assert(newBoard.id);

  const updatedBoard = await update(newBoard.id, {
    ...newBoard,
    title: "This is a test",
  });

  expect(
    await getRowsCount({
      sql: "SELECT * from sequences WHERE board_id = ?",
      args: [newBoard.id],
    }),
  ).toEqual(2);

  assert(updatedBoard.id);
  expect(updatedBoard.title).toEqual("This is a test");

  // Go back to DB and verify if title was really changed
  const newFetchedBoard = await read(updatedBoard.id);
  assert(newFetchedBoard, "Board should exist in DB");
  expect(newFetchedBoard.title).toEqual("This is a test");
  expect(newFetchedBoard.videos).toEqual(updatedBoard.videos);
});

test("should create admin token and id based on UUID functionality", async () => {
  const newBoard = await create(DUMMY_BOARD);

  expect(newBoard.adminToken).toBeDefined();
  expect(newBoard.id).toBeDefined();
});

test("it should update videos, we rewrite all videos", async () => {
  const newBoard = await create(DUMMY_BOARD);

  const newVideos: Array<Video> = [
    {
      videoId: "abcdef",
      sequences: [
        {
          label: "huhuhu",
          start: 1,
          end: 10,
        },
      ],
    },
  ];

  await update(newBoard.id, {
    ...newBoard,
    videos: newVideos,
  });

  const updatedBoard = await read(newBoard.id);

  expect(updatedBoard.videos).toEqual(newVideos);
});
