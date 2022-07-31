import { useQuery } from "@apollo/client";
import React from "react";
import { GET_MUSCLE_GROUPS } from "../../DataModel/MuscleGroups";

const AddExercisePage = () =>
{
    const { loading, error, data } = useQuery(GET_MUSCLE_GROUPS);

    return (
        <div>
        </div>
    );
}

export default AddExercisePage;