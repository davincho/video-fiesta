import * as z from "zod";

export const schema = z.object({
  title: z.string().min(4, { message: "Please provide a title" }),
  videos: z.array(
    z.object({
      videoId: z.string(),
      nipples: z.array(
        z
          .object({
            label: z.string().min(4),
            start: z.number({
              invalid_type_error: "sec",
            }),
            end: z.number({
              invalid_type_error: "sec",
            }),
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
          )
      ),
    })
  ),
});

export type FormValues = z.infer<typeof schema>;
