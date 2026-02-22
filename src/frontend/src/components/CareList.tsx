import { Loader2, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCareActivities } from '@/hooks/useQueries';
import { formatTimestamp } from '@/lib/utils';

interface CareListProps {
  horseId: bigint;
}

export function CareList({ horseId }: CareListProps) {
  const { data: careActivities = [], isLoading } = useCareActivities(horseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (careActivities.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No care activities logged</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {careActivities.map((activity) => (
        <Card key={activity.id.toString()}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">
                  {formatTimestamp(activity.timestamp)}
                </p>
                <p className="text-sm font-medium">{activity.careType}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
