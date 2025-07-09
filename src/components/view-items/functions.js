import { Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import { setFromScreen } from "../../reducers/bottomSheetReducer";
import { setSelectedFile } from "../../reducers/fileReducer";
import { openModal } from "../../reducers/modalReducer";
import { getCellularInfoMMKV } from "../../utils/mmkv";
import { downloadFile } from "../../utils/settings-utils";

const directlyDownloadable = ['image', 'document', 'pdf', 'txt', 'presentation', 'spreadsheet'];

export const downloadManager = (dispatch, name, file, queue, network) => {
    dispatch(setFromScreen(name));
    dispatch(setSelectedFile(file));


    if (queue.includes(file.name)) {
        dispatch(openModal({
            content: 'File already in progress',
            head: file.name,
            type: 'info',
            icon: 'check',
        }))
        return
    }

    if (network.type === 'cellular') {
        networkCheck(file, dispatch);
        return
    }

    if (directlyDownloadable.includes(file.type)) {
        return downloadFile();
    }

    dispatch(openModal({
        content: 'File not downloaded. Dou you want to download it?',
        head: file.name,
        type: 'confirm',
        icon: 'check',
        callback: () => downloadFile()
    }))
}

export const openFileNatively = (uri, mime, source) => {
    const open = Platform.select({
        ios: () => RNFetchBlob.ios.openDocument(source),
        android: () => RNFetchBlob.android.actionViewIntent(uri, mime)
    });

    open();
}

export const titleShortener = (title, name) => {
    const [lastName, folder, other] = title.split('/').reverse();

    if (name === "CloudScreen") return lastName;
    else if (other) return `../${folder}/${lastName}`
    else if (folder) return `${folder}/${lastName}`
    return lastName
}


export const networkCheck = async (file, dispatch) => {
    const isToggled = await getCellularInfoMMKV();
    if (isToggled === false) {
        dispatch(openModal({
            content: 'Cellular data usage is off. Are you sure you want to use cellular data for this action?',
            head: "You use cellular connection",
            type: 'confirm',
            icon: 'ex',
            callback: () => downloadFile()
        }))

        return;
    }

    if (directlyDownloadable.includes(file.type)) {
        return downloadFile();
    }

    dispatch(openModal({
        content: 'File not downloaded. Dou you want to download it?',
        head: file.name,
        type: 'confirm',
        icon: 'check',
        callback: () => downloadFile()
    }))

}