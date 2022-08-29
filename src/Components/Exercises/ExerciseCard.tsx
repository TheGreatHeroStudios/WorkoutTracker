import { Edit, PhotoCamera } from "@mui/icons-material";
import { Box, CardContent, CardMedia, IconButton, SxProps, Theme, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Exercise } from "../../DataModel/Exercises";


export interface ExerciseCardProps
{
    sx?: SxProps<Theme>;
    exercise: Exercise | null;
    onEditExercise: (selectedExercise: Exercise) => void;
}

const ExerciseCard = (props: ExerciseCardProps) =>
{
    const navigate = useNavigate();

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
        <Card sx=
            {{
                display: "flex", 
                flexDirection: "row",
                ...props.sx
            }} >
            <PhotoCamera 
                sx=
                {{
                    alignSelf: "center", 
                    marginLeft: "10px", 
                    fontSize: "60px",
                    color: "#CCCCCC",
                    width: "20vw"
                }} />
            <CardContent 
                sx=
                {{
                    display: "flex",
                    flexDirection: "column",
                    width: "60vw",
                    justifyContent: "left"
                }} >
                <Typography 
                    component="div" 
                    variant="subtitle1"
                    sx=
                    {{
                        alignSelf: "start", 
                        fontWeight: "bold"
                    }}>
                    {props.exercise?.exerciseName ?? "Exercise"}
                </Typography>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    {
                        GetMuscleGroupIconPaths()
                            .map
                            (
                                iconPath =>
                                (
                                    <CardMedia 
                                        key={iconPath}
                                        component="img"
                                        image={iconPath} 
                                        sx=
                                        {{
                                            maxWidth: "10vw"
                                        }}/>
                                )
                            )
                    }
                </Box>
            </CardContent>
            <Box 
                sx=
                {{
                    display: "flex", 
                    flexDirection: "column",
                    width: "10vw",
                    justifyItems: "center"
                }} >
                <IconButton onClick={() => props.onEditExercise(props.exercise)}>
                    <Edit sx={{fontSize: 25, marginTop: "2vh", marginRight: "2vw"}}/>
                </IconButton>
            </Box>
        </Card>
    )
}

export default ExerciseCard;