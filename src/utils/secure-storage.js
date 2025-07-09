import * as SecureStore from 'expo-secure-store';

export const saveTokens = async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
};

export const saveAuthStatusTrue = async () => {
    await SecureStore.setItemAsync('isAuth', 'true');
};

export const saveAuthStatusFalse = async () => {
    await SecureStore.setItemAsync('isAuth', 'false');
};

export const getAuthStatus = async () => {
    return await SecureStore.getItemAsync('isAuth');
};

export const getAccessTokenFromSS = async () => {
    return await SecureStore.getItemAsync('refreshToken');
};

export const getRefreshTokenFromSS = async () => {
    return await SecureStore.getItemAsync('accessToken');
};
