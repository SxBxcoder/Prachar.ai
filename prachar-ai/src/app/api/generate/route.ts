import { NextRequest, NextResponse } from "next/server";
import { generateMarketingCopy } from "@/lib/bedrock";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, businessType } = body;

    if (!topic || !businessType) {
      return NextResponse.json(
        { error: "Missing required fields: topic and businessType" },
        { status: 400 }
      );
    }

    const result = await generateMarketingCopy(topic, businessType);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate marketing copy" },
      { status: 500 }
    );
  }
}
