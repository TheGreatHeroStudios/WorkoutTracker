import { CircularProgress, Container } from "@mui/material";
import React from "react";
import ExerciseCard from "../../Components/Exercises/ExerciseCard";
import { Exercise } from "../../DataModel/Exercises";
import { ApplyBase64Formatting } from "../../Utility/ImageCropper";
import { useGetRequest } from "../../Utility/RestClient";

interface ExerciseListProps
{
    onEditExercise: (selectedExercise: Exercise) => void;
}

const ExerciseList = ({onEditExercise}: ExerciseListProps) =>
{
    const {dataLoading, data, error} = 
        useGetRequest<Exercise>
        (
            {
                resourcePath: "/exercise",
                queryParams:
                    [
                        {paramName: "pageIndex", paramValue: "0"},
                        {paramName: "count", paramValue: "10"}
                    ],
            }
        );

    return (
        dataLoading ?
            <CircularProgress color="primary" size="15vw" sx={{margin: "auto"}} />  :
        error ?    
            <h1>Error loading exercise data: {error}</h1> :
            <Container 
                sx=
                {{
                    height: "78vh",
                    overflowY: "scroll"
                }} >
                {
                    data &&
                    (data as Exercise[])
                        .map
                        (
                            ex =>
                            {
                                ex.exerciseImageBase64 =
                                    ex.exerciseImageBase64 && 
                                    ex.exerciseImageBase64.length > 0 ?
                                        ApplyBase64Formatting
                                        (
                                            ex.exerciseImageBase64,
                                            "png"
                                        ) :
                                        null;

                                return (
                                    <ExerciseCard 
                                        key={ex.exerciseId}
                                        exercise={ex}
                                        onEditExercise={onEditExercise}
                                        sx=
                                        {{
                                            maxWidth: "90vw",
                                            height: "12vh",
                                            marginTop: "20px",
                                            padding: "10px"
                                        }} />
                                );
                            }
                        )   
                }
            </Container>
    );
}

export default ExerciseList;