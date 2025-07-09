import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    images: 0,
    video: 0,
    documents: 0,
    music: 0,
    other: 0,
}

export const filesInfoReducer = createSlice({
    name: 'filesInfoReducer',
    initialState,
    reducers: {
        setOccupiedSpace: (state, action) => {
            if (action.payload.type === "[^\\s]+(.*?)\\.(docx|txt|pdf|xls|DOCX|TXT|PDF|XLS|epub|EPUB)") {
                state.documents = action.payload.size;
            }
            else if (action.payload.type == '[^\\s]+(.*?)\\.(mov|mp4|mpeg4|avi|MOV|MP4|MPEG4|AVI)') {
                state.video = action.payload.size;
            }
            else if (action.payload.type === "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)") {
                state.images = action.payload.size
            }
            else if (action.payload.type === "[^\\s]+(.*?)\\.(MP3|mp3|avi|AAC|aac|WAV|wav|ogg)") {
                state.music = action.payload.size
            }
            else if (action.payload.type === "[^\\s]+(.*?)\\.(mov|mp4|mpeg4|avi|MOV|MP4|MPEG4|AVI|jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|docx|txt|pdf|xls|DOCX|TXT|PDF|XLS|epub|EPUB|MP3|mp3|avi|AAC|aac|WAV|wav|ogg)") {
                state.other = action.payload.total - action.payload.size
            }

        },
    }
})

export const { setOccupiedSpace } = filesInfoReducer.actions
export default filesInfoReducer.reducer