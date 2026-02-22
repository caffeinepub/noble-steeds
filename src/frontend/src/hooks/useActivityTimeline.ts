import { useMemo } from 'react';
import { useGetAllHorses, useGetHorseInjuries, useGetHorseFeedingEvents, useGetHorseMedicineDosages, useCareActivities } from './useQueries';

export interface Activity {
  id: string;
  type: 'injury' | 'feeding' | 'medicine' | 'care';
  horseId: bigint;
  horseName: string;
  timestamp: bigint;
  description: string;
}

export function useActivityTimeline(selectedHorseId?: bigint) {
  const { data: horses = [], isLoading: horsesLoading } = useGetAllHorses();
  
  const filteredHorses = useMemo(() => {
    if (selectedHorseId !== undefined) {
      return horses.filter(h => h.id === selectedHorseId);
    }
    return horses;
  }, [horses, selectedHorseId]);

  // Fetch data for each horse - hooks must be called at top level
  const horse0Injuries = useGetHorseInjuries(filteredHorses[0]?.id || BigInt(0));
  const horse0Feeding = useGetHorseFeedingEvents(filteredHorses[0]?.id || BigInt(0));
  const horse0Medicine = useGetHorseMedicineDosages(filteredHorses[0]?.id || BigInt(0));
  const horse0Care = useCareActivities(filteredHorses[0]?.id || BigInt(0));
  
  const horse1Injuries = useGetHorseInjuries(filteredHorses[1]?.id || BigInt(0));
  const horse1Feeding = useGetHorseFeedingEvents(filteredHorses[1]?.id || BigInt(0));
  const horse1Medicine = useGetHorseMedicineDosages(filteredHorses[1]?.id || BigInt(0));
  const horse1Care = useCareActivities(filteredHorses[1]?.id || BigInt(0));
  
  const horse2Injuries = useGetHorseInjuries(filteredHorses[2]?.id || BigInt(0));
  const horse2Feeding = useGetHorseFeedingEvents(filteredHorses[2]?.id || BigInt(0));
  const horse2Medicine = useGetHorseMedicineDosages(filteredHorses[2]?.id || BigInt(0));
  const horse2Care = useCareActivities(filteredHorses[2]?.id || BigInt(0));
  
  const horse3Injuries = useGetHorseInjuries(filteredHorses[3]?.id || BigInt(0));
  const horse3Feeding = useGetHorseFeedingEvents(filteredHorses[3]?.id || BigInt(0));
  const horse3Medicine = useGetHorseMedicineDosages(filteredHorses[3]?.id || BigInt(0));
  const horse3Care = useCareActivities(filteredHorses[3]?.id || BigInt(0));
  
  const horse4Injuries = useGetHorseInjuries(filteredHorses[4]?.id || BigInt(0));
  const horse4Feeding = useGetHorseFeedingEvents(filteredHorses[4]?.id || BigInt(0));
  const horse4Medicine = useGetHorseMedicineDosages(filteredHorses[4]?.id || BigInt(0));
  const horse4Care = useCareActivities(filteredHorses[4]?.id || BigInt(0));

  const allQueries = [
    horse0Injuries, horse0Feeding, horse0Medicine, horse0Care,
    horse1Injuries, horse1Feeding, horse1Medicine, horse1Care,
    horse2Injuries, horse2Feeding, horse2Medicine, horse2Care,
    horse3Injuries, horse3Feeding, horse3Medicine, horse3Care,
    horse4Injuries, horse4Feeding, horse4Medicine, horse4Care,
  ];

  const isLoading = horsesLoading || allQueries.some(q => q.isLoading);

  const activities = useMemo(() => {
    const allActivities: Activity[] = [];

    const queriesData = [
      { injuries: horse0Injuries.data, feeding: horse0Feeding.data, medicine: horse0Medicine.data, care: horse0Care.data },
      { injuries: horse1Injuries.data, feeding: horse1Feeding.data, medicine: horse1Medicine.data, care: horse1Care.data },
      { injuries: horse2Injuries.data, feeding: horse2Feeding.data, medicine: horse2Medicine.data, care: horse2Care.data },
      { injuries: horse3Injuries.data, feeding: horse3Feeding.data, medicine: horse3Medicine.data, care: horse3Care.data },
      { injuries: horse4Injuries.data, feeding: horse4Feeding.data, medicine: horse4Medicine.data, care: horse4Care.data },
    ];

    filteredHorses.forEach((horse, index) => {
      if (index >= queriesData.length) return;
      
      const { injuries = [], feeding = [], medicine = [], care = [] } = queriesData[index];

      // Add injuries
      injuries.forEach(injury => {
        allActivities.push({
          id: injury.id.toString(),
          type: 'injury',
          horseId: horse.id,
          horseName: horse.name,
          timestamp: injury.timestamp,
          description: injury.description,
        });
      });

      // Add feeding events
      feeding.forEach(feedingEvent => {
        allActivities.push({
          id: feedingEvent.id.toString(),
          type: 'feeding',
          horseId: horse.id,
          horseName: horse.name,
          timestamp: feedingEvent.timestamp,
          description: `${feedingEvent.feedType} - ${feedingEvent.amount.toString()} lbs`,
        });
      });

      // Add medicine dosages
      medicine.forEach(medicineEvent => {
        allActivities.push({
          id: medicineEvent.id.toString(),
          type: 'medicine',
          horseId: horse.id,
          horseName: horse.name,
          timestamp: medicineEvent.timestamp,
          description: `${medicineEvent.medicine} - ${medicineEvent.dosage.toString()} ${medicineEvent.unit}`,
        });
      });

      // Add care activities
      care.forEach(careActivity => {
        allActivities.push({
          id: careActivity.id.toString(),
          type: 'care',
          horseId: horse.id,
          horseName: horse.name,
          timestamp: careActivity.timestamp,
          description: careActivity.careType,
        });
      });
    });

    // Sort by timestamp descending (most recent first)
    return allActivities.sort((a, b) => {
      const aTime = Number(a.timestamp);
      const bTime = Number(b.timestamp);
      return bTime - aTime;
    });
  }, [
    filteredHorses,
    horse0Injuries.data, horse0Feeding.data, horse0Medicine.data, horse0Care.data,
    horse1Injuries.data, horse1Feeding.data, horse1Medicine.data, horse1Care.data,
    horse2Injuries.data, horse2Feeding.data, horse2Medicine.data, horse2Care.data,
    horse3Injuries.data, horse3Feeding.data, horse3Medicine.data, horse3Care.data,
    horse4Injuries.data, horse4Feeding.data, horse4Medicine.data, horse4Care.data,
  ]);

  return { activities, isLoading };
}
