import { Muscle } from "./Muscles";

export interface Exercise
{
    exerciseId: number;
    exerciseName: string;
    exerciseDescription: string;
    exerciseImageBase64: string;
    muscles: Muscle[];
}