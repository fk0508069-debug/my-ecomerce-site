import { connectDB } from "@/lib/db";
import Card from "@/models/Card";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // Get the id from query parameters
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get("id");

    // If ID is provided, fetch single card by ID
    if (cardId) {
      const card = await Card.findById(cardId)
        .populate("createdBy", "name email");

      if (!card) {
        return NextResponse.json(
          { message: "Card not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(card, { status: 200 });
    }

    // Otherwise, fetch all cards, sorted by newest first
    const cards = await Card.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
