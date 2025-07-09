import { useState } from 'react';
import { Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../../reducers/modalReducer';
import { updateDevice } from '../../../utils/device-updates';
import { Button } from '../../button';
import { iconManager } from '../iconManager';
import { styles } from '../info/styles';

const Update = () => {
    const dispatch = useDispatch()
    // const [pending, setPending] = useState(false);
    const { content, head, icon, buttonText, pending } = useSelector(state => state.modalController);
    const [wait, setWait] = useState(pending);

    const callbackHandler = async () => {
        await updateDevice()
        setWait(true);
    }

    return (
        <View style={styles.container}>
            {
                wait ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.head, { marginBottom: 20, }]} numberOfLines={2}>Updating...</Text>
                    <ActivityIndicator color="#415EB6" size={40} />
                </View> :
                    <View style={styles.container}>
                        {iconManager(icon)}
                        <Text style={styles.head} numberOfLines={2}>{head}</Text>
                        <Text style={styles.content}>{content}</Text>
                        <View style={styles.buttonGroup}>
                            <Button variant='outlined' text='Cancel' callback={() => dispatch(closeModal())} />
                            <View style={styles.gap}></View>
                            <Button text={buttonText ? buttonText : 'Update'} callback={callbackHandler} />
                        </View>
                    </View>
            }


        </View >
    )
}

export default Update

// const styles = StyleSheet.create({})