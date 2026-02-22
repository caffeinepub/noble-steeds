import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetHorse } from '@/hooks/useQueries';
import { InjuryList } from '@/components/InjuryList';
import { InjuryForm } from '@/components/InjuryForm';
import { FeedingList } from '@/components/FeedingList';
import { FeedingForm } from '@/components/FeedingForm';
import { MedicineDosageList } from '@/components/MedicineDosageList';
import { MedicineDosageForm } from '@/components/MedicineDosageForm';
import { CareList } from '@/components/CareList';
import { CareForm } from '@/components/CareForm';

export function HorseDetailPage() {
  const { id } = useParams({ from: '/horses/$id' });
  const navigate = useNavigate();
  const horseId = BigInt(id);
  const { data: horse, isLoading } = useGetHorse(horseId);

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!horse) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Horse not found</h2>
          <Button onClick={() => navigate({ to: '/horses' })}>Back to Horses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate({ to: '/horses' })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Horses
      </Button>

      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-border">
                {horse.profilePhoto && (
                  <AvatarImage src={horse.profilePhoto.getDirectURL()} alt={horse.name} />
                )}
                <AvatarFallback className="text-2xl font-bold">
                  {horse.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-1">{horse.name}</h1>
                <p className="text-muted-foreground">Horse Profile</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="injuries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="injuries">Injuries</TabsTrigger>
          <TabsTrigger value="feeding">Feeding</TabsTrigger>
          <TabsTrigger value="medicine">Medicine</TabsTrigger>
          <TabsTrigger value="care">Care</TabsTrigger>
        </TabsList>

        <TabsContent value="injuries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Log Injury</CardTitle>
            </CardHeader>
            <CardContent>
              <InjuryForm horseId={horseId} />
            </CardContent>
          </Card>
          <InjuryList horseId={horseId} />
        </TabsContent>

        <TabsContent value="feeding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Log Feeding Event</CardTitle>
            </CardHeader>
            <CardContent>
              <FeedingForm horseId={horseId} />
            </CardContent>
          </Card>
          <FeedingList horseId={horseId} />
        </TabsContent>

        <TabsContent value="medicine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Record Medicine Dosage</CardTitle>
            </CardHeader>
            <CardContent>
              <MedicineDosageForm horseId={horseId} />
            </CardContent>
          </Card>
          <MedicineDosageList horseId={horseId} />
        </TabsContent>

        <TabsContent value="care" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Log Care Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <CareForm horseId={horseId} />
            </CardContent>
          </Card>
          <CareList horseId={horseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
