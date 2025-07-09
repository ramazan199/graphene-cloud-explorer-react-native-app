import { View } from "react-native"
import { OptionButton } from "../../../option-button"
import FolderIcon from '../../../../assets/icons/bottomSheet/folder.svg'
import { pickMultiply } from "../../../../utils/settings-utils"
import { useContextApi } from "../../../../context/ContextApi"
import { useDispatch, useSelector } from "react-redux"
import { openModal } from "../../../../reducers/modalReducer"

export const UploadSettings = () => {
    const dispatch = useDispatch();
    const { bottomSheetController } = useContextApi();
    const { connection } = useSelector(state => state.network)
    const { fromScreen } = useSelector(state => state.bottomSheetManager)

    const uploadMultiplyButton = () => {
        if (connection) return pickMultiply(bottomSheetController, fromScreen);

        dispatch(openModal({
            content: 'Make sure your phone has an active internet connection and checking the network.',
            type: 'info',
            head: 'Network connection failed',
            icon: 'ex',
        }))
    }

    return (
        <View>
            <OptionButton text='Upload a file' func={uploadMultiplyButton} icon={<FolderIcon />} />
            <OptionButton text='Upload multiple files' func={uploadMultiplyButton} icon={<FolderIcon />} />
        </View>
    )
}
