"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/lib/wallet-context";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Shield, CheckCircle, Clock } from "lucide-react";

interface Activity {
  type: "escrow" | "payment" | "verification";
  timestamp: Date;
  status: string;
  amount?: number;
  escrowId?: string;
}

// Mock data for demo
const mockActivity: Activity[] = [
  {
    type: "escrow",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "New escrow received",
    escrowId: "escrow-3",
  },
  {
    type: "payment",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: "Payment received",
    amount: 1500,
  },
  {
    type: "verification",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "Delivery verified",
    escrowId: "escrow-1",
  },
  {
    type: "escrow",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "Escrow completed",
    escrowId: "escrow-2",
  },
];

export function ActivityCard() {
  const { isDemo } = useWallet();
  const activities = isDemo ? mockActivity : [];

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "escrow":
        return <ArrowUpRight className="h-4 w-4" />;
      case "payment":
        return <Shield className="h-4 w-4" />;
      case "verification":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.status}</p>
                  {activity.amount && (
                    <p className="text-sm text-muted-foreground">
                      {activity.amount} ZEC
                    </p>
                  )}
                  {activity.escrowId && (
                    <p className="text-sm text-muted-foreground">
                      Escrow #{activity.escrowId}
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {isDemo ? (
                <p>No recent activity in demo mode</p>
              ) : (
                <p>Connect your wallet to view activity</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 