import { useEffect, useState } from "react";
import { getReasonPhrase } from "http-status-codes";


export interface RequestState<TResult>
{
    dataLoading: boolean;
    data: TResult[] | TResult;
    error: string;
}


interface RestRequestProps<TResult>
{
    resourcePath: string;
    queryParams?: {paramName: string, paramValue: string}[];
    requestBody?: any;
    responseHandler?: (response: Response) => RequestState<TResult>
    onComplete?: (queryResults: any) => void;
    onError?: (error: string) => void;
}


function FormatQueryString
(
    queryParams?: {paramName: string, paramValue: string}[]
)
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

    return queryString;
}


export function executePutRequest
(
    {
        resourcePath, 
        queryParams,
        requestBody, 
        onComplete, 
        onError
    }: RestRequestProps<any>
)
{
    const queryString = FormatQueryString(queryParams);

    fetch
    (
        `${resourcePath}${queryString}`,
        {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers: 
            {
                'Content-Type': 'application/json'
            }
        }
    )
    .then
    (
        response =>
        {
            if(response.status >= 400)
            {
                //If the response status was in the error range (4xx or 5xx)
                //set the error based on the response code received.
                const errorMessage =
                    `PUT request failed with status code '${response.status}' (${getReasonPhrase(response.status)})`;
                
                if
                (
                    onError !== undefined && 
                    onError !== null
                )
                {
                    onError(errorMessage);
                }
            }
            else
            {
                if
                (
                    onComplete !== undefined && 
                    onComplete !== null
                )
                {
                    onComplete(null);
                }
            }
        }
    );
}


export function useGetRequest<TResult>
(
    {
        resourcePath, 
        queryParams, 
        responseHandler,
        onComplete, 
        onError
    }: RestRequestProps<TResult>
)
{
    const [dataLoading, SetDataLoading] = useState(false);
    const [error, SetError] = useState<string>("");
    const [data, SetData] = useState<TResult[] | TResult>(null);
    
    const InvokeRequest =
        () =>
        {
            const queryString = FormatQueryString(queryParams);
            
            fetch
            (
                `${resourcePath}${queryString}`,
                {
                    method: 'GET',
                    headers: 
                    {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then
            (
                response => 
                {
                    if(responseHandler !== null && responseHandler !== undefined)
                    {
                        //If a custom response handler was provided, use it to
                        //process the raw response from the fetch operation and
                        //use the returned state object to update local state.
                        const requestState = responseHandler(response);
                        SetDataLoading(requestState.dataLoading);
                        SetError(requestState.error);
                        SetData(requestState.data);
                    }
                    else
                    {
                        if(response.status >= 400)
                        {
                            //If the response status was in the error range (4xx or 5xx)
                            //set the error based on the response code received.
                            const errorMessage =
                                `GET request failed with status code '${response.status}' (${getReasonPhrase(response.status)})`;
                            
                            SetError(errorMessage);
                            
                            if
                            (
                                onError !== undefined && 
                                onError !== null
                            )
                            {
                                onError(errorMessage);
                            }

                            SetDataLoading(false);
                        }
                        else
                        {
                            //If the response was successful, (and no custom handler was provided) 
                            //convert the response to json, and use it to set the 'data' state.
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
                                )
                        }
                    }
                },
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
                data === null &&
                !error
            )
            {
                SetData([]);
                InvokeRequest();
                SetDataLoading(true);
            }
        },
        [dataLoading, data, error]
    );

    return {dataLoading, data, error};
}