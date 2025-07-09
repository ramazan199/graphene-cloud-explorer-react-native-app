import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    screensQueue: ["MediaScreen", "ProfileScreen"],
    forceQueue: [],
}

export const refreshQueueReducer = createSlice({
    name: 'refreshQueueReducer',
    initialState,
    reducers: {
        enqueue: (state, action) => {
            if (Array.isArray(action.payload)) {
                let filter = action.payload.filter(e => !state.screensQueue.includes(e));
                state.screensQueue = [...state.screensQueue, ...filter];
                return
            }

            if (!state.screensQueue.includes(action.payload)) {
                state.screensQueue.push(action.payload);
                return
            }
        },
        dequeue: (state, action) => {
            state.screensQueue = state.screensQueue.filter(i => i !== action.payload);
        },
        forceEnqueue: (state, action) => {
            if (action.payload === null) {
                return;
            }
            if (state.screensQueue.includes) {
                dequeue(action.payload);
                state.forceQueue.push(action.payload);
                return;
            }
            state.forceQueue.push(action.payload);
        },
        forceDequeue: (state, action) => {
            state.forceQueue = state.forceQueue.filter(i => i !== action.payload);
        }
    }
})

export const { enqueue, dequeue, forceEnqueue, forceDequeue } = refreshQueueReducer.actions
export default refreshQueueReducer.reducer