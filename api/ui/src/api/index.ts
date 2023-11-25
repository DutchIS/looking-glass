import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const API = createApi({
    reducerPath: 'API',
    refetchOnFocus: true,
    endpoints: () => ({}),
    baseQuery: fetchBaseQuery({
        baseUrl: "/",
        credentials: "same-origin",
        mode: "cors",
        cache: "no-cache"
    })
});
