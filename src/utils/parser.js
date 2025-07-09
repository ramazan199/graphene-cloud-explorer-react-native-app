import { fileTypes } from "../constants";

const getFileType = (file) => {
    file = file?.split('.').reverse()[0].toLowerCase();
    return fileTypes[file] ? fileTypes[file] : 'other';
};

const parseDateTime = (dateTime) => {
    let date = new Date(dateTime);
    // return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    return date.toLocaleDateString();
};

export const parseSingle = (obj, path) => {
    return {
        title: obj?.Name,
        type: getFileType(obj?.Name),
        name: obj?.Name?.split('/').reverse()[0],
        source: 'data:image/png;base64,' + obj?.Thumbnail,
        Thumbnail: obj?.Thumbnail,
        description: parseDateTime(obj?.Date),
        path: path + obj?.Name,
        location: path,
    };
};