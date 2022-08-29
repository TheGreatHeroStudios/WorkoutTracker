import { useState } from "react";
import ExerciseList from "../../Components/Exercises/ExerciseList";
import { Exercise } from "../../DataModel/Exercises";
import EditExerciseForm from "../../Components/Exercises/EditExerciseForm";

const ExercisesPage = () =>
{
    const [exerciseInContext, SetExerciseInContext] = useState<Exercise>(null);

    return (
        exerciseInContext === null ?
            <ExerciseList 
                onEditExercise=
                {
                    (exercise) => SetExerciseInContext(exercise)
                }/> :
            <EditExerciseForm exerciseInContext={exerciseInContext}/>
    );
}

export default ExercisesPage;