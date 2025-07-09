import { uploadSetQueue, clearUploadQueue } from "../reducers/filesTransferNewReducer";
import { store } from "../store";

export const registerUploadProgress = ({ name, size, chunkNumber, parts }) => {
    store.dispatch(uploadSetQueue({
        file: name,
        size,
        chunk: chunkNumber,
        parts,
        remaining: 0,
        current: 0,
        progress: 0,
        start: new Date().getTime(),
        uploadDate: new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    }))
}


export const updateUploadProgress = ({ name, size, chunkNumber, parts }) => {
    store.dispatch(uploadSetQueue({ file: name, size, chunk: chunkNumber, parts }))
}

export const finishUploadProgress = ({ name, size, chunkNumber, parts }) => {
    store.dispatch(clearUploadQueue(name))
}
