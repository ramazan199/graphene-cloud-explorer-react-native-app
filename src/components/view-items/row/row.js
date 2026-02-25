import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { renderThumbnail } from '../renderThumbnail'
import DotsIcon from '../../../assets/icons/viewer/dotsvertical.svg';
import StarIcon from '../../../assets/icons/viewer/star.svg';
import DownloadIcon from '../../../assets/icons/viewer/download.svg';
import { useContextApi } from '../../../context/ContextApi';
import { removeSelectedFiles, setFound, setLocation, setSelectedFile, setSelectedFiles } from '../../../reducers/fileReducer';
import { AntDesign } from '@expo/vector-icons';
import { rowStyles } from '../styles';
import { navigateToFolder } from '../../../utils/essential-functions';
import { fileExistsCheck } from '../../../utils/local-files';
import { enqueue } from '../../../reducers/refreshQueueReducer';
import { downloadManager, openFileNatively, titleShortener } from '../functions';

export const Row = ({ item, contentSetter }) => {
    const { bottomSheetController } = useContextApi();
    const { selectedFiles, favorites, found } = useSelector(state => state.files);
    const { downloadQueue } = useSelector(state => state.newFileTransfer);
    const networkInformation = useSelector(state => state.network);
    const dispatch = useDispatch();
    const { name } = useRoute();
    const { navigate } = useNavigation();




    const settingOnPress = (file) => {
        bottomSheetController(2, name);
        dispatch(setSelectedFile({ ...file, screen: name, isFavorite: favorites?.includes(file.path) }))
        dispatch(setFound(null))
    }

    const onLongPressHandler = (file) => {
        if (selectedFiles.includes(file)) dispatch(removeSelectedFiles(file));
        else dispatch(setSelectedFiles(file))
        dispatch(setFound(null))
    }

    const multiSelectCheck = (file) => {
        if (selectedFiles.length) {
            if (selectedFiles.includes(file)) {
                dispatch(removeSelectedFiles(file));
            }
            else {
                dispatch(setSelectedFiles(file))
            }

            return true;
        }
        else return false;
    }

    const folderPress = async (folder) => {

        if (multiSelectCheck(folder) === true) {
            return;
        }

        if (name !== 'FavoriteScreen') {
            navigateToFolder(folder.title, 'CloudScreen').then(content => contentSetter(content));
            return
        }
        dispatch(enqueue('CloudScreen'))
        dispatch(setLocation(folder.path))
        navigate('CloudScreen');
    }

    const filePress = async (file) => {
        if (multiSelectCheck(file) === true) return;

        const { uri, mime, source } = await fileExistsCheck(file) || {};
        if (uri || source) {
            return openFileNatively(uri, mime, source);
        }
        downloadManager(dispatch, name, file, downloadQueue, networkInformation);
    }


    const onPressHandler = async (type, item) => {
        dispatch(setFound(null))
        switch (type) {
            case "folder":
                folderPress(item);
                break;
            default:
                filePress(item);
                break;
        }
    }

    const checkIsFav = useCallback((path) => {
        return favorites?.includes(path) ? <StarIcon style={rowStyles.overlayStar} /> : null
    }, [favorites])


    return (
        <TouchableOpacity
            onPress={() => onPressHandler(item.type, item)}
            onLongPress={() => onLongPressHandler(item)}
            style={rowStyles.rowContainer}
        >
            <View style={[item.type === 'folder' ? { ...rowStyles.box, borderColor: "#00000043" } : rowStyles.box, item.name === found && { borderColor: '#1a4feb' }, selectedFiles.includes(item) && { borderColor: '#1a4feb' }]}>
                {renderThumbnail(item, 15)}
                {selectedFiles.includes(item) && <AntDesign name="checkcircleo" size={20} color="#5D82F5" style={rowStyles.overlay} />}
                {checkIsFav(item.path)}
                {downloadQueue.includes(item.path) && <DownloadIcon style={rowStyles.overlayDownload} />}
            </View>
            <View style={rowStyles.textSections}>
                <View>
                    <Text
                        numberOfLines={1}
                        style={rowStyles.title}
                    >{titleShortener(item.path, name)}</Text>
                    <Text style={rowStyles.date}>{item.description}</Text>
                </View>
                {
                    selectedFiles.length == 0 &&
                    <Pressable hitSlop={18} onPress={() => settingOnPress(item)} style={rowStyles.setting}>
                        <DotsIcon />
                    </Pressable>
                }
            </View>
        </TouchableOpacity >
    )
}

