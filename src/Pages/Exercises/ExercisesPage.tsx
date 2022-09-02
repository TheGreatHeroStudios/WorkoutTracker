import { useState } from "react";
import ExerciseList from "../../Components/Exercises/ExerciseList";
import { Exercise } from "../../DataModel/Exercises";
import EditExerciseForm from "../../Components/Exercises/EditExerciseForm";
import { WorkoutTrackerPageProps } from "../WorkoutTrackerPageProps";

const ExercisesPage = ({ onPageTitleOverridden }: WorkoutTrackerPageProps) =>
{
    const [exerciseInContext, SetExerciseInContext] = useState<Exercise>(null);

    return (
        exerciseInContext === null ?
            <ExerciseList 
                onEditExercise=
                {
                    (exercise) => SetExerciseInContext(exercise)
                }/> :
            <EditExerciseForm 
                exerciseInContext={exerciseInContext}
                onPageTitleOverridden={onPageTitleOverridden}/>
    );
}

export default ExercisesPage;