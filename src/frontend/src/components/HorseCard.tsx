import { useNavigate } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteHorse } from '@/hooks/useQueries';
import type { Horse } from '@/backend';

interface HorseCardProps {
  horse: Horse;
}

export function HorseCard({ horse }: HorseCardProps) {
  const navigate = useNavigate();
  const deleteHorseMutation = useDeleteHorse();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteHorseMutation.mutateAsync(horse.id);
  };

  const handleCardClick = () => {
    navigate({ to: '/horses/$id', params: { id: horse.id.toString() } });
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCardClick}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            {horse.profilePhoto && (
              <AvatarImage src={horse.profilePhoto.getDirectURL()} alt={horse.name} />
            )}
            <AvatarFallback className="text-xl font-bold">
              {horse.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold truncate">{horse.name}</h3>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {horse.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the horse and all associated data including injuries, feeding events, medicine dosages, and care activities.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
