import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MedicineDosage {
    id: bigint;
    dosage: bigint;
    horseId: bigint;
    unit: string;
    medicine: string;
    timestamp: bigint;
}
export interface Horse {
    id: bigint;
    name: string;
    profilePhoto?: ExternalBlob;
}
export interface FeedingEvent {
    id: bigint;
    horseId: bigint;
    feedType: string;
    timestamp: bigint;
    amount: bigint;
}
export interface Injury {
    id: bigint;
    horseId: bigint;
    description: string;
    timestamp: bigint;
}
export interface CareActivity {
    id: bigint;
    horseId: bigint;
    userId: Principal;
    timestamp: bigint;
    careType: string;
}
export interface backendInterface {
    addHorse(name: string, profilePhoto: ExternalBlob | null): Promise<bigint>;
    deleteHorse(id: bigint): Promise<void>;
    getAllHorses(): Promise<Array<Horse>>;
    getCareActivitiesForHorse(horseId: bigint): Promise<Array<CareActivity>>;
    getHorse(id: bigint): Promise<Horse>;
    getHorseFeedingEvents(horseId: bigint): Promise<Array<FeedingEvent>>;
    getHorseInjuries(horseId: bigint): Promise<Array<Injury>>;
    getHorseMedicineDosages(horseId: bigint): Promise<Array<MedicineDosage>>;
    logCareActivity(horseId: bigint, careType: string): Promise<CareActivity>;
    logFeedingEvent(horseId: bigint, feedType: string, amount: bigint): Promise<bigint>;
    logInjury(horseId: bigint, description: string): Promise<bigint>;
    recordMedicineDosage(horseId: bigint, medicine: string, dosage: bigint, unit: string): Promise<bigint>;
}
