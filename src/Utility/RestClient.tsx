import { useEffect, useState } from "react";

interface RestRequestProps
{
    resourcePath: string;
    queryParams?: {paramName: string, paramValue: string}[];
    onComplete?: (queryResults: any) => void;
    onError?: (error: string) => void;
}

export function useGetRequest<TResult>
(
    {
        resourcePath, 
        queryParams, 
        onComplete, 
        onError
    }: RestRequestProps
)
{
    const [dataLoading, SetDataLoading] = useState(false);
    const [error, SetError] = useState<string>("");
    const [data, SetData] = useState<TResult[]>([]);
    
    const GetData =
        () =>
        {
            let queryString = "";
            if(queryParams && queryParams.length > 0)
            {
                queryString += "?";
                queryParams
                    .forEach
                    (
                        param =>
                            queryString += 
                                `${param.paramName}=${param.paramValue}&`
                    );
                queryString =
                    queryString.substring(0, queryString.length - 1);
            }
            
            fetch
            (
                `${resourcePath}${queryString}`
            )
            .then
            (
                response => {
                    response
                        .json()
                        .then
                        (
                            queryResults => 
                            {
                                SetData(queryResults);
                                
                                SetDataLoading(false);

                                if
                                (
                                    onComplete !== undefined && 
                                    onComplete !== null
                                )
                                {
                                    onComplete(queryResults);
                                }
                            },
                            rejectReason =>
                            {
                                SetError(JSON.stringify(rejectReason));

                                if
                                (
                                    onError !== undefined && 
                                    onError !== null
                                )
                                {
                                    onError(JSON.stringify(rejectReason));
                                }

                                SetDataLoading(false);
                            }
                        )},
                error => 
                {
                    SetError(error.message);

                    if
                    (
                        onError !== undefined && 
                        onError !== null
                    )
                    {
                        onError(error.message);
                    }

                    SetDataLoading(false);
                }
            );
        };
    
    useEffect
    (
        () =>
        {
            if
            (
                dataLoading === false && 
                data.length === 0 &&
                !error
            )
            {
                GetData();
                SetDataLoading(true);
            }
        },
        [dataLoading, data, error]
    );

    return {dataLoading, data, error};
}