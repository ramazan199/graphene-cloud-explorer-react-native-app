import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    CloudScreen: false,
    FavoriteScreen: false,
    HomeScreen: false,
    MediaScreen: false,
    ProfileScreen: false,
    QrScreen: false,
    WelcomeScreen: false,
    favoriteScreenActive: false,
}

export const screenRendererReducer = createSlice({
    name: 'screenRenderer',
    initialState,
    reducers: {
        renderScreen: (state, action) => {
            action.payload.map(screen => {
                state[screen] = !state[screen];
            })
        }
    }
})

export const { renderScreen } = screenRendererReducer.actions
export default screenRendererReducer.reducer