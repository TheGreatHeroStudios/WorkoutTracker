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

export const GET_MUSCLE_GROUPS = gql `
    query GetMuscleGroups 
    {
        c_muscle_group 
        {
            muscle_group_desc
            muscles 
            {
                muscle_long_desc
                muscle_short_desc
            }
        }
    }
`;