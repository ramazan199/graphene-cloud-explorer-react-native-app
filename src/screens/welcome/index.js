import { lazy, Suspense, useLayoutEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import OnBoarding from '../../components/on-boarding';
import { useContextApi } from '../../context/ContextApi';
import { cleanUserSecretsData, setUserSecretDataToRedux } from '../../reducers/userSecretDataReducer';
import { getFavoritesNames } from '../../utils/data-transmission-utils';
import { dropMMKV, getUserSecretDataMMKV, removeUserEncryptionTypeMMKV } from '../../utils/mmkv';
const SignInScreenNavigator = lazy(() => import('../../navigation/SignInScreenNavigator'));
const TabNavigator = lazy(() => import('../../navigation/TabNavigator'));
import { checkAvailableDeviceUpdate } from '../../utils/device-updates';
import { DeviceEventEmitter } from 'react-native';
import { navigateToFolder, parseFile } from '../../utils/essential-functions';
import { setData } from '../../reducers/testReducer';
import { setFavoritesContent } from '../../reducers/fileReducer';
import { setProxy } from '../../reducers/proxyReducer';


const WelcomeScreen = () => {
    const dispatch = useDispatch()
    const [userAuth, setUserAuth] = useState(true);
    const { wsScreen } = useContextApi();
    const [guideVisible, setGuideVisible] = useState(false);
    const showGuide = false;
    const setContent = (content) => dispatch(setData(content))

    DeviceEventEmitter.addListener('logOut', async () => {
        dispatch(cleanUserSecretsData());
        await dropMMKV()
        return setUserAuth(false);
    })

    DeviceEventEmitter.addListener('logIn', () => {
        setUserAuth(true);
    })


    const authCheck = async () => {
        const { auth, clientId, guide, privetKey, publicKey, publicKeyB64, serverId, encryptionType, qr, deviceKey, proxy } = await getUserSecretDataMMKV();
        if (!guide) return setGuideVisible(true)
        else if (auth === true) {
            setUserAuth(true)
            dispatch(setUserSecretDataToRedux({ clientId, privetKey, publicKey, publicKeyB64, serverId, encryptionType, auth, guide, qr, deviceKey }));
            dispatch(setProxy(proxy));
            getFavoritesNames().then(favs => {
                const parsed = parseFile(favs);
                dispatch(setFavoritesContent(parsed));
            })
            navigateToFolder("", "CloudScreen").then((content) => setContent(content));
            return setTimeout(() => {
                checkAvailableDeviceUpdate(qr);
            }, 1500);

        }

        else {
            setUserAuth(false)
            setGuideVisible(false)
            dispatch(cleanUserSecretsData());
            return await removeUserEncryptionTypeMMKV()
        }
    }

    useLayoutEffect(() => {
        authCheck();
        return
    }, [userAuth, wsScreen])




    return (

        <Suspense
            fallback={<ActivityIndicator
                size="large"
                color="#415EB6"
                style={{
                    position: "absolute",
                    backgroundColor: "#fff",
                    height: "100%",
                    width: "100%",
                }}
            />
            }
        >
            {(showGuide && guideVisible ? <OnBoarding /> : (userAuth ? <TabNavigator /> : <SignInScreenNavigator />))}
        </Suspense>
    )
}

export default WelcomeScreen
