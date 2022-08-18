import { gql } from "@apollo/client";

export interface Muscle
{
    anatomicalName: string;
    simpleName: string;
    muscleGroupName: string;
}

export interface MuscleGroup
{
    description: string;
    muscles: Muscle[];
}

export const GET_MUSCLES = gql `
    query GetMuscles 
    {
        c_muscle 
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
`;

export const ConvertQueryResultsToMuscles: (results: any) => Muscle[] =
    (results) =>
        results
            .c_muscle
            .map
            (
                cm =>
                (
                    {
                        anatomicalName: cm.muscle_long_desc,
                        simpleName: cm.muscle_short_desc,
                        muscleGroupName: cm.muscle_group.muscle_group_desc
                    }
                )
            );