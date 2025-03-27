"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Shield, Lock, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

export function PrivacySettings() {
  const [showEarnings, setShowEarnings] = useState(false)
  const [showProfile, setShowProfile] = useState(true)
  const [showActivity, setShowActivity] = useState(false)
  const [autoShieldEarnings, setAutoShieldEarnings] = useState(true)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          Privacy Settings
        </CardTitle>
        <CardDescription>Manage your privacy preferences and data protection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Profile Privacy</h3>
          
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Enhanced privacy protection enabled</AlertTitle>
            <AlertDescription>
              Your data is protected with zero-knowledge proofs and end-to-end encryption
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Show profile information publicly</div>
                <div className="text-sm text-muted-foreground">Allow other users to see your profile details</div>
              </div>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  showProfile ? 'bg-primary' : 'bg-input'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${
                    showProfile ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Show earnings publicly</div>
                <div className="text-sm text-muted-foreground">Allow other users to see your earnings</div>
              </div>
              <button
                onClick={() => setShowEarnings(!showEarnings)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  showEarnings ? 'bg-primary' : 'bg-input'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${
                    showEarnings ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Show activity history</div>
                <div className="text-sm text-muted-foreground">Allow other users to see your recent activity</div>
              </div>
              <button
                onClick={() => setShowActivity(!showActivity)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  showActivity ? 'bg-primary' : 'bg-input'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${
                    showActivity ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-semibold">Transaction Privacy</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto-shield earnings</div>
              <div className="text-sm text-muted-foreground">Automatically convert earnings to shielded transactions</div>
            </div>
            <button
              onClick={() => setAutoShieldEarnings(!autoShieldEarnings)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                autoShieldEarnings ? 'bg-primary' : 'bg-input'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${
                  autoShieldEarnings ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Private Transactions</h4>
                <p className="text-sm text-muted-foreground">
                  Your shielded transactions are encrypted and private. Only you can view the details.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-semibold">Data Protection</h3>
          
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Zero-Knowledge Proofs</h4>
                <p className="text-sm text-muted-foreground">
                  Your data is protected using advanced cryptography. We utilize zero-knowledge proofs to verify transactions without revealing sensitive information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto">Save Settings</Button>
      </CardFooter>
    </Card>
  )
} 