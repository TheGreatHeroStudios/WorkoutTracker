import { useQuery } from "@apollo/client";
import { AddAPhoto } from "@mui/icons-material";
import { TextField } from "@mui/material";
import React, { useReducer } from "react";
import { useParams } from "react-router-dom";
import { ConvertQueryResultsToExercises, Exercise, GET_EXERCISE_BY_ID, InitExercise } from "../../DataModel/Exercises";
import { GET_MUSCLES } from "../../DataModel/Muscles";
import UpdateObject from "../../Utility/UpdateObject";

const EditExercisePage = () =>
{
    const { exerciseId } = useParams();

    const [exerciseInContext, updateExerciseInContext] = 
        useReducer(UpdateObject<Exercise>, InitExercise());

    useQuery(GET_MUSCLES);

    useQuery
    (
        GET_EXERCISE_BY_ID,
        {
            variables: 
            {
                exerciseId: exerciseId ?? -1,
            },
            onCompleted: 
                (queryResults) =>
                {
                    const exercise = 
                        ConvertQueryResultsToExercises(queryResults);

                    if(exercise.length > 0)
                    {
                        updateExerciseInContext
                        (
                            {
                                propertyValue: exercise[0]
                            }
                        );
                    }
                },
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
                    defaultValue={exerciseInContext?.name ?? "New Exercise"}
                    onChange=
                    {
                        (e) => 
                        {
                            updateExerciseInContext
                            (
                                {
                                    propertyName: "name",
                                    propertyValue: e.target.value
                                }
                            )
                        }
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
            <div>
                <img 
                    style={{position: "absolute"}}
                    src={`${process.env.PUBLIC_URL}/Muscles/MuscleChart.png`} 
                    alt="MuscleChart"
                    width="300px"/>
                <img 
                    style={{position: "relative"}}
                    src={`${process.env.PUBLIC_URL}/Muscles/Triceps.png`} 
                    alt="Triceps"
                    width="300px"/>
            </div>
        </div>
    );
}

export default EditExercisePage;