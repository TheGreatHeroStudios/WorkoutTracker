import { useQuery } from "@apollo/client";
import { stringifyForDisplay } from "@apollo/client/utilities";
import { Box, Container } from "@mui/material";
import React from "react";
import ExerciseCard from "../../Components/Exercises/ExerciseCard";
import { GET_EXERCISES, ConvertQueryResults } from "../../DataModel/Exercises";

const ExercisesPage = () =>
{
    const { loading, error, data } = useQuery(GET_EXERCISES);
    //const test: number[] = [1, 2, 3];

    return (
        loading ?
            <h1>Loading...</h1> :
        error ?    
            <h1>Error loading exercise data: {error.message}</h1> :
            <Container>
                {
                    ConvertQueryResults(data)
                        .map
                        (
                            ex =>
                            (
                                <ExerciseCard 
                                    exercise={ex}
                                    sx=
                                    {{
                                        maxWidth: "90vw",
                                        maxHeight: "15vh",
                                        marginTop: "20px"
                                    }} />
                            )
                        )   
                }
            </Container>  
    );
}

export default ExercisesPage;