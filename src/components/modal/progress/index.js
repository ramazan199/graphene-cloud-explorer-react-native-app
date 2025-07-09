import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../../../reducers/modalReducer'
import { Button } from '../../button'
import { ProgressBar } from '../../progressbar'
import { styles } from './styles'

const ProgressModal = () => {
    const dispatch = useDispatch()
    const { content, head, callback } = useSelector(state => state.modalController);
    const callbackHandler = () => {
        if (callback) {
            dispatch(closeModal());
            callback();
        } else dispatch(closeModal());;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.content} numberOfLines={2}>{content} </Text>
            <View style={{ flex: 1 }}>
                <ProgressBar special={head} />
            </View>
            <View style={styles.buttonGroup}>
                <Button variant='outlined' text='Close' callback={() => callbackHandler()} />
            </View>
        </View >
    )
}

export default ProgressModal


