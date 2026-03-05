import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business, topic, goal, messages } = body;

    // Support both old format (business + topic) and new format (goal + messages)
    const campaignGoal = goal || `Create a campaign for a ${business} focusing on ${topic}`;
    const conversationMessages = messages || [];
    
    // Extract the JWT token sent from your frontend page.tsx
    const authHeader = req.headers.get('Authorization'); 

    // Use the live Lambda URL from your .env.local
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is missing from .env.local");
    }

    console.log("🚀 Firing payload to AWS Lambda:", apiUrl);
    console.log("📝 Conversation history:", conversationMessages.length, "messages");

    // CALL THE LIVE AWS LAMBDA AGENT with stateful messages
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '', // Securely pass the Cognito JWT
      },
      body: JSON.stringify({ 
        goal: campaignGoal, 
        messages: conversationMessages,
        user_id: "test-user-1" 
      }), 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lambda Error:", errorText);
      throw new Error(`AWS Lambda Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Lambda Function URLs often wrap the response in a "body" string. 
    // This safely extracts it whether it's wrapped or raw.
    let parsedData = data;
    if (data.body && typeof data.body === 'string') {
        parsedData = JSON.parse(data.body);
    } else if (data.body && typeof data.body === 'object') {
        parsedData = data.body;
    }

    // Map Python Agent response back to your Next.js UI format
    return NextResponse.json({
      hook: parsedData.plan?.hook || "Hook generation pending...",
      offer: parsedData.plan?.offer || "Offer generation pending...",
      cta: parsedData.plan?.cta || "CTA generation pending...",
      captions: parsedData.captions || [],
      imageUrl: parsedData.image_url || "",
      messages: parsedData.messages || conversationMessages, // Return updated conversation history
      campaignId: parsedData.campaignId,
      status: parsedData.status
    });

  } catch (error) {
    console.error("Agent Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate campaign via Strands Agent' },
      { status: 500 }
    );
  }
}