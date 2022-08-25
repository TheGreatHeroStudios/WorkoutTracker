import { useQuery } from "@apollo/client";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { ConvertQueryResultsToMuscles, GET_MUSCLES, Muscle } from "../../DataModel/Muscles";

interface MuscleChartProps
{
    chartWidth?: number;
    chartHeight?: number;
    selectedMuscles: Muscle[];
}

const muscleImageRootPath = `${process.env.PUBLIC_URL}/Muscles/`;
const defaultDimensions = {width: 350, height: 328};


const GetRelativeMouseCoordinate = (e) =>
{
    const targetRect = e.target.getBoundingClientRect();

    const mouseCoordinate =
        {
            x: Math.floor(e.clientX - targetRect.left),
            y: Math.floor(e.clientY - targetRect.top)
        };

    //alert(`Coordinates of Click: ${mouseCoordinate.x}, ${mouseCoordinate.y}`);

    return mouseCoordinate;
}


const MuscleChart = ({chartWidth, chartHeight, selectedMuscles}: MuscleChartProps) =>
{
    chartWidth = chartWidth ?? defaultDimensions.width;
    chartHeight = chartHeight ?? defaultDimensions.height;
    
    const [muscleList, SetMuscleList] = useState<Muscle[]>([]);
    const [muscleMap, SetMuscleMap] = useState<number[][]>([]);
    const [muscleMapLoaded, SetMuscleMapLoaded] = useState<boolean>(false);
    const [focusedMuscle, SetFocusedMuscle] = useState<Muscle>(null);

    const LoadMuscleMap = (muscles: Muscle[]) =>
    {
        console.log("Loading muscle map...");

        if(muscles?.length > 0)
        {
            //Map each muscle to an image element on a virtual canvas
            //and iterate over the pixels for each to build a lookup
            //wherein a specific pixel maps to a specific muscle id.
            let indexedPixels: number[][] =
                Array
                    .apply(null, Array(chartWidth))
                    .map
                    (
                        col => 
                            Array
                                .apply(null, Array(chartHeight))
                                .map
                                (
                                    pixelIndex => -1
                                )
                    );

            const IndexPixels = 
                (muscleId: number, renderingContext: CanvasRenderingContext2D) =>
                {
                    renderingContext
                        .getImageData(0, 0, chartWidth, chartHeight)
                        .data
                        .filter
                        (
                            //Take only the alpha component of each pixel
                            //(every fourth element in the array)
                            (colorComponent, idx) => (idx + 1) % 4 === 0
                        )
                        .forEach
                        (
                            //If any pixel in the muscle image is not fully transparent
                            //and corresponds to a pixel in the map not already belonging
                            //to another muscle, store the current muscle's id in the map.
                            (pixelAlpha, idx) => 
                            {
                                if(pixelAlpha > 0)
                                {
                                    const col = idx % chartWidth;
                                    const row = Math.floor(idx / chartHeight);

                                    if(indexedPixels[col][row] === -1)
                                    {
                                        indexedPixels[col][row] = muscleId;
                                        //console.log(`Muscle Found! (Muscle Id: ${muscleId} at pixel index ${col}, ${row})`);
                                    }
                                }
                            }
                        );
                }

            //Map each muscle to a promise that loads its respective
            //image and resolves once the pixels have been indexed.
            const imageLoadPromises =
                muscles
                    .map
                    (
                        (muscle) =>
                            new Promise
                            (
                                (resolve, reject) =>
                                {
                                    const img = new Image(chartWidth, chartHeight);
                                    img.src = `${muscleImageRootPath}${muscle.anatomicalName}.png`;
                                    img.onerror = reject;
                                    img.onload = 
                                        () =>
                                        {
                                            const canvas = document.createElement("canvas");
                                            canvas.width = chartWidth;
                                            canvas.height = chartHeight;
                                            canvas.getContext("2d").drawImage(img, 0, 0, chartWidth, chartHeight);
                                            
                                            IndexPixels(muscle.id, canvas.getContext("2d"));
                                            resolve(true);
                                        };
                                }
                            )
                        
                    );            

            //Once all muscle images have loaded and been indexed, set
            //the muscle map and loaded state for the rest of the control.
            Promise
                .all(imageLoadPromises)
                .then
                (
                    () =>
                    {
                        SetMuscleMap(indexedPixels);
                        SetMuscleMapLoaded(true);
                        console.log("Muscle map loaded successfully!");
                    }
                );
        }
    }

    const UpdateFocusedMuscle = (e) =>
    {
        const mouseCoordinates = GetRelativeMouseCoordinate(e);

        if
        (
            muscleMapLoaded &&
            mouseCoordinates !== undefined && 
            mouseCoordinates !== null &&
            mouseCoordinates.x < chartWidth &&
            mouseCoordinates.y < chartHeight
        )
        {
            const muscleId = muscleMap[mouseCoordinates.x][mouseCoordinates.y];

            if(muscleId !== (focusedMuscle?.id ?? -1))
            {
                //If the focused muscle changed, update its state
                const targetMuscle =
                    muscleList
                        .filter
                        (
                            muscle => muscle.id === muscleId
                        )[0];

                if(targetMuscle !== undefined && targetMuscle !== null)
                {
                    SetFocusedMuscle(targetMuscle);
                }
                else
                {
                    SetFocusedMuscle(null);
                }
            }
        }
    }

    useQuery
    (
        GET_MUSCLES,
        {
            onCompleted:
                (queryResults) =>
                {
                    const muscles =
                        ConvertQueryResultsToMuscles(queryResults);

                    SetMuscleList(muscles);

                    if(muscles.length > 0 && !muscleMapLoaded)
                    {
                        LoadMuscleMap(muscles);
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
            style={{width: chartWidth, height: chartHeight}} 
            onMouseMove={(e) => UpdateFocusedMuscle(e)}
            onClick={GetRelativeMouseCoordinate}>
            <img 
                style={{position: "absolute", left: "0px"}}
                src={`${muscleImageRootPath}MuscleChart.png`} 
                alt="MuscleChart"
                width={chartWidth}
                height={chartHeight}/>
                <div>
                {
                    selectedMuscles
                        .map
                        (
                            muscle =>
                                muscle !== null && muscle !== undefined &&
                                <img 
                                    id={muscle.id.toString()}
                                    key={muscle.id}
                                    style={{position: "absolute", left: "0px"}}
                                    src={`${muscleImageRootPath}${muscle.anatomicalName}.png`} 
                                    alt={muscle.simpleName}
                                    width={chartWidth}
                                    height={chartHeight}/>
                        )
                }
                </div>
        </div>
    );
}

export default MuscleChart;