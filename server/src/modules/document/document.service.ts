import { createDocumentDB } from "./ document.repository";

const JINA_EMBEDDING_MODEL = "jina-embeddings-v2-base-en";

export const createDocument = async (userId: string, content: string) => {
  try {
    if (!process.env.JINA_API_KEY) {
      throw new Error("JINA_API_KEY is missing");
    }

    console.log("STEP 4.1: sending text to Jina");

    const res = await fetch("https://api.jina.ai/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.JINA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: JINA_EMBEDDING_MODEL,
        input: [content],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("JINA ERROR RESPONSE:", errText);
      throw new Error("Jina embedding request failed");
    }

    const json = await res.json();

    const embedding: number[] = json.data[0].embedding;

    console.log("STEP 4.2: embedding generated");
    console.log("EMBEDDING LENGTH:", embedding.length); // must be 768

    console.log("STEP 4.3: saving to DB");

    return await createDocumentDB({
      userId,
      content,
      embeddings: embedding, 
    });
  } catch (err) {
    console.error("🔥 CREATE DOCUMENT ERROR:");
    console.error(err);
    throw err;
  }
};
