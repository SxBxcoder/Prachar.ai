import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business, topic } = body;

    // Construct the "Goal" for the Agent
    const goal = `Create a campaign for a ${business} focusing on ${topic}`;
    const userId = "test-user-1"; // Hardcoded for hackathon demo

    // CALL THE PYTHON AGENT (Running locally)
    const response = await fetch('http://127.0.0.1:8000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goal, user_id: userId }),
    });

    if (!response.ok) {
      throw new Error(`Python Backend Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Map Python Agent response to your UI format
    return NextResponse.json({
      hook: data.plan.hook,
      offer: data.plan.offer,
      cta: data.plan.cta,
      captions: data.captions, // Your UI can now display multiple options!
      imageUrl: data.image_url
    });

  } catch (error) {
    console.error("Agent Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate campaign via Strands Agent' },
      { status: 500 }
    );
  }
}