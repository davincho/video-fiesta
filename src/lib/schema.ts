import * as z from "zod";

export const boardSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(4, { message: "Please provide a title" }),
  videos: z
    .array(
      z.object({
        videoId: z.string().min(6, "You need to provide a videoId"),
        sequences: z
          .array(
            z
              .object({
                label: z.string().min(4),
                start: z
                  .number({
                    invalid_type_error: "sec",
                  })
                  .min(1),
                end: z
                  .number({
                    invalid_type_error: "sec",
                  })
                  .min(1),
              })
              .refine(
                (data) => {
                  return data.start < data.end;
                },
                {
                  path: ["end"],
                },
              ),
            {
              required_error: "Please add at least one sequence.",
            },
          )
          .min(1, "Please add at least one sequence."),
      }),
      {
        required_error: "Please add at least one video.",
      },
    )
    .min(1, "Please add at least one video."),
});

export type FormValues = z.infer<typeof boardSchema>;

export type Board = FormValues;

export type Video = Board["videos"][0];

export type Sequence = Video["sequences"][0];

export type KV_ENTRY = {
  id: string;
  board: string;
  admin_token: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
};
