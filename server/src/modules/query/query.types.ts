import { z } from "zod";

export const querySchema = z.object({
  question: z.string().min(5)
});

export type QueryDTO = z.infer<typeof querySchema>;
