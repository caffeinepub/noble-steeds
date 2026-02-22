import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ActivityTimelineItem } from '@/components/ActivityTimelineItem';
import { useActivityTimeline } from '@/hooks/useActivityTimeline';

interface ActivityTimelineProps {
  selectedHorseId?: bigint;
}

export function ActivityTimeline({ selectedHorseId }: ActivityTimelineProps) {
  const { activities, isLoading } = useActivityTimeline(selectedHorseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No activities to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityTimelineItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
