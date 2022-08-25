import { gql } from "@apollo/client";
import { Muscle } from "./Muscles";

export interface Exercise
{
    id: number;
    name: string;
    muscles: Muscle[];
}

export const GET_EXERCISES = gql `
    query GetExercises 
    {
        exercise 
        {
            exercise_id
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

export const GET_EXERCISE_BY_ID = gql `
    query GetExerciseById($exerciseId: Int) 
    {
        exercise(where: {exercise_id: {_eq: $exerciseId}}) 
        {
            exercise_id
            exercise_name
            exercise_muscles 
            {
                muscle 
                {
                    muscle_id
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

export const ConvertQueryResultsToExercises: (results: any) => Exercise[] =
    (results) =>
        results === null || results === undefined ?
            results :
            results
                .exercise
                .map
                (
                    ex =>
                    (
                        {
                            id: ex.exercise_id,
                            name: ex.exercise_name,
                            muscles: 
                                ex
                                    .exercise_muscles
                                    .map
                                    (
                                        ex_muscle =>
                                        (
                                            {
                                                id: ex_muscle.muscle.muscle_id,
                                                anatomicalName: ex_muscle.muscle.muscle_long_desc,
                                                simpleName: ex_muscle.muscle.muscle_short_desc,
                                                muscleGroupName: ex_muscle.muscle.muscle_group.muscle_group_desc
                                            }
                                        )
                                    )
                        }
                    )
                );

export const InitExercise: () => Exercise =
() => 
(
    {
        id: -1,
        name: "Exercise",
        muscles: []
    }
);