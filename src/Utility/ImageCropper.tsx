import { Button, Typography } from "@mui/material";
import { maxWidth } from "@mui/system";
import { useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps
{
    uncroppedImgSrc: string;
    onImageCropped?: (croppedImgSrc: string) => void;
}

const ImageCropper = ({uncroppedImgSrc, onImageCropped}: ImageCropperProps) =>
{
    const uncroppedImage = useRef<HTMLImageElement>();
    
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

            if(uncroppedImage?.current && completedCrop)
            {
                const canvas = document.createElement("canvas");
                canvas.width = completedCrop.width;
                canvas.height = completedCrop.height;
                canvas
                    .getContext("2d")
                    .drawImage
                    (
                        uncroppedImage.current, 
                        0, 
                        0, 
                        completedCrop.width, 
                        completedCrop.height
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
                    ref={uncroppedImage}
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