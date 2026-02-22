import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useActivityTimeline } from '@/hooks/useActivityTimeline';
import { useGetAllHorses } from '@/hooks/useQueries';
import { ActivityTimelineItem } from '@/components/ActivityTimelineItem';

export function ActivityTimelinePage() {
  const [selectedHorseId, setSelectedHorseId] = useState<bigint | undefined>(undefined);
  const { data: horses = [] } = useGetAllHorses();
  const { activities, isLoading } = useActivityTimeline(selectedHorseId);

  const handleHorseChange = (value: string) => {
    if (value === 'all') {
      setSelectedHorseId(undefined);
    } else {
      setSelectedHorseId(BigInt(value));
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Activity Timeline</h1>
        <p className="text-muted-foreground">View all activities across your horses</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter by Horse</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedHorseId?.toString() || 'all'} onValueChange={handleHorseChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Horses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Horses</SelectItem>
              {horses.map((horse) => (
                <SelectItem key={horse.id.toString()} value={horse.id.toString()}>
                  {horse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No activities logged yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityTimelineItem key={`${activity.type}-${activity.id}`} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
