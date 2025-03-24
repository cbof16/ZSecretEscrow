"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useWallet } from "@/lib/wallet-context";
import { ActiveEscrowsCard } from "@/components/freelancer/active-escrows-card";
import { EarningsCard } from "@/components/freelancer/earnings-card";
import { ActivityCard } from "@/components/freelancer/activity-card";
import { PrivacySettings } from "@/components/freelancer/privacy-settings";

export default function FreelancerDashboard() {
  const { wallet, isDemo } = useWallet();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Freelancer Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Manage your escrow agreements and track your earnings privately
        </p>
      </div>

      {isDemo && (
        <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">Demo Mode Active</AlertTitle>
          <AlertDescription className="text-blue-600">
            You are currently in demo mode. This allows you to explore the freelancer experience with simulated data.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="escrows">Escrows</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ActiveEscrowsCard />
            <EarningsCard />
            <ActivityCard />
          </div>
        </TabsContent>

        <TabsContent value="escrows">
          <Card>
            <CardHeader>
              <CardTitle>Active Escrows</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Escrow list will be implemented here */}
              <p className="text-muted-foreground">
                View and manage your active escrow agreements
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Earnings details will be implemented here */}
              <p className="text-muted-foreground">
                Track your earnings and payment history
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
} 