import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        tagTypes: ['refresh-token','login'],
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials },
                // providesTags: ['login']
            })
        }),
        refreshToken: builder.query({
            query: () => ({
                url: '/auth/refresh-token',
                method: 'GET',
                // providesTags: ['refresh-token'],
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'DELETE',
                // invalidatesTags: ['refresh-token','login'],
            })
        }),

        signup: builder.mutation({
            query: (data) => ({
                url: '/auth/signup',
                method: 'POST',
                body: data.payload
            }),
        }),
    })
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useRefreshTokenQuery,
    useSignupMutation,
} = authApiSlice


