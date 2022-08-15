import { FitnessCenter } from "@mui/icons-material";
import { Box, CardContent, CardMedia, SxProps, Theme } from "@mui/material";
import Card from "@mui/material/Card";
import React from "react";
import { Exercise } from "../../DataModel/Exercises";


export interface ExerciseCardProps
{
    sx?: SxProps<Theme>;
    exercise: Exercise | null;
}


const ExerciseCard = (props: ExerciseCardProps) =>
{
    const GetMuscleGroupIconPaths = () =>
    {
        return (
            props.exercise == null ?
                [] :
                props
                    .exercise
                    .muscles
                    .map
                    (
                        muscle => 
                        {
                            const iconFileName: string =
                                muscle.muscleGroupName.indexOf("/") > 0 ?
                                    muscle
                                        .muscleGroupName
                                        .substring(0, muscle.muscleGroupName.indexOf("/")) :
                                    muscle.muscleGroupName;

                            return `${process.env.PUBLIC_URL}/MuscleGroups/${iconFileName}.png`;
                        }
                    )
                    .filter
                    (
                        (value, index, self) => 
                            self.indexOf(value) === index
                    )
        )
    };


    return (
        <Card sx={{display: "flex", ...props.sx}}>
            <FitnessCenter 
                sx=
                {{
                    alignSelf: "center", 
                    marginLeft: "10px", 
                    fontSize: "80px",
                    color: "#CCCCCC"
                }} />
            <CardContent 
                sx=
                {{
                    display: "flex",
                    flexDirection: "column"
                }} >
                    <h2>
                        {props.exercise?.name ?? "Exercise"}
                    </h2>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    {
                        GetMuscleGroupIconPaths()
                            .map
                            (
                                iconPath =>
                                (
                                    <CardMedia 
                                        component="img"
                                        image={iconPath} 
                                        sx=
                                        {{
                                            maxWidth: "8vw"
                                        }}/>
                                )
                            )
                    }
                </Box>
            </CardContent>
        </Card>
    )
}

export default ExerciseCard;