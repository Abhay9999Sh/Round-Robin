import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// Generate a random coupon code
function generateCouponCode(length = 8) {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// This route is for seeding the database with initial coupons
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Check if coupons already exist
    const couponCount = await db.collection("coupons").countDocuments();

    if (couponCount > 0) {
      return NextResponse.json({
        success: true,
        message: "Database already seeded with coupons",
        count: couponCount,
      });
    }

    // Generate 50 sample coupons
    const coupons = Array.from({ length: 50 }, () => ({
      code: `${generateCouponCode(4)}-${generateCouponCode(4)}`,
      claimed: false,
      createdAt: new Date(),
    }));

    // Insert coupons into the database
    await db.collection("coupons").insertMany(coupons);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      count: coupons.length,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { success: false, message: "Error seeding database" },
      { status: 500 }
    );
  }
}
