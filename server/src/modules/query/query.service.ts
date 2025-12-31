import { fetchDocuments } from "./query.repository";
import { cosineSimilarity } from "../../shared/utils/cosineSimilarity";

const JINA_MODEL = "jina-embeddings-v2-base-en";
const GROQ_MODEL = "llama-3.1-8b-instant";

export const askQuestion = async (question: string) => {
  try {
    const embedRes = await fetch("https://api.jina.ai/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.JINA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: JINA_MODEL,
        input: [question],
      }),
    });

    if (!embedRes.ok) {
      throw new Error(await embedRes.text());
    }

    const embedJson = await embedRes.json();
    const queryEmbedding: number[] = embedJson.data[0].embedding;
    const docs = await fetchDocuments();
    const rankedDocs = docs
      .map((doc) => {
        if (!doc.embedding) return null;
        return {
          id: doc.id,
          content: doc.content,
          score: cosineSimilarity(queryEmbedding, doc.embedding as number[]),
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.score - a!.score)
      .slice(0, 3);

    if (rankedDocs.length === 0) {
      return { answer: "No relevant context found.", sources: [] };
    }
    const context = rankedDocs.map((d) => d!.content).join("\n\n");
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content:
                "Answer ONLY using the given context. If the answer is not present, say you don't know.",
            },
            {
              role: "user",
              content: `Context:\n${context}\n\nQuestion: ${question}`,
            },
          ],
        }),
      }
    );
    const groqJson = await groqRes.json();
    return {
      answer: groqJson.choices?.[0]?.message?.content ?? "No answer",
      sources: rankedDocs,
    };
  } catch (err) {
    console.error("QUERY ERROR:", err);
    throw err;
  }
};
