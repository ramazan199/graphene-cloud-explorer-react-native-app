import { enqueue, forceEnqueue } from "../reducers/refreshQueueReducer";
import { store } from "../store";
import { setFileStream } from "./data-transmission-utils";
import { clearUploadNotification, displayUploadNotification } from "./notification-utils";
import BackgroundService from 'react-native-background-actions';

let currentScreenList = {
    'Cloud': 'CloudScreen',
    'Favorite': 'FavoriteScreen',
    "Media": 'MediaScreen',
}

let isStart = false;
let object = [];
const wm = new WeakMap();

export const streamReceiver = async (file, bin) => {
    if (!isStart) {
        setTimeout(() => processStart(), 1000)
        isStart = true;
    }

    if (wm.has(file) === false) {
        wm.set(file, [bin]);
        object.push(file);
        return;
    }

    let f = wm.get(file);
    f.push(bin);
    wm.set(file, f);
}

let index = 0;

export const processStart = async () => {
    let forceRefresh = null;
    let enqueueList = ['CloudScreen', 'ProfileScreen', 'FavoriteScreen', 'MediaScreen'];
    if (object[index] !== undefined) {
        displayUploadNotification(object[index].name, object[index].path);
        let f = wm.get(object[index]);
        f.push('for additional index')
        var i = 0;
        for (const BINARY of f) {
            await setFileStream(BINARY, object[index], i + 1, object[index].path);
            i++
        }
        let cloudLocation = store.getState().files.location !== "" ? store.getState().files.location + '/' : store.getState().files.location;
        let current = store.getState().bottomSheetManager.current;
        clearUploadNotification(object[index].name, object[index].path)
        if (cloudLocation === object[index].path) {
            forceRefresh = "CloudScreen"
            delete enqueueList[0];
        }

        if (current !== 'Cloud') {
            forceRefresh = currentScreenList[current];
        }

        store.dispatch(enqueue(enqueueList));
        store.dispatch(forceEnqueue(forceRefresh))

        delete object[index];
        wm.delete(object[index]);
        index = index + 1;
        if (object[index] !== undefined) {
            processStart();
            return
        }
        await BackgroundService.stop();
        isStart = false;
        return;
    }
    isStart = false;
}
