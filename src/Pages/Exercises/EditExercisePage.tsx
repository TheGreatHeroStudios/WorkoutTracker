import { useQuery } from "@apollo/client";
import { AddAPhoto } from "@mui/icons-material";
import { TextField } from "@mui/material";
import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { ConvertQueryResultsToExercises, Exercise, GET_EXERCISE_BY_ID, InitExercise } from "../../DataModel/Exercises";
import { ConvertQueryResultsToMuscles, GET_MUSCLES, Muscle } from "../../DataModel/Muscles";
import UpdateObject from "../../Utility/UpdateObject";

const EditExercisePage = () =>
{
    const { exerciseId } = useParams();

    const [muscleList, setMuscleList] = useState<Muscle[]>([]);
    const [exerciseName, setExerciseName] = useState("Exercise");

    const setExerciseInContext = (exerciseData: any) =>
    {
        const exercises = 
            ConvertQueryResultsToExercises(exerciseData);

        if(exercises !== null && exercises !== undefined && exercises.length > 0)
        {
            setExerciseName(exercises[0].name);
        }
    }

    useQuery
    (
        GET_MUSCLES,
        {
            onCompleted:
                (queryResults) =>
                {
                    const muscles =
                        ConvertQueryResultsToMuscles(queryResults);

                    if(muscles.length > 0)
                    {
                        setMuscleList(muscles);
                    }
                },
            onError:
                (error) =>
                {
                    console.log(error.message);
                }
        }
    );

    useQuery
    (
        GET_EXERCISE_BY_ID,
        {
            variables: 
            {
                exerciseId: exerciseId ?? -1,
            },
            onCompleted:
                (queryResults) => setExerciseInContext(queryResults),
            onError:
                (error) =>
                {
                    console.log(error.message);
                }
        }
    );

    return (
        <div 
            style=
            {{
                display: "flex", 
                flexDirection: "column",
                paddingLeft: "20px",
                paddingTop: "20px"
            }}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    required
                    id="outlined-required"
                    label="Exercise Name"
                    value={exerciseName ?? "New Exercise"}
                    onChange=
                    {
                        (e) => setExerciseName(e.target.value)
                    } />
                <AddAPhoto
                    sx=
                    {{
                        alignSelf: "center", 
                        marginLeft: "10px", 
                        fontSize: "40px",
                        color: "#CCCCCC",
                        width: "20vw"
                    }} />
            </div>
            <div>
                <img 
                    style={{position: "relative"}}
                    src={`${process.env.PUBLIC_URL}/Muscles/MuscleChart.png`} 
                    alt="MuscleChart"
                    width="300px"/>
                {
                    muscleList
                        .map
                        (
                            muscle =>
                                <img 
                                    key={muscle.id}
                                    style={{position: "absolute", left: "40px"}}
                                    src={`${process.env.PUBLIC_URL}/Muscles/${muscle.anatomicalName}.png`} 
                                    alt={muscle.simpleName}
                                    width="300px"/>
                        )
                }
            </div>
        </div>
    );
}

export default EditExercisePage;