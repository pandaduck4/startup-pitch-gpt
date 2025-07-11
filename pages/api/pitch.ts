import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST allowed" });
    return;
  }

  const prompt = req.body.prompt;

  const basePrompt = `You are a venture capitalist evaluating Indian startup pitches.
Respond to every idea with:
1. Market Opportunity
2. Strengths
3. Risks / Red Flags
4. Suggested Improvements
5. Final Verdict (Would you invest? Why?)
Be brutally honest, analytical, and clear — like a Shark Tank India judge.
Startup Idea: ${prompt}`;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: basePrompt }],
  });

  res.status(200).json({ result: completion.data.choices[0].message.content });
}