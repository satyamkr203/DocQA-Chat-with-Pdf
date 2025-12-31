import { prisma } from "../../db/prisma";

export const fetchDocuments = () =>
  prisma.document.findMany({
    select: {
      id: true,
      content: true,
      embedding: true 
    }
  });
