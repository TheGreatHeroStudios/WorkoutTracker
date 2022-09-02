import { useEffect, useState } from "react";
import ExerciseList from "../../Components/Exercises/ExerciseList";
import { Exercise } from "../../DataModel/Exercises";
import EditExerciseForm from "../../Components/Exercises/EditExerciseForm";
import { WorkoutTrackerPageProps } from "../WorkoutTrackerPageProps";
import { AppShellAction } from "../../Layout/AppShell";

const ExercisesPage = 
    (
        { SetPageTitle, appShellActionState }: WorkoutTrackerPageProps
    ) =>
    {
        const [appShellActions, SetAppShellActions] = appShellActionState;
        const [exerciseInContext, SetExerciseInContext] = useState<Exercise>(null);

        useEffect
        (
            () =>
            {
                if(!exerciseInContext)
                {
                    SetAppShellActions
                    (
                        new Map<AppShellAction, () => void>
                        (
                            [
                                [
                                    "Add", 
                                    () => 
                                    {
                                        SetExerciseInContext
                                        (
                                            {
                                                exerciseId: -1,
                                                exerciseName: "New Exercise",
                                                exerciseDescription: null,
                                                exerciseImageBase64: null,
                                                muscles: []
                                            }
                                        )
                                    }
                                ]
                            ]
                        )
                    )
                }
            }
        )

        return (
            exerciseInContext === null ?
                <ExerciseList 
                    onEditExercise=
                    {
                        (exercise) => SetExerciseInContext(exercise)
                    }/> :
                <EditExerciseForm 
                    exerciseInContextState={[exerciseInContext, SetExerciseInContext]}
                    SetPageTitle={SetPageTitle}
                    appShellActionState={appShellActionState}/>
        );
    }

export default ExercisesPage;