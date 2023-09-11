import { apiSlice } from "../../app/api/apiSlice"

export const usersApiSlice = apiSlice.injectEndpoints({
    tagTypes: ['user_service',"user"],
    endpoints: builder => ({
        getUser: builder.query({
            query: () => '/users/',
            providesTags: ['user'],
        }),

        getServiceByCategory: builder.query({
            query: (categoryName) => `/services/find-by-categoryName?categoryName=${categoryName}`,
        }),

        uploadPic: builder.mutation({
            query: (data) => ({
                url: `/users/upload-pic`,
                method: 'POST',  
                body:data
            }),
            invalidatesTags: ['user'],
        }),
        
    })
})

export const {
    useGetUserQuery,
    useGetServiceByCategoryQuery,
    useUploadPicMutation,
} = usersApiSlice 