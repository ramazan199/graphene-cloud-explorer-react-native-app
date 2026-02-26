import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { existsTypes } from '../constants';
const { dirs, exists, mkdir, createFile, stat, unlink } = RNFetchBlob.fs;
const documentDir = dirs.DocumentDir;
import { mime_types_json } from '../constants/mime_types';

const downloadedPathIndex = {};

const typeConverter = (type) => {
    if (!type || typeof type !== 'string') return 'application';
    return type.split('/')[0];
};

const resolveMime = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    return mime_types_json[extension] || 'application/octet-stream';
};

const buildFoundFile = (path, mime) => ({
    source: `file://${path}`,
    uri: path,
    mime,
});

const normalizeExpectedSize = (file) => {
    const raw = file?.Length ?? file?.length ?? file?.size;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const isUsableSize = async (path, expectedSize) => {
    if (!expectedSize) return true;
    try {
        const fileStats = await stat(path);
        return Number(fileStats?.size) === expectedSize;
    } catch {
        return false;
    }
};

export const registerDownloadedPath = (remotePath, localPath) => {
    if (!remotePath || !localPath) return;
    downloadedPathIndex[remotePath] = localPath;
};

export const fileExistsCheck = async (file) => {
    const mime = resolveMime(file?.name);
    const fileType = typeConverter(file.type);
    const type = existsTypes.includes(fileType) ? fileType : 'application';
    const expectedSize = normalizeExpectedSize(file);

    const indexedPath = downloadedPathIndex[file?.path];
    if (indexedPath) {
        const indexedExists = await exists(indexedPath);
        if (indexedExists && await isUsableSize(indexedPath, expectedSize)) {
            return buildFoundFile(indexedPath, mime);
        }
    }

    if (file?.source && typeof file.source === 'string') {
        const sourcePath = file.source.replace('file://', '');
        const sourceExists = await exists(sourcePath);
        if (sourceExists && await isUsableSize(sourcePath, expectedSize)) {
            return buildFoundFile(sourcePath, mime);
        }
    }

    const baseDirs = Platform.OS === 'android' && dirs.DownloadDir && dirs.DownloadDir !== documentDir
        ? [dirs.DownloadDir, documentDir]
        : [documentDir];

    const candidateFolders = [...new Set([type, 'image', 'application', 'audio', 'video'])];

    for (const baseDir of baseDirs) {
        for (const folder of candidateFolders) {
            const fullPath = `${baseDir}/${folder}/${file.name}`;
            const isExists = await exists(fullPath);
            if (isExists && await isUsableSize(fullPath, expectedSize)) {
                return buildFoundFile(fullPath, mime);
            }
        }

        const rootPath = `${baseDir}/${file.name}`;
        const rootExists = await exists(rootPath);
        if (rootExists && await isUsableSize(rootPath, expectedSize)) {
            return buildFoundFile(rootPath, mime);
        }
    }

    return false;
}

export const mkFolder = async (file) => {
    const type = typeConverter(file?.type);
    const baseDir = Platform.OS === 'android' && dirs.DownloadDir ? dirs.DownloadDir : documentDir;
    const targetFolder = `${baseDir}/${type}`;
    const isFolderAlreadyExists = await exists(targetFolder);
    if (!isFolderAlreadyExists) await mkdir(targetFolder);
    return targetFolder;
}

export const writeFileToLocal = async (file, name, folder) => {
    const target = `${folder}/${name}`;
    const alreadyExists = await exists(target);
    if (alreadyExists) {
        try {
            const fileStats = await stat(target);
            if (Number(fileStats?.size) > 0) return target;
        } catch {
            // If stat fails, rewrite the file to avoid returning a bad path.
        }
        await unlink(target);
    }
    await createFile(target, file, 'base64');
    return target;
}
