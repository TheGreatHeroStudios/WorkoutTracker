import { useQuery } from "@apollo/client";
import { Container } from "@mui/material";
import React from "react";
import ExerciseCard from "../../Components/Exercises/ExerciseCard";
import { GET_EXERCISES, ConvertQueryResultsToExercises } from "../../DataModel/Exercises";

const ExercisesPage = () =>
{
    const { loading, error, data } = useQuery(GET_EXERCISES);
    //const testData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        loading ?
            <h1>Loading...</h1> :
        error ?    
            <h1>Error loading exercise data: {error.message}</h1> :
            <Container 
                sx=
                {{
                    height: "78vh",
                    overflowY: "scroll"
                }} >
                {
                    ConvertQueryResultsToExercises(data)
                        .map
                        (
                            ex =>
                            (
                                <ExerciseCard 
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