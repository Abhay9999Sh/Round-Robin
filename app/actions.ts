"use server";

import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

// Time restrictions (in seconds)
const CLAIM_COOLDOWN = 3600; // 1 hour

type ClaimResult = {
  success: boolean;
  message: string;
  coupon?: string;
  timeRemaining?: number;
};

export async function claimCoupon(): Promise<ClaimResult> {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const userId = cookieStore.get("userId")?.value;

    // Create a unique user identifier if it doesn't exist
    if (!userId) {
      const newUserId = new ObjectId().toString();
      cookieStore.set("userId", newUserId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    const currentUserId = userId || cookieStore.get("userId")?.value;

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Check if user has claimed a coupon recently
    const userClaim = await db.collection("claims").findOne({
      $or: [{ userId: currentUserId }, { ip }],
    });

    const now = Math.floor(Date.now() / 1000);

    if (userClaim) {
      const lastClaimTime = Math.floor(userClaim.timestamp / 1000);
      const timeSinceClaim = now - lastClaimTime;

      if (timeSinceClaim < CLAIM_COOLDOWN) {
        const timeRemaining = CLAIM_COOLDOWN - timeSinceClaim;
        return {
          success: false,
          message: "You have already claimed a coupon recently.",
          timeRemaining,
        };
      }
    }

    // Get the next available coupon using round-robin
    const couponsCollection = db.collection("coupons");

    // Find coupons that are available (not claimed)
    const availableCoupons = await couponsCollection
      .find({ claimed: false })
      .toArray();

    if (availableCoupons.length === 0) {
      return {
        success: false,
        message: "Sorry, there are no more coupons available at this time.",
      };
    }

    // Get the first available coupon (round-robin)
    const coupon = availableCoupons[0];

    // Mark the coupon as claimed
    await couponsCollection.updateOne(
      { _id: coupon._id },
      {
        $set: {
          claimed: true,
          claimedBy: currentUserId,
          claimedAt: new Date(),
        },
      }
    );

    // Record the claim
    await db.collection("claims").updateOne(
      { userId: currentUserId },
      {
        $set: {
          userId: currentUserId,
          ip,
          timestamp: Date.now(),
          couponId: coupon._id,
        },
      },
      { upsert: true }
    );

    return {
      success: true,
      message: "Coupon claimed successfully!",
      coupon: coupon.code,
    };
  } catch (error) {
    console.error("Error claiming coupon:", error);
    return {
      success: false,
      message:
        "An error occurred while claiming your coupon. Please try again later.",
    };
  }
}

// Admin function to add coupons (would be protected in a real application)
export async function addCoupon(
  code: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { db } = await connectToDatabase();

    await db.collection("coupons").insertOne({
      code,
      claimed: false,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Coupon added successfully!",
    };
  } catch (error) {
    console.error("Error adding coupon:", error);
    return {
      success: false,
      message: "An error occurred while adding the coupon.",
    };
  }
}
