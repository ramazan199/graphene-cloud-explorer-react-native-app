import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    totalMemory: 0,
    usedMemory: 0,
    localLocation: null,
}

export const profileActionsReducer = createSlice({
    name: 'profileActionsReducer',
    initialState,
    reducers: {
        setCloudMemory: (state, action) => {
            state.totalMemory = parseInt(action.payload?.totalMemory);
            state.usedMemory = parseInt(action.payload?.usedMemory)
        },
    }
})

export const { setCloudMemory } = profileActionsReducer.actions
export default profileActionsReducer.reducer