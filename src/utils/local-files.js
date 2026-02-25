import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { existsTypes } from '../constants';
const { dirs, exists, mkdir, createFile } = RNFetchBlob.fs
const dir = dirs.DocumentDir
import { mime_types_json } from '../constants/mime_types';

const downloadedPathIndex = {};

const typeConverter = (type) => {
    if (!type || typeof type !== 'string') return 'application';
    return type.split('/')[0]
};

export const registerDownloadedPath = (remotePath, localPath) => {
    if (!remotePath || !localPath) return;
    downloadedPathIndex[remotePath] = localPath;
};

export const fileExistsCheck = async (file) => {
    const extension = file?.name?.split('.').pop()?.toLowerCase();
    const mime = mime_types_json[extension];
    const fileType = typeConverter(file.type);
    const type = existsTypes.includes(fileType) ? fileType : 'application';

    const indexedPath = downloadedPathIndex[file?.path];
    if (indexedPath) {
        const indexedExists = await exists(indexedPath);
        if (indexedExists) {
            return {
                source: `file://${indexedPath}`,
                uri: indexedPath,
                mime,
            };
        }
    }

    if (file?.source && typeof file.source === 'string') {
        const sourcePath = file.source.replace('file://', '');
        const sourceExists = await exists(sourcePath);
        if (sourceExists) {
            return {
                source: `file://${sourcePath}`,
                uri: sourcePath,
                mime,
            };
        }
    }

    const baseDirs = Platform.OS === 'android' && dirs.DownloadDir && dirs.DownloadDir !== dir
        ? [dir, dirs.DownloadDir]
        : [dir];

    const candidateFolders = [...new Set([type, 'image', 'application', 'audio', 'video'])];

    for (const baseDir of baseDirs) {
        for (const folder of candidateFolders) {
            const fullPath = `${baseDir}/${folder}/${file.name}`;
            const isExists = await exists(fullPath);
            if (isExists) {
                return {
                    source: `file://${fullPath}`,
                    uri: fullPath,
                    mime,
                };
            }
        }

        const rootPath = `${baseDir}/${file.name}`;
        const rootExists = await exists(rootPath);
        if (rootExists) {
            return {
                source: `file://${rootPath}`,
                uri: rootPath,
                mime,
            };
        }
    }

    return false;
}

export const mkFolder = async (file) => {
    const type = typeConverter(file?.type);
    const isFolderAlreadyExists = await exists(`${dir}/${type}`);
    if (!isFolderAlreadyExists) await mkdir(dir + '/' + type);
    return `${dir}/${type}`
}

export const writeFileToLocal = async (file, name, folder) => {
    const target = `${folder}/${name}`;
    const alreadyExists = await exists(target);
    if (alreadyExists) return target;
    await createFile(target, file, 'base64');
    return target;
}
