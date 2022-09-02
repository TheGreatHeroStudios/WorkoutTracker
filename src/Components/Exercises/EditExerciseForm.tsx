import { AddAPhoto } from "@mui/icons-material";
import { Button, CircularProgress, Dialog, IconButton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import MuscleChart from "../Muscles/MuscleChart";
import { Muscle } from "../../DataModel/Muscles";
import { useFilePicker } from "use-file-picker";
import { Exercise } from "../../DataModel/Exercises";
import { executePutRequest, RequestState, useGetRequest } from "../../Utility/RestClient";
import ImageCropper, { StripBase64Formatting } from "../../Utility/ImageCropper";
import { WorkoutTrackerPageProps } from "../../Pages/WorkoutTrackerPageProps";
import { AppShellAction } from "../../Layout/AppShell";

interface EditExerciseFormProps
{
    exerciseInContextState:
        [
            exerciseInContext: Exercise, 
            SetExerciseInContext: (exerciseInContext: Exercise) => void
        ]
}

const EditExerciseForm = 
(
    props: EditExerciseFormProps & WorkoutTrackerPageProps
) =>
{
    const [appShellActions, SetAppShellActions] = props.appShellActionState;
    const [exerciseInContext, SetExerciseInContext] = props.exerciseInContextState;

    props
        .SetPageTitle
        (
            exerciseInContext.exerciseId === -1 ? 
                "New Exercise" : 
                "Edit Exercise"
        );

    const [exerciseName, SetExerciseName] = 
        useState(exerciseInContext.exerciseName);

    const [exerciseMuscles, SetExerciseMuscles] = 
        useState<Muscle[]>(exerciseInContext.muscles);

    const [exerciseImageBase64, SetExerciseImageBase64] = 
        useState<string>(exerciseInContext.exerciseImageBase64);

    const [croppedExerciseImageBase64, SetCroppedExerciseImageBase64] = 
        useState<string>(exerciseInContext.exerciseImageBase64);

    const [exerciseDescription, SetExerciseDescription] =
        useState<string>(exerciseInContext.exerciseDescription);

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
                SetCroppedExerciseImageBase64(null);
            }
        },
        [filesContent]
    );

    const FormatPutBody = 
        () =>
        (
            {
                exerciseId: exerciseInContext.exerciseId,
                exerciseName: exerciseName,
                exerciseDescription: exerciseDescription,
                exerciseImageBase64: 
                    croppedExerciseImageBase64 ? 
                        StripBase64Formatting(croppedExerciseImageBase64) :
                        null,
                muscleIds:
                    exerciseMuscles
                        .map
                        (
                            muscle =>
                                muscle.muscleId
                        )
            }
        );

    useEffect
    (
        () =>
            SetAppShellActions
            (
                new Map<AppShellAction, () => void>
                (
                    [
                        [
                            "Save", 
                            () =>
                                executePutRequest
                                (
                                    {
                                        resourcePath: "/exercise",
                                        requestBody: FormatPutBody(),
                                        onComplete: (queryResults) => 
                                            {
                                                SetExerciseInContext(null);
                                                SetAppShellActions(null);
                                                props.SetPageTitle(null);
                                            }
                                    }
                                )
                        ]
                    ]
                )
            )
    )

    return (
        <div>
            <Dialog 
                PaperProps=
                {
                    {
                        style: 
                        {
                            backgroundColor: "transparent",
                            boxShadow: "none"
                        }
                    }
                }
                open=
                {
                    exerciseImageBase64 !== null && 
                    croppedExerciseImageBase64 === null
                } >
                <ImageCropper 
                    uncroppedImgSrc={exerciseImageBase64}
                    onImageCropped=
                    {
                        (croppedImgSrc) => 
                            SetCroppedExerciseImageBase64(croppedImgSrc)
                    } />
            </Dialog>
            <div 
                style=
                {{
                    display: "flex", 
                    flexDirection: "column",
                    paddingLeft: "20px",
                    paddingTop: "20px"
                }}>
                <div style={{display: "flex", flexDirection: "row", alignItems: "flex-end"}}>
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
                        imageLoadingFromFilePicker ?
                            <CircularProgress color="primary" size="5vw" sx={{margin: "auto"}} />  :
                        croppedExerciseImageBase64 === null ?
                            <IconButton onClick={() => openFileSelector()}>
                                <AddAPhoto
                                    sx=
                                    {{
                                        alignSelf: "center", 
                                        marginLeft: "5px", 
                                        fontSize: "40px",
                                        color: "#CCCCCC",
                                        width: "20vw"
                                    }} />
                            </IconButton> :
                        <img alt="Exercise Thumbnail"
                            src={croppedExerciseImageBase64} 
                            width="80px"
                            height="80px"
                            style={{marginLeft: "15px"}}
                            onClick={() => openFileSelector()} />
                    }
                </div>
                <MuscleChart 
                    selectedMuscles={exerciseMuscles}
                    SelectedMusclesChanged={SetExerciseMuscles} />
                <TextField
                    id="outlined-multiline-static"
                    label="Exercise Description"
                    multiline
                    rows="3"
                    value={exerciseDescription ?? ""}
                    onChange=
                    {
                        (e) => SetExerciseDescription(e.target.value)
                    }
                    sx={{marginTop: "10px"}} />
            </div>
        </div>
    );
}

export default EditExerciseForm;