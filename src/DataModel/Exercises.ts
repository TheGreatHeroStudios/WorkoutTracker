import { gql } from "@apollo/client";
import { Muscle } from "./MuscleGroups";

export interface Exercise
{
    name: string;
    muscles: Muscle[];
}

export const GET_EXERCISES = gql `
    query GetExercises 
    {
        exercise 
        {
            exercise_name
            exercise_muscles 
            {
                muscle 
                {
                    muscle_short_desc
                    muscle_long_desc
                    muscle_group 
                    {
                        muscle_group_desc
                    }
                }
            }
        }
    }  
`

export const ConvertQueryResults: (results: any) => Exercise[] =
    (results) =>
        results
            .exercise
            .map
            (
                ex =>
                (
                    {
                        name: ex.exercise_name,
                        muscles: 
                            ex
                                .exercise_muscles
                                .map
                                (
                                    ex_muscle =>
                                    (
                                        {
                                            anatomicalName: ex_muscle.muscle.muscle_long_desc,
                                            simpleName: ex_muscle.muscle.muscle_short_desc,
                                            muscleGroupName: ex_muscle.muscle.muscle_group.muscle_group_desc
                                        }
                                    )
                                )
                    }
                )
            );