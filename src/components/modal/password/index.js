import { StyleSheet, Text, View } from 'react-native'
import { useState, useEffect } from 'react'
import { Button } from '../../button'
import { styles } from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { generateKeyRSA, onQrCodeAcquires } from '../../../utils/essential-functions'
import { openModal } from '../../../reducers/modalReducer'
import { setAuthWait, setUserSecretDataToRedux } from '../../../reducers/userSecretDataReducer'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { ActivityIndicator } from "react-native-paper"
import MarkIcon from '../../../assets/icons/modal/exmark.svg'
import crashlytics from '@react-native-firebase/crashlytics';

const CELL_COUNT = 6;

const reportCrash = (error, attrs = {}) => {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    const normalizedAttrs = Object.keys(attrs).reduce((acc, key) => {
        const value = attrs[key];
        if (value !== undefined && value !== null) acc[key] = String(value);
        return acc;
    }, {});

    crashlytics().setAttributes({
        screen: 'PasswordModal',
        ...normalizedAttrs,
    });
    crashlytics().recordError(normalizedError);
};

export const PasswordModal = ({ barcode, setScanned, cancel }) => {

    const [value, setValue] = useState('');
    // const [wait, setWait] = useState(false);
    const [error, setError] = useState(false);
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

    const { connection } = useSelector(state => state.network);
    const { loginError, wait } = useSelector(state => state.userSecret);
    const dispatch = useDispatch()

    useEffect(() => {
        setTimeout(() => {
            ref?.current?.focus();
        }, 200)
    }, [])




    const handleLogIn = async () => {
        dispatch(setAuthWait(true))
        if (connection === false) {
            dispatch(setAuthWait(false));
            return dispatch(openModal({
                content: 'Make sure your phone has an active internet connection and checking the network.',
                type: 'info',
                head: 'Network connection failed',
                icon: 'ex',
            }))
        }


        dispatch(setUserSecretDataToRedux({ devicePin: value }));
        try {
            await generateKeyRSA();
            await onQrCodeAcquires(barcode.trim());
            setError(false)
            // setWait(false);
        } catch (error) {
            reportCrash(error, {
                flow: 'handleLogIn',
                pinLength: value?.length,
                hasBarcode: !!barcode,
            });
            setError(true)
        }
    }

    const onChangeText = (text) => {
        setValue(text);
    }

    const errorHandler = () => {
        setError(false);
        setValue("");
        dispatch(setAuthWait(false));
        // setWait(false);
    }

    return (
        <View style={styles.container}>
            {
                error ? <View style={styles.errorContainer}>
                    <MarkIcon />
                    <Text style={styles.errorText}>The password or QR is incorrect, please try again</Text>
                    <View style={{ width: '100%', height: 50 }}>
                        <Button text="Try again" callback={errorHandler} wait={wait} />
                    </View>

                </View> :
                    wait ? <ActivityIndicator color="#415EB6" size='large' style={StyleSheet.absoluteFillObject} /> :
                        <View style={styles.view}>
                            <Text style={styles.text}>Enter pin</Text>
                            <CodeField
                                ref={ref}
                                value={value}
                                onChangeText={onChangeText}
                                rootStyle={{ width: '100%' }}
                                cellCount={CELL_COUNT}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <Text
                                        key={index}
                                        style={[styles.cell, isFocused && styles.focusCell]}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                )}
                            />
                            <View style={styles.buttonsGroup}>
                                <Button text="Cancel" variant='outlined' callback={cancel} />
                                <View style={styles.gap}></View>
                                <Button text="Ok" disabled={wait || error || value.length != CELL_COUNT} callback={() => handleLogIn()} wait={wait} />
                            </View>
                        </View>
            }
        </View>
    )
}


