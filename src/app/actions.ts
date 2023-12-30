"use server";

import "server-only";

import { boardSchema } from "@/lib/schema";

import { notFound } from "next/navigation";
import { z, ZodError } from "zod";

import { FieldError } from "react-hook-form";

import { create, read, update } from "@/db/crud";

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
  { id, adminToken }: { id: string; adminToken?: string },
) => {
  const parsedData = boardSchema.safeParse(data);

  if (!parsedData.success) {
    console.log("error", parsedData.error.toString());

    return {
      success: false,
      errors: parseErrorSchema(parsedData.error.issues, false),
    };
  }

  // Update
  if (id) {
    const result = await read(id);

    if (!result || result.adminToken !== adminToken) {
      return {
        success: false,
      };
    }

    await update(id, parsedData.data);

    return {
      success: true,
      data: {
        board: parsedData.data,
      },
    };
  }

  const newBoard = await create(parsedData.data);

  return { boardId: newBoard.id, adminToken, success: true };
};

export const getBoard = async ({
  id,
  adminToken,
}: {
  id: string;
  adminToken?: string;
}) => {
  const result = await read(id);

  if (!result) {
    notFound();
  }

  const { adminToken: boardAdminToken, ...board } = result;

  return { board, canEdit: boardAdminToken && boardAdminToken === adminToken };
};
