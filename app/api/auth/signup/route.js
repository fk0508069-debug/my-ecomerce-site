import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json(); // Don't take 'role' from user input (Security Risk!)
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role here explicitly
    const adminEmail = 'fahadul0900@gmail.com';
    const role = (email === adminEmail) ? 'admin' : 'user';

    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role // This will now correctly save as 'admin' for your email
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error occurred", error: error.message }, { status: 500 });
  }
}