import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    console.log("Received itinerary generation request");
    const { city, dates, interests } = await req.json();

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents: `Create a detailed day-by-day itinerary for a trip to ${city} from ${
        dates.start
      } to ${dates.end}. The traveler is interested in ${interests.join(
        ", "
      )}. Include popular attractions, local experiences, dining options, and leisure activities.`,
      config: {
        systemInstruction: `
            You are a travel itinerary generator. Create engaging and personalized itineraries based on user interests,and city destination with given dates.
            Format the itinerary in a clear, structured manner suitable for streaming output.   
            you have to generate 2 sections first is heading for travel an second is each day plan.
            follow format of output stricty.
            for each section first write a test for heading write "Heading" then when start to generate day wise plan first write "Day 1", "Day 2" like this also remember like example generate small senetences for activities just 1 lines. and dont add anything apart from example format just follow striclty.
            for frontend.
            example:
            Heading: Your Personalized Itinerary for Paris
            Day 1: Exploring Historic Landmarks (Date: 2023-09-01)
            Place: Visiting the Eiffel Tower
            activities: Breakfast at a nearby café, lunch at a bistro in Le Marais, dinner at a riverside restaurant.

            Day 2: Art and Culture Immersion *(Date: 2023-09-02)
            Place: Visiting the Louvre Museum
            activities: Morning at the Louvre Museum, afternoon at Montmartre, evening at a jazz club.  
        `,
      },
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text;
            controller.enqueue(new TextEncoder().encode(text));
            // console.log("Streaming chunk:", text);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to generate itinerary." },
      { status: 500 }
    );
  }
}
