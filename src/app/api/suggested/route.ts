import connectToDB from "@/lib/db";
import { tours } from "@/lib/suggested-tours";
import SuggestedModel from "@/lib/Suggested.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { tour } = await req.json();

    if (!tour) {
      return NextResponse.json(
        { error: "No tour data provided" },
        { status: 400 }
      );
    }

    await connectToDB();
    const createdTour = await SuggestedModel.create(tour);

    return NextResponse.json(
      { message: "Tour inserted successfully", tour: createdTour },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to insert tour" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const tours = await SuggestedModel.find();
    return NextResponse.json({ tours }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}
