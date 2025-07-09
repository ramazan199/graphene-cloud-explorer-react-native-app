import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { existsTypes } from '../constants';
const { dirs, exists, mkdir, createFile } = RNFetchBlob.fs
const dir = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir
import { mime_types_json } from '../constants/mime_types';

const typeConverter = (type) => {
    return type.split('/')[0]
};

export const fileExistsCheck = async (file) => {
    const fileType = typeConverter(file.type);
    const type = existsTypes.includes(fileType) ? fileType : 'application';
    if (await exists(`${dir}/${type}/${file.name}`)) return {
        source: `file://${dir}/${type}/${file.name}`,
        uri: `${dir}/${type}/${file.name}`,
        mime: mime_types_json[file.name.split('.').reverse()[0]]
    }
    else return false;
}

export const mkFolder = async (file) => {
    const type = typeConverter(file?.type);
    const isFolderAlreadyExists = await exists(`${dir}/${type}`);
    if (!isFolderAlreadyExists) await mkdir(dir + '/' + type);
    return `${dir}/${type}`
}

export const writeFileToLocal = async (file, name, folder) => {
    await createFile(folder + '/' + name, file, 'base64');
}
