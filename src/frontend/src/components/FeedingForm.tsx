import { useState } from 'react';
import { Loader2, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogFeedingEvent } from '@/hooks/useQueries';

interface FeedingFormProps {
  horseId: bigint;
}

export function FeedingForm({ horseId }: FeedingFormProps) {
  const [feedType, setFeedType] = useState('');
  const [amount, setAmount] = useState('');
  const logFeedingEventMutation = useLogFeedingEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedType.trim() || !amount) return;

    const amountBigInt = BigInt(amount);
    
    await logFeedingEventMutation.mutateAsync({ 
      horseId, 
      feedType: feedType.trim(), 
      amount: amountBigInt 
    });
    
    setFeedType('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="feedType">Feed Type</Label>
        <Input
          id="feedType"
          value={feedType}
          onChange={(e) => setFeedType(e.target.value)}
          placeholder="e.g., Hay, Grain, Pellets"
          required
          disabled={logFeedingEventMutation.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (lbs)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in pounds"
          min="0"
          step="0.1"
          required
          disabled={logFeedingEventMutation.isPending}
        />
      </div>

      <Button type="submit" disabled={logFeedingEventMutation.isPending || !feedType.trim() || !amount} className="w-full">
        {logFeedingEventMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging Feeding...
          </>
        ) : (
          <>
            <Apple className="mr-2 h-4 w-4" />
            Log Feeding Event
          </>
        )}
      </Button>
    </form>
  );
}
