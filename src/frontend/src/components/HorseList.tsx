import { useGetAllHorses } from '@/hooks/useQueries';
import { HorseCard } from './HorseCard';
import { Loader2 } from 'lucide-react';

export function HorseList() {
  const { data: horses = [], isLoading } = useGetAllHorses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (horses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No horses yet. Add your first horse to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {horses.map((horse) => (
        <HorseCard key={horse.id.toString()} horse={horse} />
      ))}
    </div>
  );
}
