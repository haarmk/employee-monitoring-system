import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({

    name: 'user',
    initialState: { user: null},
    reducers: {
        setUser: (state, action) => {
            const { user} = action.payload
            state.user = user
        }        
    },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer

export const selectUser = (state) => state.user.user