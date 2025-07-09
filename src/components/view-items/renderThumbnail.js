import { Image } from 'react-native'
import FileIcon from '../../assets/icons/viewer/file.svg';
import FolderIcon from '../../assets/icons/viewer/folder.svg';
import {
    Entypo,
    AntDesign,
    MaterialIcons,
    MaterialCommunityIcons,
    FontAwesome,
    SimpleLineIcons
} from "@expo/vector-icons";


const thumbnails = {
    folder: <FolderIcon />,
    other: <SimpleLineIcons name="question" size={20} color="#415EB6" />,
    document: <FileIcon />,
    video: <FontAwesome name="video-camera" size={20} color="#415EB6" />,
    audio: <MaterialIcons name="audiotrack" size={20} color="#415EB6" />,
    pdf: <AntDesign name="pdffile1" size={20} color="#415EB6" />,
    txt: <Entypo name="text" size={20} color="#415EB6" />,
    presentation: <MaterialCommunityIcons name="file-powerpoint-box" size={20} color="#415EB6" />,
    spreadsheet: <FontAwesome
        name="file-excel-o"
        size={20}
        color="#415EB6"
    />,
    archive: <FontAwesome name="file-archive-o" size={20} color="#415EB6" />,
    code: <FontAwesome name="code" size={20} color="#415EB6" />

}

export const renderThumbnail = (item, border) => {
    if (item.type !== 'image') {
        return thumbnails[item.type];
    }
    if (item.local) {
        return <Image source={{ uri: `file://${item.source}` }} style={{ height: '100%', width: '100%', borderRadius: border, flex: 1 }} />
    }
    return <Image source={{ uri: item.source }}
        style={{ height: '100%', width: '100%', borderRadius: border, flex: 1 }}
    />
}


