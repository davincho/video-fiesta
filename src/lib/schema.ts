import * as z from "zod";

export const schema = z.object({
  title: z.string().min(4, { message: "Please provide a title" }),
  videos: z
    .array(
      z.object({
        videoId: z.string().min(6, "You need to provide a videoId"),
        nipples: z
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
                  console.log("DATA", data, data.start < data.end);

                  return data.start < data.end;
                },
                {
                  message: "12",
                  path: ["end"],
                }
              ),
            {
              required_error: "Please add at least one sequence.",
            }
          )
          .min(1, "Please add at least one sequence."),
      }),
      {
        required_error: "Please add at least one video.",
      }
    )
    .min(1, "Please add at least one video."),
});

export type FormValues = z.infer<typeof schema>;

export type KV_ENTRY = {
  id: string;
  board: string;
  admin_token: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
};
