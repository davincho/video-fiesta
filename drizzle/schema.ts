import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const boardsTable = sqliteTable("boards", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text("title").notNull(),
  adminToken: text("admin_token").$defaultFn(() => randomUUID() + randomUUID()),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sequencesTable = sqliteTable("sequences", {
  id: integer("id").primaryKey().notNull(),
  boardId: text("board_id")
    .notNull()
    .references(() => boardsTable.id, { onDelete: "cascade" }),
  videoId: text("video_id").notNull(),
  videoPlatform: text("video_platform").notNull(),
  label: text("label").notNull(),
  start: integer("start").notNull(),
  end: integer("end").notNull(),
});

// export const videosTable = sqliteTable(
//   "videos",
//   {
//     id: integer("id").primaryKey(),
//     videoId: text("video_id").notNull(),
//     videoPlatform: text("video_platform").notNull(),
//   },
//   (table) => ({
//     unq: unique().on(table.videoId, table.videoPlatform),
//   }),
// );

// export const videoPlatformTable = sqliteTable("video_platform", {
//   id: integer("id").primaryKey(),
//   name: text("name").notNull(),
// });
