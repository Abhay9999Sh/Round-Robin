import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Get all coupons
    const coupons = await db.collection("coupons").find({}).toArray();

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if coupon already exists
    const existingCoupon = await db.collection("coupons").findOne({ code });

    if (existingCoupon) {
      return NextResponse.json(
        { success: false, message: "Coupon code already exists" },
        { status: 400 }
      );
    }

    // Add new coupon
    await db.collection("coupons").insertOne({
      code,
      claimed: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Coupon added successfully",
    });
  } catch (error) {
    console.error("Error adding coupon:", error);
    return NextResponse.json(
      { success: false, message: "Error adding coupon" },
      { status: 500 }
    );
  }
}
