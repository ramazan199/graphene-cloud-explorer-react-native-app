import { lazy, Suspense, useLayoutEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import OnBoarding from '../../components/on-boarding';
import { useContextApi } from '../../context/ContextApi';
import { cleanUserSecretsData, setUserSecretDataToRedux } from '../../reducers/userSecretDataReducer';
import { getFavoritesNames } from '../../utils/data-transmission-utils';
import { dropMMKV, getUserSecretDataMMKV, removeUserEncryptionTypeMMKV } from '../../utils/mmkv';
import { getAuthStatus, saveAuthStatusFalse } from '../../utils/secure-storage';
import SignInUp from '../../components/SignInUp';

// Fix the import paths for lazy-loaded components
const SignInScreenNavigator = lazy(() => import('../../navigation/SignInScreenNavigator'));
const TabNavigator = lazy(() => import('../../navigation/TabNavigator'));

const WelcomeScreen = () => {
    const [isAuth, setIsAuth] = useState(null);
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        // await saveAuthStatusFalse();
        const auth = await getAuthStatus();
        setIsAuth(auth === 'true');
    };

    return (
        <Suspense
            fallback={
                <ActivityIndicator
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
            {isAuth === null ? (
                <ActivityIndicator
                    size="large"
                    color="#415EB6"
                    style={{
                        position: "absolute",
                        backgroundColor: "#fff",
                        height: "100%",
                        width: "100%",
                    }}
                />
            ) : (
                isAuth ? <TabNavigator /> : <SignInUp />
            )}
        </Suspense>
    );
};

export default WelcomeScreen;
