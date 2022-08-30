import { AddAPhoto } from "@mui/icons-material";
import { IconButton, Skeleton, TextField } from "@mui/material";
import React, { useState } from "react";
import MuscleChart from "../Muscles/MuscleChart";
import { Muscle } from "../../DataModel/Muscles";
import { ImagePicker } from "react-file-picker";
import { Exercise } from "../../DataModel/Exercises";
import { RequestState, useGetRequest } from "../../Utility/RestClient";

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

    const [exerciseImageBase64, SetExerciseImageBase64] = useState<string>(null);

    const { dataLoading } =
        useGetRequest<string>
        (
            {
                resourcePath: "/exercise/image",
                queryParams: 
                [
                    {
                        paramName: "exerciseId", 
                        paramValue: `${props.exerciseInContext.exerciseId}`
                    }
                ],
                responseHandler:
                    (response) =>
                    {
                        const requestState: RequestState<string> =
                        {
                            dataLoading: false,
                            data: "",
                            error: ""
                        };

                        //If the response was anything but '200', do nothing
                        if(response.status === 200)
                        {
                            requestState.data = "";
                        }

                        return requestState;
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
                    }
                    sx={{paddingTop: "10px"}} />
                {
                    dataLoading ?
                        <Skeleton 
                            variant="rectangular" 
                            animation="pulse"
                            width="120px"
                            height="120px" /> :
                        <ImagePicker 
                            extensions={['jpg', 'jpeg', 'png']}
                            dims=
                            {{
                                minWidth: 100,
                                maxWidth: 500,
                                minHeight: 100,
                                maxHeigth: 500
                            }}
                            onChange=
                            {
                                base64 => SetExerciseImageBase64(base64)
                            } >
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
                }
            </div>
            <MuscleChart 
                selectedMuscles={exerciseMuscles}
                SelectedMusclesChanged={SetExerciseMuscles} />
        </div>
    );
}

export default EditExerciseForm;