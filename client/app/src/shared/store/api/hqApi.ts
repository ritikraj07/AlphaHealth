import { apiSlice } from './apiSlice';

interface HeadquarterRequest {
    name: string;
    location: string;
}

export const hqApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHeadQuarters: builder.query({
            query: () => '/headquarters',
            providesTags: ["HQ"],
        }),
        createHeadQuarter: builder.mutation({
            query: (headquarterData) => ({
                url: '/headquarters',
                method: 'POST',
                body: headquarterData,
            }),
            invalidatesTags: ['AdminDashboard','HQ'],
        })
    }),
});

export const { useGetHeadQuartersQuery, useCreateHeadQuarterMutation } = hqApi;