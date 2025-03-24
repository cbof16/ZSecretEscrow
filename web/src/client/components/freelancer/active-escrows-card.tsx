"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/lib/wallet-context";
import { formatDistanceToNow } from "date-fns";

interface Escrow {
  id: string;
  amount: number;
  status: "pending" | "active" | "completed";
  deadline: Date;
  progress: number;
}

// Mock data for demo
const mockEscrows: Escrow[] = [
  {
    id: "escrow-1",
    amount: 1000,
    status: "active",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    progress: 60,
  },
  {
    id: "escrow-2",
    amount: 2500,
    status: "pending",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    progress: 0,
  },
];

export function ActiveEscrowsCard() {
  const { isDemo } = useWallet();
  const escrows = isDemo ? mockEscrows : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Escrows</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {escrows.length > 0 ? (
            escrows.map((escrow) => (
              <div
                key={escrow.id}
                className="p-4 rounded-lg border bg-card text-card-foreground"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Escrow #{escrow.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {escrow.amount} ZEC
                    </p>
                  </div>
                  <Badge
                    variant={
                      escrow.status === "active"
                        ? "default"
                        : escrow.status === "pending"
                        ? "secondary"
                        : "success"
                    }
                  >
                    {escrow.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{escrow.progress}%</span>
                  </div>
                  <Progress value={escrow.progress} />
                  <p className="text-sm text-muted-foreground">
                    Due in {formatDistanceToNow(escrow.deadline)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {isDemo ? (
                <p>No active escrows in demo mode</p>
              ) : (
                <p>Connect your wallet to view active escrows</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 