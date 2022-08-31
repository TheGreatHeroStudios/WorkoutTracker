import { AddAPhoto } from "@mui/icons-material";
import { CircularProgress, IconButton, Skeleton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import MuscleChart from "../Muscles/MuscleChart";
import { Muscle } from "../../DataModel/Muscles";
import { useFilePicker } from "use-file-picker";
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

    const { dataLoading: imageLoadingFromDatabase } =
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
                            //requestState.data = response.;
                        }

                        return requestState;
                    }
            }
        );

    const [openFileSelector, { filesContent, loading: imageLoadingFromFilePicker }] =
        useFilePicker
        (
            {
                readAs: "DataURL",
                accept: "image/*",
                multiple: false
            }
        );

    useEffect
    (
        () =>
        {
            if(filesContent.length && filesContent.length > 0)
            {
                SetExerciseImageBase64(filesContent[0].content);
            }
        },
        [filesContent]
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
                    imageLoadingFromDatabase || imageLoadingFromFilePicker ?
                        <CircularProgress color="primary" size="5vw" sx={{margin: "auto"}} />  :
                    exerciseImageBase64 === null ?
                        <IconButton onClick={() => openFileSelector()}>
                            <AddAPhoto
                                sx=
                                {{
                                    alignSelf: "center", 
                                    marginLeft: "10px", 
                                    fontSize: "40px",
                                    color: "#CCCCCC",
                                    width: "20vw"
                                }} />
                        </IconButton> :
                    <img alt="Exercise Thumbnail"
                        src={exerciseImageBase64} 
                        width="100px"
                        height="100px"
                        onClick={() => openFileSelector()} />
                }
            </div>
            <MuscleChart 
                selectedMuscles={exerciseMuscles}
                SelectedMusclesChanged={SetExerciseMuscles} />
        </div>
    );
}

export default EditExerciseForm;