import { useQuery } from "@apollo/client";
import { CircularProgress, Container } from "@mui/material";
import React from "react";
import ExerciseCard from "../../Components/Exercises/ExerciseCard";
import { GET_EXERCISES, ConvertQueryResultsToExercises } from "../../DataModel/Exercises";
import { useCacheableGetRequest } from "../../Utility/CachableRestClientProvider";

const ExercisesPage = () =>
{
    const {result, loading, errorMessage} =
        useCacheableGetRequest
        (
            "exercise/",
            [
                {paramName: "pageIndex", paramValue: "0"},
                {paramName: "count", paramValue: "10"},
            ]
        );

    //const { loading, error, data } = useQuery(GET_EXERCISES);
    //const testData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        loading ?
            <CircularProgress color="primary" size="15vw" sx={{margin: "auto"}} />  :
        errorMessage ?    
            <h1>Error loading exercise data: {errorMessage}</h1> :
            <Container 
                sx=
                {{
                    height: "78vh",
                    overflowY: "scroll"
                }} >
                {
                    ConvertQueryResultsToExercises(result)
                        .map
                        (
                            ex =>
                            (
                                <ExerciseCard 
                                    key={ex.id}
                                    exercise={ex}
                                    sx=
                                    {{
                                        maxWidth: "90vw",
                                        height: "12vh",
                                        marginTop: "20px"
                                    }} />
                            )
                        )   
                }
            </Container>  
    );
}

export default ExercisesPage;