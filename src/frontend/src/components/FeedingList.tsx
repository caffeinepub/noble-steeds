import { Loader2, Apple } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetHorseFeedingEvents } from '@/hooks/useQueries';
import { formatTimestamp } from '@/lib/utils';

interface FeedingListProps {
  horseId: bigint;
}

export function FeedingList({ horseId }: FeedingListProps) {
  const { data: feedingEvents = [], isLoading } = useGetHorseFeedingEvents(horseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (feedingEvents.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No feeding events logged</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {feedingEvents.map((event) => (
        <Card key={event.id.toString()}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                  <Apple className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">
                  {formatTimestamp(event.timestamp)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">{event.feedType}</span> - {event.amount.toString()} lbs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
