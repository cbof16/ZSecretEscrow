"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/lib/wallet-context";
import { ArrowUpRight, ArrowDownRight, Shield } from "lucide-react";

interface Earnings {
  total: number;
  pending: number;
  completed: number;
  shielded: number;
}

// Mock data for demo
const mockEarnings: Earnings = {
  total: 15000,
  pending: 3500,
  completed: 11500,
  shielded: 8000,
};

export function EarningsCard() {
  const { isDemo } = useWallet();
  const earnings = isDemo ? mockEarnings : { total: 0, pending: 0, completed: 0, shielded: 0 };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">{earnings.total} ZEC</p>
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">+12.5%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm">Pending</span>
              </div>
              <p className="text-lg font-semibold">{earnings.pending} ZEC</p>
            </div>

            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-sm">Completed</span>
              </div>
              <p className="text-lg font-semibold">{earnings.completed} ZEC</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Shielded Earnings</span>
            </div>
            <p className="text-lg font-semibold text-blue-700">
              {earnings.shielded} ZEC
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {((earnings.shielded / earnings.total) * 100).toFixed(1)}% of total earnings
            </p>
          </div>

          {!isDemo && (
            <div className="text-center py-4 text-muted-foreground">
              <p>Connect your wallet to view earnings</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 