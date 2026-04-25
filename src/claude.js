// ── Groq API (Free tier — console.groq.com) ─────────────────────────────────
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

let API_KEY = "";
export function setGroqApiKey(key) {
  API_KEY = key;
}

async function callGroq(system, userText, maxTokens = 2048) {
  if (!API_KEY)
    throw new Error("No API key set. Please enter your Groq API key.");
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userText },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error ${res.status}`);
  }
  return (await res.json()).choices?.[0]?.message?.content || "";
}

async function callGroqMultiTurn(system, messages, maxTokens = 1024) {
  if (!API_KEY)
    throw new Error("No API key set. Please enter your Groq API key.");
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error ${res.status}`);
  }
  return (await res.json()).choices?.[0]?.message?.content || "";
}

export async function summarizeDocument(docContent, filename) {
  return callGroq(
    "You are an expert academic assistant. Produce clear, well-structured summaries using ## headings for sections. Be thorough but concise.",
    `Summarize this document titled "${filename}":\n\n${docContent.slice(0, 8000)}`,
  );
}

export async function generateQuiz(docContent, filename) {
  const raw = await callGroq(
    `You are an expert quiz generator. Generate exactly 5 multiple-choice questions from the study material.
Return ONLY valid JSON, no markdown, no backticks:
{"questions":[{"question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}]}
correctAnswer is the 0-based index of the correct option.`,
    `Generate a quiz from "${filename}":\n\n${docContent.slice(0, 8000)}`,
  );
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned).questions;
}

export async function askQuestionWithHistory(messages, documents) {
  const docsContext = documents
    .filter((d) => d.status === "ready")
    .map((d) => `--- ${d.filename} ---\n${d.content.slice(0, 3000)}`)
    .join("\n\n");
  const system = `You are a helpful academic assistant. Answer student questions clearly based on the study materials. If not in the materials, say so and answer from general knowledge.\n\n${docsContext ? `Study Materials:\n${docsContext}` : "No documents uploaded yet."}`;
  return callGroqMultiTurn(system, messages);
}
