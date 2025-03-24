import React, { useState, useEffect } from 'react'
import { Loader2, Search, PlusCircle, Users, Handshake, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  NEARIntentsService, 
  Intent, 
  IntentType, 
  IntentStatus,
  IntentMatch
} from '@/services/near-intents-service'

interface IntentMatcherProps {
  intentsService: NEARIntentsService
  onIntentCreated?: (intent: Intent) => void
  onMatchAccepted?: (match: IntentMatch) => void
  isDemoMode?: boolean
}

export function IntentMatcher({
  intentsService,
  onIntentCreated,
  onMatchAccepted,
  isDemoMode = false
}: IntentMatcherProps) {
  const [activeTab, setActiveTab] = useState<string>('find')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [intents, setIntents] = useState<Intent[]>([])
  const [myIntents, setMyIntents] = useState<Intent[]>([])
  const [matchParameters, setMatchParameters] = useState<{
    type: IntentType
    amount?: number
    description?: string
  }>({
    type: 'escrow_client',
    amount: undefined,
    description: undefined
  })
  
  // Load user's existing intents
  useEffect(() => {
    const loadMyIntents = async () => {
      try {
        setIsLoading(true)
        const userIntents = await intentsService.getMyIntents()
        setMyIntents(userIntents)
        setError(null)
      } catch (err) {
        console.error('Failed to load intents:', err)
        setError('Failed to load your intents')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadMyIntents()
  }, [intentsService])
  
  // Format amount for display
  const formatAmount = (amount?: number): string => {
    if (amount === undefined) return 'Any'
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    })
  }
  
  // Handle finding matching intents
  const handleFindMatches = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const matches = await intentsService.findMatchingIntents({
        type: matchParameters.type,
        amount: matchParameters.amount,
        parameters: {
          description: matchParameters.description
        }
      })
      
      setIntents(matches)
      
      if (matches.length === 0) {
        setError('No matching intents found. Try different parameters or create a new intent.')
      }
    } catch (err) {
      console.error('Failed to find matches:', err)
      setError('Failed to find matching intents')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle creating a new intent
  const handleCreateIntent = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!matchParameters.description) {
        setError('Please provide a description')
        return
      }
      
      const intent = await intentsService.createIntent({
        type: matchParameters.type,
        description: matchParameters.description || 'Escrow intent',
        amount: matchParameters.amount,
        parameters: {},
        expiresIn: 24 // 24 hours
      })
      
      setMyIntents(prev => [intent, ...prev])
      
      if (onIntentCreated) {
        onIntentCreated(intent)
      }
      
      // Switch to My Intents tab
      setActiveTab('my-intents')
      
    } catch (err) {
      console.error('Failed to create intent:', err)
      setError('Failed to create intent')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle accepting a match
  const handleAcceptMatch = async (intentId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // In a real implementation, we would:
      // 1. Create a match between the intents
      // 2. Get match ID
      // 3. Accept the match
      
      // For demo or simplified implementation:
      const matchId = `match-${Math.random().toString(36).substring(2, 9)}`
      const match = await intentsService.acceptMatch(matchId)
      
      if (onMatchAccepted) {
        onMatchAccepted(match)
      }
      
      // Remove the matched intent from the list
      setIntents(prev => prev.filter(i => i.id !== intentId))
      
    } catch (err) {
      console.error('Failed to accept match:', err)
      setError('Failed to accept the match')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle cancelling an intent
  const handleCancelIntent = async (intentId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      await intentsService.cancelIntent(intentId)
      
      // Update the local list
      setMyIntents(prev => prev.map(intent => 
        intent.id === intentId 
          ? { ...intent, status: 'cancelled' as IntentStatus } 
          : intent
      ))
      
    } catch (err) {
      console.error('Failed to cancel intent:', err)
      setError('Failed to cancel the intent')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Render the type badge
  const IntentTypeBadge = ({ type }: { type: IntentType }) => {
    let color = ''
    let icon = null
    
    switch(type) {
      case 'escrow_client':
        color = 'bg-blue-100 text-blue-800 border-blue-300'
        icon = <Users className="h-3 w-3 mr-1" />
        break
      case 'escrow_freelancer':
        color = 'bg-green-100 text-green-800 border-green-300'
        icon = <Handshake className="h-3 w-3 mr-1" />
        break
      case 'arbitrator':
        color = 'bg-purple-100 text-purple-800 border-purple-300'
        icon = <Users className="h-3 w-3 mr-1" />
        break
    }
    
    return (
      <Badge variant="outline" className={`flex items-center ${color}`}>
        {icon} {type === 'escrow_client' ? 'Client' : type === 'escrow_freelancer' ? 'Freelancer' : 'Arbitrator'}
      </Badge>
    )
  }
  
  // Render the status badge
  const StatusBadge = ({ status }: { status: IntentStatus }) => {
    let color = ''
    
    switch(status) {
      case 'open':
        color = 'bg-green-100 text-green-800 border-green-300'
        break
      case 'matched':
        color = 'bg-blue-100 text-blue-800 border-blue-300'
        break
      case 'completed':
        color = 'bg-gray-100 text-gray-800 border-gray-300'
        break
      case 'cancelled':
        color = 'bg-red-100 text-red-800 border-red-300'
        break
      case 'expired':
        color = 'bg-orange-100 text-orange-800 border-orange-300'
        break
    }
    
    return (
      <Badge variant="outline" className={color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center">
              NEAR Intents Matcher
              {isDemoMode && (
                <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-300">
                  Demo
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Find matching intents or create your own
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="find">Find Matches</TabsTrigger>
            <TabsTrigger value="my-intents">My Intents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="find" className="space-y-4">
            {/* Intent search parameters */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">I am a</label>
                  <select 
                    className="w-full rounded-md border border-input px-3 py-2"
                    value={matchParameters.type}
                    onChange={(e) => setMatchParameters(prev => ({
                      ...prev,
                      type: e.target.value as IntentType
                    }))}
                  >
                    <option value="escrow_client">Client (Looking for freelancer)</option>
                    <option value="escrow_freelancer">Freelancer (Looking for client)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Budget (ZEC)</label>
                  <Input 
                    type="number" 
                    placeholder="Any amount"
                    value={matchParameters.amount || ''}
                    onChange={(e) => setMatchParameters(prev => ({
                      ...prev,
                      amount: e.target.value ? parseFloat(e.target.value) : undefined
                    }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Input 
                  placeholder="Describe what you're looking for"
                  value={matchParameters.description || ''}
                  onChange={(e) => setMatchParameters(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleFindMatches}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Find Matches
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleCreateIntent}
                  disabled={isLoading || !matchParameters.description}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <PlusCircle className="h-4 w-4 mr-2" />
                  )}
                  Create Intent
                </Button>
              </div>
              
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
            
            <Separator />
            
            {/* Intent search results */}
            <div>
              <h3 className="text-sm font-medium mb-2">Matching Intents ({intents.length})</h3>
              
              {intents.length > 0 ? (
                <div className="space-y-3">
                  {intents.map(intent => (
                    <div 
                      key={intent.id}
                      className="border rounded-lg p-3 hover:border-primary transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <IntentTypeBadge type={intent.type} />
                        <StatusBadge status={intent.status} />
                      </div>
                      
                      <p className="font-medium mb-1">{intent.description}</p>
                      
                      {intent.amount && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Budget: {formatAmount(intent.amount)} ZEC
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(intent.createdAt).toLocaleDateString()}
                        </span>
                        
                        <Button 
                          size="sm"
                          onClick={() => handleAcceptMatch(intent.id)}
                          disabled={isLoading || intent.status !== 'open'}
                        >
                          {isLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : (
                            <Handshake className="h-3.5 w-3.5 mr-1" />
                          )}
                          Accept Match
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>Finding matches...</p>
                    </div>
                  ) : (
                    <p>No matching intents found. Try different search criteria or create a new intent.</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="my-intents" className="space-y-4">
            <h3 className="text-sm font-medium mb-2">Your Intents ({myIntents.length})</h3>
            
            {myIntents.length > 0 ? (
              <div className="space-y-3">
                {myIntents.map(intent => (
                  <div 
                    key={intent.id}
                    className="border rounded-lg p-3 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <IntentTypeBadge type={intent.type} />
                      <StatusBadge status={intent.status} />
                    </div>
                    
                    <p className="font-medium mb-1">{intent.description}</p>
                    
                    {intent.amount && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Budget: {formatAmount(intent.amount)} ZEC
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-muted-foreground">
                        Created {new Date(intent.createdAt).toLocaleDateString()}
                      </span>
                      
                      {intent.status === 'open' && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelIntent(intent.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : (
                            'Cancel Intent'
                          )}
                        </Button>
                      )}
                      
                      {intent.status === 'matched' && (
                        <Button 
                          size="sm"
                          variant="default"
                        >
                          View Escrow <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Loading your intents...</p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-3">You haven't created any intents yet.</p>
                    <Button 
                      onClick={() => setActiveTab('find')}
                      variant="outline"
                    >
                      Create Your First Intent
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground pt-0">
        <p>
          Powered by NEAR Protocol Intents. {isDemoMode && "Demonstration mode - no real blockchain interactions."}
        </p>
      </CardFooter>
    </Card>
  )
} 