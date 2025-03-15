"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { addCoupon } from "@/app/actions";

type Coupon = {
  _id: string;
  code: string;
  claimed: boolean;
  claimedBy?: string;
  claimedAt?: string;
  createdAt: string;
};

export default function AdminPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [addingCoupon, setAddingCoupon] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/coupons");
      const data = await response.json();

      if (data.success) {
        setCoupons(data.coupons);
      } else {
        setMessage({ text: "Failed to fetch coupons", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while fetching coupons",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async () => {
    if (!newCouponCode.trim()) {
      setMessage({ text: "Please enter a coupon code", type: "error" });
      return;
    }

    setAddingCoupon(true);
    try {
      const result = await addCoupon(newCouponCode);

      if (result.success) {
        setMessage({ text: result.message, type: "success" });
        setNewCouponCode("");
        fetchCoupons();
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while adding the coupon",
        type: "error",
      });
    } finally {
      setAddingCoupon(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Coupon Administration</h1>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Add New Coupon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
              />
              <Button onClick={handleAddCoupon} disabled={addingCoupon}>
                {addingCoupon ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Coupon
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coupon Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{coupons.length}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded">
                <p className="text-sm text-muted-foreground">Claimed</p>
                <p className="text-2xl font-bold">
                  {coupons.filter((c) => c.claimed).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Coupon List</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchCoupons}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Claimed By</TableHead>
                    <TableHead>Claimed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No coupons found. Add some coupons to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    coupons.map((coupon) => (
                      <TableRow key={coupon._id}>
                        <TableCell className="font-mono">
                          {coupon.code}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              coupon.claimed
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {coupon.claimed ? "Claimed" : "Available"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(coupon.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{coupon.claimedBy || "-"}</TableCell>
                        <TableCell>
                          {coupon.claimedAt
                            ? new Date(coupon.claimedAt).toLocaleString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
