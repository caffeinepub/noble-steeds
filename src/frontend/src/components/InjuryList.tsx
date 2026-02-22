import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetHorseInjuries } from '@/hooks/useQueries';
import { formatTimestamp } from '@/lib/utils';

interface InjuryListProps {
  horseId: bigint;
}

export function InjuryList({ horseId }: InjuryListProps) {
  const { data: injuries = [], isLoading } = useGetHorseInjuries(horseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (injuries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No injuries logged</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {injuries.map((injury) => (
        <Card key={injury.id.toString()}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">
                  {formatTimestamp(injury.timestamp)}
                </p>
                <p className="text-sm">{injury.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
