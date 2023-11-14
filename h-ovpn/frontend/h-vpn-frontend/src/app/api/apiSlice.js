import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import { logout, setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    // baseUrl: 'http://localhost:8989',
    // baseUrl: 'http://192.168.1.37:8989',
    // baseUrl: 'http://192.168.1.38:8989',
    // baseUrl: 'http://192.168.43.84:8989',
    baseUrl: 'https://api.v0.dev.haarmkcloud.com',
    // credentials: true,
    credentials: 'include',
    // crossDomain: true,
    
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
   
    let result = await baseQuery(args, api, extraOptions)
    

    if (result?.error?.status === 401 || result?.error?.status === 403) {
       
        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh-token', api, extraOptions)
        
        if (refreshResult?.data) {
            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data}))
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('accessToken', refreshResult.data.token)
            // const refreshResult = await baseQuery('/users/', api, extraOptions)
            // retry the original query with new access token 
            result = await baseQuery(args, api, extraOptions)
        } else {
            const logoutArgs = {
                url: '/auth/logout',
                method: 'DELETE',
            }
            api.dispatch(api.util.resetApiState());
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('accessToken');
            
            api.dispatch(logout())
            return result
        }

        
        
    }
    
    if(result?.error && args?.url !== "/auth/refresh-token"){
        let err = (result?.error?.data?.message 
            || result?.error.error

            || 'somthing went wrong')        
        // toast(err )
    }
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({}),
    

})