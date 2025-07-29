import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  const { code } = await req.json(); // Now "code" contains the full prompt

  if (!code) {
    return NextResponse.json(
      { message: "Code (prompt) is required." },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a Solidity smart contract assistant and auditor."
        },
        {
          role: "user",
          content: code 
        }
      ],
      temperature: 0.5
    });

    const analysis = completion.choices[0].message.content;
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("❌ OpenAI error:", error);
    return NextResponse.json(
      { message: "OpenAI request failed" },
      { status: 500 }
    );
  }
}
