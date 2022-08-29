import { AddAPhoto } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import MuscleChart from "../Muscles/MuscleChart";
import { Muscle } from "../../DataModel/Muscles";
import { ImagePicker } from "react-file-picker";
import { Exercise } from "../../DataModel/Exercises";

interface EditExerciseFormProps
{
    exerciseInContext: Exercise;
}

const EditExerciseForm = (props: EditExerciseFormProps) =>
{
    const [exerciseName, SetExerciseName] = 
        useState(props.exerciseInContext.exerciseName);

    const [exerciseMuscles, SetExerciseMuscles] = 
        useState<Muscle[]>(props.exerciseInContext.muscles);

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
            <MuscleChart 
                selectedMuscles={exerciseMuscles}
                SelectedMusclesChanged={SetExerciseMuscles} />
        </div>
    );
}

export default EditExerciseForm;