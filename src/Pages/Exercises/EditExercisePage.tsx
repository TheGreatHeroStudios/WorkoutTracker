import { useQuery } from "@apollo/client";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import { ConvertQueryResultsToExercises, Exercise, GET_EXERCISE_BY_ID } from "../../DataModel/Exercises";
import { GET_MUSCLES } from "../../DataModel/Muscles";

interface EditExerciseProps
{
    exerciseId?: number
}

const EditExercisePage = (props: EditExerciseProps) =>
{
    const [exerciseInContext, setExerciseInContext] = useState<Exercise>();

    useQuery(GET_MUSCLES);

    useQuery
    (
        GET_EXERCISE_BY_ID,
        {
            variables: props.exerciseId ?? -1,
            onCompleted: 
                (queryResults) =>
                {
                    const exercise = 
                        ConvertQueryResultsToExercises(queryResults);

                    if(exercise.length > 0)
                    {
                        setExerciseInContext(exercise[0]);
                    }
                }
        }
    );

    return (
        <div>
            <TextField
                required
                id="filled-required"
                label="Exercise Name"
                defaultValue={exerciseInContext?.name}
                variant="filled" />
        </div>
    );
}

export default EditExercisePage;