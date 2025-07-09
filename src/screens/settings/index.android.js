import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Linking, ActivityIndicator, NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { Layout } from '../../layout';
import TermsIco from '../../assets/icons/setting/terms.svg';
import FaqIcon from '../../assets/icons/setting/faq.svg';
import Microphone from '../../assets/icons/setting/microphone.svg';
import AboutIcon from '../../assets/icons/setting/about.svg';
import { styles } from './styles';
import { getAlexaCredentials, sendAlexaCredentials } from '../../utils/alexa';
import { useDispatch } from 'react-redux';
import { openModal } from '../../reducers/modalReducer';
import { getCellularInfoMMKV, setCellularAccessMMKV } from '../../utils/mmkv';
import { useErrorAlert } from '../../hooks/useErrorAlert';

export const SettingsScreen = ({ route, navigation }) => {
    const { LWAModule } = NativeModules;
    
    // Create event emitter only if module exists
    const eventEmitter = LWAModule ? new NativeEventEmitter(LWAModule) : null;

    const [isEnabled, setIsEnabled] = useState(false);

    const [alexaWait, setAlexaWait] = useState(false);
    const [alexaDetails, setAlexaDetails] = useState(null);
    const dispatch = useDispatch();

    const redirectToLandingPage = () => {
        let link = "http://quartztechnologies.org";
        Linking.canOpenURL(link).then((supported) => {
            if (supported) {
                Linking.openURL(link);
                return;
            }
        });
    };

    const toggleSwitch = (value) => {
        setIsEnabled(value);
        setCellularAccessMMKV(value);
    };

    const cellularCheck = async () => {
        const info = await getCellularInfoMMKV();
        setIsEnabled(info);
    };

    const alexaLogout = () => {
        setAlexaWait(true);
        sendAlexaCredentials({
            authorizationCode: "",
            clientId: "",
            redirectURI: ""
        }).then(() => setAlexaDetails(null))
            .finally(() => {
                setAlexaWait(false);
                LWAModule.logout();
            });
    };

    const alexaGetCredentials = async () => {
        if (alexaDetails == null) {
            setAlexaWait(true);
            getAlexaCredentials()
                .then((res) => LWAModule.login(res.productId, res.codeChallenge, res.dns))
                .catch((err) => useErrorAlert('alexa error', err))
                .finally(() => setAlexaWait(false));
        }
        else {
            dispatch(openModal({
                content: 'If you want log out from Alexa, your will not be able to use Alexa voice assistant',
                head: "Log out from Alexa account",
                type: 'confirm',
                icon: 'check',
                callback: () => alexaLogout()
            }));
        }
    };

    const checkAlexaLogin = () => {
        setAlexaWait(true);
        getAlexaCredentials()
            .then(response => {
                if (response?.authorizationCode) {
                    setAlexaDetails(response);
                    return;
                }
            })
            .finally(() => setAlexaWait(false));
    };

    useEffect(() => {
        let subscription;
        if (eventEmitter) {
            subscription = eventEmitter.addListener('AmazonAuthEvent', (params) => {
                if (!params.error) {
                    setAlexaDetails(params);
                    sendAlexaCredentials({
                        authorizationCode: params?.authorizationCode,
                        clientId: params.clientId,
                        redirectURI: params.redirectUri
                    });
                }
            });
        }

        checkAlexaLogin();
        cellularCheck();
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    return (
        <Layout name={route.name} >
            <View style={styles.switchContainer}>
                <View style={styles.switchView}>
                    <Text style={styles.switchText}>Use cellular data</Text>
                    <Switch
                        trackColor={{ false: "rgba(13, 88, 163, 0.2)", true: "#5D82F5" }}
                        thumbColor={isEnabled ? "#FAFAFA" : "#B0C0D0"}
                        ios_backgroundColor="rgba(176, 192, 208, 0.2)"
                        onValueChange={() => toggleSwitch(!isEnabled)}
                        value={isEnabled}
                        style={{ transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }] }}
                    />
                </View>
            </View>
            <View style={styles.listContainer}>
                <TouchableOpacity style={styles.touchable} onPress={alexaGetCredentials} disabled={alexaWait}>
                    {alexaWait ? <ActivityIndicator /> : null}
                    <Microphone />
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.touchText}>Alexa voice assistant</Text>
                        {
                            alexaDetails !== null
                                ? <Text style={styles.connected}>Connected</Text>
                                : <Text style={styles.logIn}>Log In</Text>
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchable} onPress={() => navigation.navigate('TermsAndCondition')}>
                    <TermsIco />
                    <Text style={styles.touchText}>Terms & Conditions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchable} onPress={() => navigation.navigate('FAQScreen')}>
                    <FaqIcon />
                    <Text style={styles.touchText}>FAQ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchable} onPress={() => redirectToLandingPage()}>
                    <AboutIcon />
                    <Text style={styles.touchText}>About</Text>
                </TouchableOpacity>
            </View>
        </Layout>
    );
};
