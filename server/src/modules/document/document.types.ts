import { z } from "zod";

export const createDocumentSchema = z.object({
  content: z.string().min(10)
});

export type CreateDocumentDTO = z.infer<typeof createDocumentSchema>;
