import { getUploadQueueMMKV, removeUploadQueueMMKV, uploadQueueMMKV } from "./mmkv"

export const enqueue = async (file) => {
    await uploadQueueMMKV(file)
    return
}

export const dequeue = async () => {
    await removeUploadQueueMMKV()
    return
}

export const isEmpty = async () => (await getUploadQueueMMKV()).length