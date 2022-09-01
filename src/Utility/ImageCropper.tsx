import { Button, Typography } from "@mui/material";
import { useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { CanvasCropPreview } from "./CanvasCropPreview";

export const ApplyBase64Formatting =
    (base64Src: string, format: "png" | "jpg" | "jpeg" | "gif") =>
        `data:image/${format};base64,${base64Src}`;

export const StripBase64Formatting =
        (formattedBase64: string) =>
            formattedBase64.startsWith("data:image/") ?
                formattedBase64
                    .substring
                    (
                        formattedBase64.indexOf(",") + 1
                    ) :
                formattedBase64;

interface ImageCropperProps
{
    uncroppedImgSrc: string;
    onImageCropped?: (croppedImgSrc: string) => void;
}

const ImageCropper = ({uncroppedImgSrc, onImageCropped}: ImageCropperProps) =>
{
    const uncroppedImgRef = useRef<HTMLImageElement>();
    
    const [currentCrop, SetCurrentCrop] = 
        useState<Crop>
        (
            {
                unit: "%",
                x: 50,
                y: 50,
                width: 100,
                height: 100
            }
        );

    const [completedCrop, SetCompletedCrop] = useState<PixelCrop>();

    const SetInitialCrop = 
        (width: number, height: number) =>
        {
            SetCurrentCrop
            (
                centerCrop
                (
                    makeAspectCrop
                    (
                        {
                            unit: "%",
                            width: 90
                        },
                        1,
                        width,
                        height
                    ),
                    width,
                    height
                )
            );
        };

    const CropImage =
        () =>
        {
            let croppedImgSrc = uncroppedImgSrc;

            if(uncroppedImgRef?.current && completedCrop)
            {
                const canvas = document.createElement("canvas");
                
                CanvasCropPreview
                (
                    uncroppedImgRef.current,
                    canvas,
                    completedCrop
                );

                croppedImgSrc = canvas.toDataURL();
            }

            onImageCropped(croppedImgSrc);
        };

    return (
        <div 
            style=
            {{
                display: "flex", 
                flexDirection: "column"
            }} >
            <Typography 
                variant="h5"
                sx=
                {{
                    color: "white",
                    marginBottom: "20px"
                }} 
                textAlign="center">
                Crop Exercise Image
            </Typography>
            <ReactCrop
                onChange={(_crop, percentCrop) => SetCurrentCrop(percentCrop)}
                onComplete={(pixelCrop) => SetCompletedCrop(pixelCrop)}
                crop={currentCrop}
                aspect={1}
                minWidth={100}
                minHeight={100}
                maxWidth={500}
                maxHeight={500}
                keepSelection={true} >
                <img 
                    ref={uncroppedImgRef}
                    alt="Exercise Thumbnail" 
                    src={uncroppedImgSrc} 
                    onLoad=
                    {
                        (e) => 
                            SetInitialCrop
                            (
                                e.currentTarget.naturalWidth,
                                e.currentTarget.naturalHeight
                            )
                    }
                    style={{maxWidth: "90vw", maxHeight: "50vh"}} />
            </ReactCrop>
            <Button
                sx=
                {{
                    color: "white",
                    outlineColor: "white",
                    outlineWidth: "2px",
                    outlineStyle: "solid",
                    width: "50%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "20px",
                    marginBottom: "2px"
                }}
                onClick={() => CropImage()}>
                Accept Crop
            </Button>
        </div>
    );
};

export default ImageCropper;