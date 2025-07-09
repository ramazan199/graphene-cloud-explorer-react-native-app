import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cloud: [],
}

export const testReducer = createSlice({
    name: 'testReducer',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.cloud = action.payload
        }
    }
})

export const { setData } = testReducer.actions
export default testReducer.reducer