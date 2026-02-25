import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    uploadQueue: {},
    downloadQueue: [],
    downloadProgress: {},
    pickedFile: null,
    pickedFiles: [],
    intentFile: [],
}

export const newFileTransferReducer = createSlice({
    name: 'newFileTransfer',
    initialState,
    reducers: {
        uploadSetQueue: (state, action) => {
            const payload = action.payload;
            const initial = state.uploadQueue[payload.file];

            if (!initial) {
                state.uploadQueue = {
                    ...state.uploadQueue,
                    [payload.file]: payload
                }
            }
            else {
                const millis = (new Date().getTime() - initial.start) / 1000;
                const progress = Math.ceil((payload.chunk / payload.parts) * 100);
                const remaining = Math.ceil(millis * (payload.parts - payload.chunk));

                state.uploadQueue = {
                    ...state.uploadQueue,
                    [payload.file]: { ...initial, progress, remaining, start: new Date().getTime(), current: payload.size }
                }
            }
        },

        clearUploadQueue: (state, action) => {
            let newState = state.uploadQueue
            delete newState[action.payload];
            state.uploadQueue = newState;
        },

        downloadSetQueue: (state, action) => {
            if (!state.downloadQueue.includes(action.payload)) {
                state.downloadQueue.push(action.payload);
            }
        },

        downloadRemoveQueue: (state, action) => {
            state.downloadQueue = state.downloadQueue.filter(x => x !== action.payload);
        },
        downloadSetProgress: (state, action) => {
            const { path, progress } = action.payload || {};
            if (!path) return;
            state.downloadProgress[path] = progress;
        },
        downloadClearProgress: (state, action) => {
            const path = action.payload;
            if (!path) return;
            delete state.downloadProgress[path];
        },
        setPickedFiles: (state, action) => {
            state.pickedFiles = action.payload;
        },
        setIntentFile: (state, action) => {
            state.intentFile = action.payload;
        }
    }
})

export const {
    uploadSetQueue,
    downloadSetQueue,
    setPickedFiles,
    setIntentFile,
    clearUploadQueue,
    downloadRemoveQueue,
    downloadSetProgress,
    downloadClearProgress
} = newFileTransferReducer.actions
export default newFileTransferReducer.reducer
