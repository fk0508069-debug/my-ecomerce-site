import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/orders";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { 
      shippingName, 
      shippingAddress,
      shippingEmail,
      shippingPhone,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      products, 
      totalPrice,
      paymentMethod 
    } = body;

    if (!shippingName || !shippingAddress || !products || !totalPrice) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = await Order.create({
      shippingName,
      shippingAddress,
      shippingEmail,
      shippingPhone,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      products,
      totalPrice,
      paymentMethod: paymentMethod || 'COD'
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderId: order._id,
      order
    }, { status: 201 });

  } catch (error) {
    console.error('Order Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders', error: error.message },
      { status: 500 }
    );
  }
}
