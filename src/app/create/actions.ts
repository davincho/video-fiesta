"use server";

import { nanoid } from "nanoid";

export const saveBoard = async (data: FormData) => {
  console.log("data", Object.fromEntries(data.entries()), nanoid());
};
