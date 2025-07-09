import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from './styles'
import { Feather } from "@expo/vector-icons";
import MoveIcon from '../../assets/icons/bottomSheet/move.svg';
import CopyIcon from '../../assets/icons/bottomSheet/copy.svg';
import DeleteIcon from '../../assets/icons/bottomSheet/delete.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setEmptySelectedFiles } from '../../reducers/fileReducer';
import { openCopyMoveSheet, removeMultiple } from '../../utils/settings-utils';
import { useContextApi } from '../../context/ContextApi';
import { openModal } from '../../reducers/modalReducer';

export const MultipleSelection = ({ router }) => {
  const { selectedFiles } = useSelector(state => state.files);
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const { closeBottomSheet, bottomSheetController } = useContextApi();

  const removeHandle = () => {
    dispatch(openModal({
      content: 'Are you sure you want to delete these files?',
      type: 'confirm',
      head: selectedFiles.map((x, i) => i + 1 + ') ' + x.name + " "),
      icon: 'question',
      callback: () => removeMultiple()
    }))
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity onActive={0.6} >
          <Feather name="x" size={24} color="#B0C0D0" onPress={() => dispatch(setEmptySelectedFiles())} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>
        {selectedFiles.length} Items
      </Text>
      <View style={styles.right}>
        <TouchableOpacity onActive={0.6} onPress={() => openCopyMoveSheet(bottomSheetController, closeBottomSheet, 2)} style={styles.icons}>
          <MoveIcon />
        </TouchableOpacity>
        <TouchableOpacity onActive={0.6} onPress={() => openCopyMoveSheet(bottomSheetController, closeBottomSheet, 1)} style={styles.icons}>
          <CopyIcon />
        </TouchableOpacity>
        <TouchableOpacity onActive={0.6} onPress={() => removeHandle()} style={styles.icons}>
          <DeleteIcon />
        </TouchableOpacity>
      </View>
    </View>
  )
}

