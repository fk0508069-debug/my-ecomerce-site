import { connectDB } from "@/lib/db";
import Card from "@/models/Card";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token found" },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch (error) {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user is admin
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get card data from request body
    const { name, price, category, image, description } = await req.json();

    // Validate required fields
    if (!name || !price || !category || !image) {
      return NextResponse.json(
        { message: "Missing required fields: name, price, category, image" },
        { status: 400 }
      );
    }

    // Create new card
    const newCard = new Card({
      name,
      price,
      category,
      image,
      description: description || "",
      createdBy: decoded.userId,
    });

    await newCard.save();

    return NextResponse.json(
      { message: "Card added successfully", card: newCard },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding card:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
