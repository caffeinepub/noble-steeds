import { AlertCircle, Apple, Pill, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from '@/lib/utils';
import type { Activity } from '@/hooks/useActivityTimeline';

interface ActivityTimelineItemProps {
  activity: Activity;
}

export function ActivityTimelineItem({ activity }: ActivityTimelineItemProps) {
  const getIcon = () => {
    switch (activity.type) {
      case 'injury':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'feeding':
        return <Apple className="h-5 w-5 text-accent-foreground" />;
      case 'medicine':
        return <Pill className="h-5 w-5 text-primary" />;
      case 'care':
        return <Heart className="h-5 w-5 text-primary" />;
    }
  };

  const getIconBg = () => {
    switch (activity.type) {
      case 'injury':
        return 'bg-destructive/10';
      case 'feeding':
        return 'bg-accent';
      case 'medicine':
        return 'bg-primary/10';
      case 'care':
        return 'bg-primary/10';
    }
  };

  const getTypeLabel = () => {
    switch (activity.type) {
      case 'injury':
        return 'Injury';
      case 'feeding':
        return 'Feeding';
      case 'medicine':
        return 'Medicine';
      case 'care':
        return 'Care';
    }
  };

  const getVariant = () => {
    switch (activity.type) {
      case 'injury':
        return 'destructive' as const;
      case 'feeding':
        return 'secondary' as const;
      case 'medicine':
        return 'default' as const;
      case 'care':
        return 'default' as const;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="shrink-0">
            <div className={`h-10 w-10 rounded-full ${getIconBg()} flex items-center justify-center`}>
              {getIcon()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={getVariant()}>{getTypeLabel()}</Badge>
              <span className="text-sm font-medium">{activity.horseName}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {formatTimestamp(activity.timestamp)}
            </p>
            <p className="text-sm">{activity.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
