"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PrivacySettings() {
  const [showEarnings, setShowEarnings] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [autoShield, setAutoShield] = useState(true);

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">Privacy Settings</AlertTitle>
        <AlertDescription className="text-blue-600">
          Control your privacy preferences and data visibility on ZSecretEscrow
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Profile Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Profile Information</Label>
              <p className="text-sm text-muted-foreground">
                Display your profile details to potential clients
              </p>
            </div>
            <Switch
              checked={showProfile}
              onCheckedChange={setShowProfile}
              className="data-[state=checked]:bg-accent-blue"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Earnings</Label>
              <p className="text-sm text-muted-foreground">
                Display your earnings and payment history
              </p>
            </div>
            <Switch
              checked={showEarnings}
              onCheckedChange={setShowEarnings}
              className="data-[state=checked]:bg-accent-blue"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Activity</Label>
              <p className="text-sm text-muted-foreground">
                Display your recent activity and transactions
              </p>
            </div>
            <Switch
              checked={showActivity}
              onCheckedChange={setShowActivity}
              className="data-[state=checked]:bg-accent-blue"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Shield Earnings</Label>
              <p className="text-sm text-muted-foreground">
                Automatically shield your earnings using zero-knowledge proofs
              </p>
            </div>
            <Switch
              checked={autoShield}
              onCheckedChange={setAutoShield}
              className="data-[state=checked]:bg-accent-blue"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>All transactions are private by default</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <p>
              Your data is protected using zero-knowledge proofs and shielded transactions.
              Even when sharing information, your actual identity and transaction details remain private.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>All sensitive data is encrypted and stored securely</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-accent-blue hover:bg-accent-blue/80">
          Save Privacy Settings
        </Button>
      </div>
    </div>
  );
} 