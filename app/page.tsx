import { Suspense } from "react";
import CouponDistributor from "@/components/coupon-distributor";
import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-primary text-primary-foreground">
          <h1 className="text-2xl font-bold text-center">
            Coupon Distribution System
          </h1>
        </div>
        <div className="p-6">
          <Suspense fallback={<LoadingState />}>
            <CouponDistributor />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading coupon system...</p>
    </div>
  );
}
