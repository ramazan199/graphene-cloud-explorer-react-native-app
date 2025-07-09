import { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, NativeEventEmitter, NativeModules, Platform } from 'react-native'
import { styles } from './styles'
import MicrophoneIcon from '../../assets/icons/setting/microphone.svg';
import XIcon from '../../assets/icons/setting/xicon.svg';
import { getAlexaCredentials, sendAlexaCredentials } from '../../utils/alexa';
import { useErrorAlert } from '../../hooks/useErrorAlert';

const AlexaConnection = () => {
    const { LWAModule } = NativeModules;
    let eventListener
    const eventEmitter = new NativeEventEmitter(Platform.OS === 'ios' ? LWAModule : null);

    const [alexaLogIn, setAlexaLogIn] = useState(false);
    const [alexaDetails, setAlexaDetails] = useState(null);


    const check = async () => {
        getAlexaCredentials()
            .then(response => {
                if (response?.authorizationCode) {
                    setAlexaDetails(response);
                    setAlexaLogIn(true);
                    return
                }
            })
    }

    useEffect(() => {
        eventListener = eventEmitter.addListener('AmazonAuthEvent', (params) => {
            if (!params.error) {
                setAlexaDetails(params)
                sendAlexaCredentials({
                    authorizationCode: params.authorizationCode,
                    clientId: params.clientId,
                    redirectURI: params.redirectUri
                });
                setAlexaLogIn(true);
            }
        });
        check()
        return () => {
            eventListener.remove()
        }
    }, []);

    const logInPress = () => {
        getAlexaCredentials()
            .then((res) => LWAModule.login(res.productId, res.codeChallenge, res.dns))
            .catch((err) => useErrorAlert('alexa error', err))
    }


    if (alexaLogIn == false) {
        return (
            <View style={styles.alexa}>
                <TouchableOpacity style={styles.textContainer} onPress={logInPress}>
                    <MicrophoneIcon />
                    <Text style={styles.connectionText}>Connect Alexa</Text>
                    <Text style={styles.loginText}>Tap to log in</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAlexaLogIn(true)} style={styles.close}>
                    <XIcon />
                </TouchableOpacity>
            </View>
        )
    }

    else null;

}

export default memo(AlexaConnection)