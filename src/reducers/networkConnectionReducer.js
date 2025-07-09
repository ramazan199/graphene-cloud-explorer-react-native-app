import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    connection: false,
    type: ''
}

export const networkConnectionSlice = createSlice({
    name: "networkConnectionSlice",
    initialState,
    reducers: {
        setConnectionStatus: (state, action) => {
            state.type = action.payload.type;

            if (action.payload.connection != state.connection) {
                state.connection = action.payload.connection;
            }
        }
    }
})

export const { setConnectionStatus } = networkConnectionSlice.actions
export default networkConnectionSlice.reducer