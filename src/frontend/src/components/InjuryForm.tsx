import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLogInjury } from '@/hooks/useQueries';

interface InjuryFormProps {
  horseId: bigint;
}

export function InjuryForm({ horseId }: InjuryFormProps) {
  const [description, setDescription] = useState('');
  const logInjuryMutation = useLogInjury();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) return;
    
    await logInjuryMutation.mutateAsync({ horseId, description: description.trim() });
    
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Injury Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the injury..."
          rows={4}
          required
          disabled={logInjuryMutation.isPending}
        />
      </div>

      <Button type="submit" disabled={logInjuryMutation.isPending || !description.trim()} className="w-full">
        {logInjuryMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging Injury...
          </>
        ) : (
          <>
            <AlertCircle className="mr-2 h-4 w-4" />
            Log Injury
          </>
        )}
      </Button>
    </form>
  );
}
