import { prisma } from "../../db/prisma";

export const createDocumentDB = (data: {
  userId: string;
  content: string;
  embeddings: number[];
}) => {
  return prisma.document.create({ 
    data: {
      userId: data.userId,
      content: data.content,
      embedding: data.embeddings, 
    }
  });
};

export const getAllDocuments = () => {
  return prisma.document.findMany();
};
