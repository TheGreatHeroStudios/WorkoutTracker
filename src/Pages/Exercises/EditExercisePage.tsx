import { useQuery } from "@apollo/client";
import { TextField } from "@mui/material";
import React, { useState, useReducer } from "react";
import { useParams } from "react-router-dom";
import { ConvertQueryResultsToExercises, Exercise, GET_EXERCISE_BY_ID, InitExercise } from "../../DataModel/Exercises";
import { GET_MUSCLES } from "../../DataModel/Muscles";
import UpdateObject from "../../Utility/UpdateObject";

const EditExercisePage = () =>
{
    const { exerciseId } = useParams();

    const [exerciseInContext, updateExerciseInContext] = 
        useReducer(UpdateObject<Exercise>, InitExercise());

    useQuery(GET_MUSCLES);

    const { data, loading } =
        useQuery
        (
            GET_EXERCISE_BY_ID,
            {
                variables: 
                {
                    exerciseId: exerciseId ?? -1,
                },
                onCompleted: 
                    (queryResults) =>
                    {
                        const exercise = 
                            ConvertQueryResultsToExercises(queryResults);

                        if(exercise.length > 0)
                        {
                            updateExerciseInContext
                            (
                                {
                                    propertyValue: exercise[0]
                                }
                            );
                        }
                    },
                onError:
                    (error) =>
                    {
                        console.log(error.message);
                    }
            }
        );

    return (
        <div>
            <TextField
                required
                id="outlined-required"
                label="Exercise Name"
                defaultValue={exerciseInContext?.name ?? "New Exercise"}
                onChange=
                {
                    (e) => 
                    {
                        updateExerciseInContext
                        (
                            {
                                propertyName: "name",
                                propertyValue: e.target.value
                            }
                        )
                    }
                } />
        </div>
    );
}

export default EditExercisePage;