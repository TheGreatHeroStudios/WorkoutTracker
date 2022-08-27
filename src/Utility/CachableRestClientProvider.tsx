import { createContext, useContext, useState } from "react";

interface CachableRestClientContextProps
{
    useCacheableGetRequest?: 
        <TResult> (
            resourcePath: string, 
            queryParams: {paramName: string, paramValue: string}[],
            mutator?: (queryResults: any) => TResult | any
        ) => {result: TResult | any, loading: boolean, errorMessage: string }
}

const CachableRestClientContext = 
    createContext<CachableRestClientContextProps>(undefined);

export function useCacheableGetRequest<TResult>
(
    resourcePath: string, 
    queryParams: {paramName: string, paramValue: string}[],
    mutator?: (queryResults: any) => TResult | any
)
{
    return (
        useContext(CachableRestClientContext)
            .useCacheableGetRequest
            (
                resourcePath,
                queryParams,
                mutator
            )
    );
}

const CachableRestClientProvider = 
(
    {children}, 
    baseUrl: string, 
    cacheExpirationSeconds: number
) =>
{
    const [requestCache, SetRequestCache] = 
        useState<{pathKey: string, cachedData: any, timestamp: number}[]>([]);

    function ExecuteCachableGetRequest<TResult>
    (
        resource: string, 
        queryParams: {paramName: string, paramValue: string}[],
        mutator?: (queryResults: any) => TResult | any,
        forceRefetch: boolean = false
    )
    {
        //Purge out any cache elements that have expired.
        SetRequestCache
        (
            requestCache
                .filter
                (
                    cacheItem =>
                        (Math.abs(new Date().getTime() - cacheItem.timestamp) / 1000) < 
                        cacheExpirationSeconds
                )
        )

        const queryTuple = {result: null, loading: true, errorMessage: null};

        //Append the resource and any query parameters to the request path
        let requestPath = resource;

        if(queryParams.length > 0)
        {
            requestPath += "?";

            queryParams
                .forEach
                (
                    param =>
                        requestPath += `${param.paramName}=${param.paramValue}`
                );
        }

        //Attempt to retrieve the data from the
        //cache by looking up the request string
        queryTuple.result = requestCache[requestPath];

        if
        (
            queryTuple.result === undefined || 
            queryTuple.result === null ||
            forceRefetch
        )
        {
            //If the query is not cached (or a refetch is requested)
            //retrieve the data by making a new REST request.
            /*const client = new Client();

            client.get
            (
                `${baseUrl}${requestPath}`,
                (data, response) =>
                {
                    //If a mutator was provided, use it 
                    //to transform the query results
                    queryTuple.result = 
                        mutator !== null && mutator !== undefined ?
                            mutator(data) :
                            data; 

                    //Add the request string and data to the cache
                    requestCache[requestPath] = 
                        {
                            cacheData: queryTuple.result,
                            timestamp: new Date().getTime()
                        };

                    queryTuple.loading = false;
                }
            );*/
        }
        else
        {
            queryTuple.loading = false;
        }

        return queryTuple;
    };

    return (
        <CachableRestClientContext.Provider 
            value=
            {
                {
                    useCacheableGetRequest: ExecuteCachableGetRequest,
                }
            } >
            {children}
        </CachableRestClientContext.Provider>
    );
}

export default CachableRestClientProvider;