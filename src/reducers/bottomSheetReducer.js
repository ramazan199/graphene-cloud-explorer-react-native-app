import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    command: 1,
    fromScreen: null,
    current: 'Cloud'
}

export const bottomSheetManagerReducer = createSlice({
    name: 'bottomSheetManager',
    initialState,
    reducers: {
        setBottomCommandId: (state, action) => {
            state.command = action.payload.command
            state.fromScreen = action.payload.screenName
        },
        setFromScreen: (state, action) => {
            state.fromScreen = action.payload;
        },
        currenScreen: (state, action) => {
            state.current = action.payload;
        }
    }
})

export const { setBottomCommandId, setFromScreen, currenScreen } = bottomSheetManagerReducer.actions
export default bottomSheetManagerReducer.reducer