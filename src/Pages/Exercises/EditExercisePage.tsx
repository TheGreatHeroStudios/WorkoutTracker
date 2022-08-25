import { useQuery } from "@apollo/client";
import { AddAPhoto } from "@mui/icons-material";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MuscleChart from "../../Components/Muscles/MuscleChart";
import { ConvertQueryResultsToExercises, GET_EXERCISE_BY_ID } from "../../DataModel/Exercises";
import { Muscle } from "../../DataModel/Muscles";

const EditExercisePage = () =>
{
    const { exerciseId } = useParams();

    const [exerciseName, SetExerciseName] = useState("");
    const [exerciseMuscles, SetExerciseMuscles] = useState<Muscle[]>([]);

    const setExerciseInContext = (exerciseData: any) =>
    {
        const exercises = 
            ConvertQueryResultsToExercises(exerciseData);

        if(exercises !== null && exercises !== undefined && exercises.length > 0)
        {
            SetExerciseName(exercises[0].name);
            SetExerciseMuscles(exercises[0].muscles);
        }
    }

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
                        (e) => SetExerciseName(e.target.value)
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
            <MuscleChart 
                selectedMuscles={exerciseMuscles}
                SelectedMusclesChanged={SetExerciseMuscles} />
        </div>
    );
}

export default EditExercisePage;