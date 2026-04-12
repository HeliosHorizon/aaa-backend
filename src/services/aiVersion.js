// 

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

export async function extractFromImageWithAI(base64Image) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // cheap + fast
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Extract all rows from this handwritten ledger.

Return ONLY JSON array:
[
  {
    "quantity": number,
    "particular": string,
    "rate": number,
    "amount": number
  }
]

Rules:
- Ignore crossed values
- Use final values
- Calculate amount if needed
`
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ]
    });

    const raw = response.content[0].text;

    console.log("CLAUDE RAW:", raw);

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error("CLAUDE ERROR:", error.message);
    return null;
  }
}