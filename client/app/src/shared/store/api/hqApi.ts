import { apiSlice } from './apiSlice';

export const hqApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHeadQuarters: builder.query({
            query: () => '/headquarters',
        })
    }),
});

export const { useGetHeadQuartersQuery } = hqApi;