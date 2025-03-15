"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { claimCoupon } from "@/app/actions";

type ClaimStatus = "idle" | "loading" | "success" | "error";

export default function CouponDistributor() {
  const [status, setStatus] = useState<ClaimStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setStatus("idle");
      setMessage("");
      setCountdown(null);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours > 0 ? `${hours}h ` : ""}${
      minutes > 0 ? `${minutes}m ` : ""
    }${secs}s`;
  };

  const handleClaimCoupon = async () => {
    try {
      setStatus("loading");
      setMessage("Processing your request...");

      const result = await claimCoupon();

      if (result.success) {
        setStatus("success");
        setMessage(result.message);
        setCoupon(result.coupon ?? null);
        // Reset after 5 seconds
        setCountdown(5);
      } else {
        setStatus("error");
        setMessage(result.message);
        if (result.timeRemaining) {
          setTimeRemaining(result.timeRemaining);
          // Reset after showing error for 5 seconds
          setCountdown(5);
        }
      }
    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again later.");
      // Reset after showing error for 5 seconds
      setCountdown(5);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-muted-foreground">
        Claim your coupon below. Each user can claim one coupon per hour.
      </p>

      {status === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {message}
            {timeRemaining && (
              <div className="mt-2">
                Time until next claim: {formatTime(timeRemaining)}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {coupon && status === "success" && (
        <Card className="border-2 border-dashed border-primary">
          <CardContent className="p-4 text-center">
            <h3 className="font-bold text-lg mb-2">Your Coupon</h3>
            <p className="text-2xl font-mono bg-slate-50 p-2 rounded">
              {coupon}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Copy this code and use it at checkout
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleClaimCoupon}
          disabled={status === "loading"}
          size="lg"
          className="w-full"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Claim Coupon"
          )}
        </Button>
      </div>
    </div>
  );
}
