"use client"

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Activity, Shield, Clock, CheckCircle, AlertTriangle, Wallet } from "lucide-react"
import { useWalletStore } from "../../store/wallet-store"

// Define Activity Type
interface Activity {
  id: string;
  type: 'escrow' | 'payment' | 'verification' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'pending' | 'warning';
}

// Mock Activity Data
const mockActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'payment',
    title: 'Payment Received',
    description: 'You received 40 NEAR for completing the "Frontend Implementation" milestone.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'success'
  },
  {
    id: 'act-2',
    type: 'escrow',
    title: 'New Escrow Contract',
    description: 'New escrow contract created with alice.near for "Mobile App Development".',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'success'
  },
  {
    id: 'act-3',
    type: 'alert',
    title: 'Milestone Due Soon',
    description: 'The "Backend Integration" milestone is due in 2 days.',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    status: 'warning'
  },
  {
    id: 'act-4',
    type: 'verification',
    title: 'Work Verification Requested',
    description: 'Client requested verification for the "Database Design" milestone.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'pending'
  },
  {
    id: 'act-5',
    type: 'escrow',
    title: 'Escrow Contract Completed',
    description: 'Escrow contract with z_sender123... for "Logo Design" has been completed.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'success'
  }
];

// Function to get the appropriate icon for the activity type
const getActivityIcon = (type: Activity['type'], status?: Activity['status']) => {
  switch (type) {
    case 'escrow':
      return <Shield className="h-5 w-5 text-accent-blue" />;
    case 'payment':
      return <Wallet className="h-5 w-5 text-green-500" />;
    case 'verification':
      return status === 'pending' 
        ? <Clock className="h-5 w-5 text-yellow-500" />
        : <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'alert':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    default:
      return <Activity className="h-5 w-5 text-accent-blue" />;
  }
};

export function ActivityCard() {
  const { demoMode } = useWalletStore()
  
  // Get the time difference in a human-readable format
  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your most recent activities and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        {demoMode ? (
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 p-4 border border-border rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500/10' :
                  activity.status === 'warning' ? 'bg-yellow-500/10' :
                  activity.status === 'pending' ? 'bg-blue-500/10' :
                  'bg-accent-blue/10'
                }`}>
                  {getActivityIcon(activity.type, activity.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-full bg-gray-800 mb-4">
              <Activity className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Recent Activity</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connect your wallet to see your real activity or switch to demo mode to see example data.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="ml-auto">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  )
}