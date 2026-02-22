import { useState } from 'react';
import { Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogCareActivity } from '@/hooks/useQueries';

interface CareFormProps {
  horseId: bigint;
}

export function CareForm({ horseId }: CareFormProps) {
  const [careType, setCareType] = useState('');
  const logCareActivityMutation = useLogCareActivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!careType.trim()) return;
    
    await logCareActivityMutation.mutateAsync({ horseId, careType: careType.trim() });
    
    setCareType('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="careType">Care Type</Label>
        <Input
          id="careType"
          value={careType}
          onChange={(e) => setCareType(e.target.value)}
          placeholder="e.g., thrush check, bath, tail wash, fungus check, hives"
          required
          disabled={logCareActivityMutation.isPending}
        />
      </div>

      <Button type="submit" disabled={logCareActivityMutation.isPending || !careType.trim()} className="w-full">
        {logCareActivityMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging Care...
          </>
        ) : (
          <>
            <Heart className="mr-2 h-4 w-4" />
            Log Care Activity
          </>
        )}
      </Button>
    </form>
  );
}
