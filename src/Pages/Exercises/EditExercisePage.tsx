import { useQuery } from "@apollo/client";
import { AddAPhoto } from "@mui/icons-material";
import { IconButton, Skeleton, TextField } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MuscleChart from "../../Components/Muscles/MuscleChart";
import { ConvertQueryResultsToExercises, GET_EXERCISE_BY_ID } from "../../DataModel/Exercises";
import { Muscle } from "../../DataModel/Muscles";
import { ImagePicker } from "react-file-picker";

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

    const { loading: exerciseDataLoading } =
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
            {
                exerciseDataLoading ?
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <Skeleton 
                            animation="wave" 
                            width="250px" 
                            height="100px"
                            sx={{marginTop: "-15px"}} />
                        <Skeleton 
                            variant="rectangular"
                            animation="pulse" 
                            width="20vw" 
                            height="20vw"
                            sx={{marginLeft: "10px"}} />
                    </div> :
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Exercise Name"
                            value={exerciseName ?? "New Exercise"}
                            onChange=
                            {
                                (e) => SetExerciseName(e.target.value)
                            }
                            sx={{paddingTop: "10px"}} />
                        <ImagePicker extensions={['jpg', 'jpeg', 'png']}>
                            <IconButton>
                                <AddAPhoto
                                    sx=
                                    {{
                                        alignSelf: "center", 
                                        marginLeft: "10px", 
                                        fontSize: "40px",
                                        color: "#CCCCCC",
                                        width: "20vw"
                                    }} />
                            </IconButton>
                        </ImagePicker>
                    </div>
            }
            <MuscleChart 
                selectedMuscles={exerciseMuscles}
                SelectedMusclesChanged={SetExerciseMuscles} />
        </div>
    );
}

export default EditExercisePage;