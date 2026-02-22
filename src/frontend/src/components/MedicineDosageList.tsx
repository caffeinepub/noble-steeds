import { Loader2, Pill } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetHorseMedicineDosages } from '@/hooks/useQueries';
import { formatTimestamp } from '@/lib/utils';

interface MedicineDosageListProps {
  horseId: bigint;
}

export function MedicineDosageList({ horseId }: MedicineDosageListProps) {
  const { data: medicineDosages = [], isLoading } = useGetHorseMedicineDosages(horseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (medicineDosages.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No medicine dosages recorded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {medicineDosages.map((dosage) => (
        <Card key={dosage.id.toString()}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Pill className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">
                  {formatTimestamp(dosage.timestamp)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">{dosage.medicine}</span> - {dosage.dosage.toString()} {dosage.unit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
