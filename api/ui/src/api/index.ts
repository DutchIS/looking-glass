import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const API = createApi({
    reducerPath: 'API',
    refetchOnFocus: true,
    endpoints: () => ({}),
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
        mode: "cors",
        cache: "no-cache"
    })
});
