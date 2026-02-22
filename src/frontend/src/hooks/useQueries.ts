import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Horse, Injury, FeedingEvent, MedicineDosage, CareActivity } from '@/backend';
import { ExternalBlob } from '@/backend';

// Horse queries
export function useGetAllHorses() {
  const { actor, isFetching } = useActor();

  return useQuery<Horse[]>({
    queryKey: ['horses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHorses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetHorse(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Horse>({
    queryKey: ['horse', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getHorse(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useAddHorse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, profilePhoto }: { name: string; profilePhoto: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addHorse(name, profilePhoto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horses'] });
    },
  });
}

export function useDeleteHorse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (horseId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteHorse(horseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horses'] });
    },
  });
}

// Injury queries
export function useGetHorseInjuries(horseId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Injury[]>({
    queryKey: ['injuries', horseId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHorseInjuries(horseId);
    },
    enabled: !!actor && !isFetching && horseId !== undefined,
  });
}

export function useLogInjury() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ horseId, description }: { horseId: bigint; description: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.logInjury(horseId, description);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['injuries', variables.horseId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['activityTimeline'] });
    },
  });
}

// Feeding queries
export function useGetHorseFeedingEvents(horseId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<FeedingEvent[]>({
    queryKey: ['feedingEvents', horseId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHorseFeedingEvents(horseId);
    },
    enabled: !!actor && !isFetching && horseId !== undefined,
  });
}

export function useLogFeedingEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ horseId, feedType, amount }: { horseId: bigint; feedType: string; amount: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.logFeedingEvent(horseId, feedType, amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['feedingEvents', variables.horseId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['activityTimeline'] });
    },
  });
}

// Medicine queries
export function useGetHorseMedicineDosages(horseId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<MedicineDosage[]>({
    queryKey: ['medicineDosages', horseId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHorseMedicineDosages(horseId);
    },
    enabled: !!actor && !isFetching && horseId !== undefined,
  });
}

export function useRecordMedicineDosage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ horseId, medicine, dosage, unit }: { horseId: bigint; medicine: string; dosage: bigint; unit: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.recordMedicineDosage(horseId, medicine, dosage, unit);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medicineDosages', variables.horseId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['activityTimeline'] });
    },
  });
}

// Care Activity queries
export function useCareActivities(horseId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<CareActivity[]>({
    queryKey: ['careActivities', horseId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCareActivitiesForHorse(horseId);
    },
    enabled: !!actor && !isFetching && horseId !== undefined,
  });
}

export function useLogCareActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ horseId, careType }: { horseId: bigint; careType: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.logCareActivity(horseId, careType);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['careActivities', variables.horseId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['activityTimeline'] });
    },
  });
}
