import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
});

export async function generateMarketingCopy(topic: string, businessType: string) {
  const prompt = `You are Prachar.ai, an expert Indian marketing agent.
User runs a ${businessType} business.
Topic: ${topic}
Task: Write 3 catchy social media captions in 'Hinglish' (Hindi + English mix). Keep it energetic and use emojis suitable for an Indian audience.`;

  const input = {
    modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 600,
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: prompt
        }]
      }]
    })
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const decoded = JSON.parse(new TextDecoder().decode(response.body));
    return decoded.content[0].text;
  } catch (error) {
    console.error("Bedrock Text Error:", error);
    throw new Error("AI Generation Failed");
  }
}
