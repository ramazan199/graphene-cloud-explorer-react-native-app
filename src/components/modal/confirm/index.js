import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../../reducers/modalReducer';
import { Button } from '../../button';
import { iconManager } from '../iconManager';
import { styles } from '../info/styles';

const ConfirmModal = () => {
    const dispatch = useDispatch()
    const { content, head, icon, callback, buttonText } = useSelector(state => state.modalController);
    const callbackHandler = () => {
        dispatch(closeModal())
        callback()
    }
    return (
        <View style={styles.container}>
            {iconManager(icon)}
            <Text style={styles.head} numberOfLines={2}>{head}</Text>
            <Text style={styles.content}>{content}</Text>
            <View style={styles.buttonGroup}>
                <Button variant='outlined' text='Cancel' callback={() => dispatch(closeModal())} />
                <View style={styles.gap}></View>
                <Button text={buttonText ? buttonText : 'Ok'} callback={callbackHandler} />
            </View>
        </View >
    )
}

export default ConfirmModal