import { Delete, Edit, FitnessCenter } from "@mui/icons-material";
import { Box, CardContent, CardMedia, SxProps, Theme, Typography } from "@mui/material";
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
        <Card sx=
            {{
                display: "flex", 
                flexDirection: "row",
                ...props.sx
            }} >
            <FitnessCenter 
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
                        fontWeight: "bold",
                        //marginBottom: "1vh"
                    }}>
                    {props.exercise?.name ?? "Exercise"}
                </Typography>
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
                <Edit sx={{fontSize: 25, marginTop: "2vh", marginRight: "3vw"}}/>
                <Delete sx={{fontSize: 25, marginTop: "2vh", marginRight: "3vw"}}/>
            </Box>
        </Card>
    )
}

export default ExerciseCard;