import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface QueryResponseData<TResult>
{
    result: TResult[] | any[];
    loading: boolean;
    errorMessage: string;
}

export interface CachableRestClientContextProps
{
    useCacheableGetRequest?: 
        <TResult> (
            resourcePath: string, 
            queryParams: {paramName: string, paramValue: string}[],
            mutator: (queryResults: any) => TResult[]
        ) => QueryResponseData<TResult>
}

const CachableRestClientContext = 
    createContext<CachableRestClientContextProps>(undefined);

export function useCacheableGetRequest<TResult>
(
    resourcePath: string, 
    queryParams: {paramName: string, paramValue: string}[],
    mutator: (queryResults: any) => TResult[]
)
{
    return (
        useContext(CachableRestClientContext)
            .useCacheableGetRequest<TResult>
            (
                resourcePath,
                queryParams,
                mutator
            )
    );
}

export interface CachableRestClientProviderProps
{
    children: ReactNode;
    baseUrl: string;
    cacheExpirationSeconds: number;
}

export interface QueryCacheEntry<TResult>
{
    pathKey: string;
    cachedData: TResult[] | any[];
    timestamp: number;
}

const CachableRestClientProvider = 
    (props: CachableRestClientProviderProps) =>
    {
        let [requestCache, SetRequestCache] = useState<QueryCacheEntry<any>[]>([]);

        function ExecuteCachableGetRequest<TResult>
        (
            resource: string, 
            queryParams: {paramName: string, paramValue: string}[],
            mutator: (queryResults: any) => TResult[],
            forceRefetch: boolean = false
        )
        {
            //Purge out any cache elements that have expired.
            /*SetRequestCache
            (
                requestCache
                    .filter
                    (
                        cacheItem =>
                            (Math.abs(new Date().getTime() - cacheItem.timestamp) / 1000) < 
                            cacheExpirationSeconds
                    )
            )*/

            const responseData: QueryResponseData<TResult> = 
                {
                    result: [], 
                    loading: true, 
                    errorMessage: null
                };

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
            const locatedCacheEntry = 
                requestCache
                    .filter
                    (
                        cacheEntry =>
                            cacheEntry.pathKey === requestPath
                    )[0];
                    
            if
            (
                !locatedCacheEntry ||
                forceRefetch
            )
            {
                let isErrorResponse: boolean = false;
                
                //If the query is not cached (or a refetch is requested)
                //add a new cache entry and replace any with the same key
                let newCacheEntry: QueryCacheEntry<TResult> =
                    {
                        pathKey: requestPath,
                        cachedData: [],
                        timestamp: new Date().getTime()
                    };

                requestCache =
                    requestCache
                        .filter
                        (
                            cacheEntry =>
                                cacheEntry.pathKey !== requestPath
                        )
                        .concat(newCacheEntry);

                //Retrieve the data by making a new REST request.
                fetch(`${props.baseUrl}${requestPath}`)
                    .then
                    (
                        response => 
                        {
                            if(!response.ok)
                            {
                                isErrorResponse = true;
                            }

                            return response.json();
                        },
                        error =>
                        {
                            responseData.loading = false;
                            responseData.errorMessage = JSON.stringify(error);
                        }
                    )
                    .then
                    (
                        data =>
                        {
                            if(isErrorResponse)
                            {
                                responseData.errorMessage = data;
                            }
                            else
                            {
                                //Use the provided mutator to transform query results.
                                responseData.result = mutator(data); 
            
                                //Update the new cache entry with the loaded data
                                newCacheEntry.cachedData = responseData.result;
                            }

                            responseData.loading = false;
                        }
                    );
            }
            else
            {
                responseData.result = locatedCacheEntry.cachedData;
                responseData.loading = false;
            }

            return responseData;
        };

        return (
            <CachableRestClientContext.Provider 
                value=
                {
                    {
                        useCacheableGetRequest: ExecuteCachableGetRequest,
                    }
                } >
                {props.children}
            </CachableRestClientContext.Provider>
        );
    }

export default CachableRestClientProvider;