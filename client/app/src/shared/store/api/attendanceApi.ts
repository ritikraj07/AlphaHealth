import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "./apiSlice";
import { Config } from "@/app/src/config/constants";

export interface MarkAttendanceResponse {
    success: boolean;
    message: string;
    data: {
        message(message: any, SHORT: number): unknown;
        success: any;
        attendanceId: string;
        date: string;
        startTime: string;
        endTime?: string;
        startLocation?: {
            type: string;
            coordinates: [number, number];
        };
        endLocation?: {
            type: string;
            coordinates: [number, number];
        };
        workingHours?: number;
    };
}

export interface MarkAttendanceRequest {
    type: 'check-in' | 'check-out';
    location: {
        coordinates: [number, number];
    };
}

export const attendanceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        markAttendance: builder.mutation<MarkAttendanceResponse, MarkAttendanceRequest>({
            query: (credentials) => ({
                url: '/attendances/', // Make sure this matches your backend route
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    
                    console.log('✅ Mark Attendance Success:', data);
                } catch (error) {
                    console.log('❌ Mark Attendance Error:', error);
                }
            },
        })
    })
});

export const { useMarkAttendanceMutation } = attendanceApi;