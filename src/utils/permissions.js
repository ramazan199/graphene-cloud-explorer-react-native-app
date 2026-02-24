import { checkMultiple, requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

const reportCrash = (error, attrs = {}) => {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    const normalizedAttrs = Object.keys(attrs).reduce((acc, key) => {
        const value = attrs[key];
        if (value !== undefined && value !== null) acc[key] = String(value);
        return acc;
    }, {});

    crashlytics().setAttributes({
        screen: 'Permissions',
        platform: Platform.OS,
        ...normalizedAttrs,
    });
    crashlytics().recordError(normalizedError);
    console.log('Reported crash:', normalizedError, normalizedAttrs);
};


export const permissionCheck = async () => {
    if (Platform.OS === 'ios') permissionsCheckerIOS()
    else permissionsCheckerANDROID()

}



// ---- Android ---
const requestPermissionANDROID = async () => {
    try {
        await requestMultiple([
            PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ]);
    } catch (err) {
        reportCrash(err, { flow: 'requestPermissionANDROID' });
        alert(err);
    }
};


const permissionsCheckerANDROID = async () => {
    checkMultiple([PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION, PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then((statuses) => {
        if (statuses[PERMISSIONS.ANDROID.CAMERA] !== RESULTS.GRANTED || statuses[PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION] !== RESULTS.GRANTED || statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== RESULTS.GRANTED || statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !== RESULTS.GRANTED) {
            requestPermissionANDROID()
        }
    });
}

// ---- IOS permissions ----

const requestPermissionIOS = async () => {

    try {
        await requestMultiple([
            PERMISSIONS.IOS.CAMERA,
            PERMISSIONS.IOS.MEDIA_LIBRARY,
            PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
        ]);

    } catch (err) {
        reportCrash(err, { flow: 'requestPermissionIOS' });
        alert(err);
    }
}
const permissionsCheckerIOS = async () => {
    checkMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MEDIA_LIBRARY,
        PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
    ]).then((statuses) => {
        if (statuses[PERMISSIONS.IOS.CAMERA] !== RESULTS.GRANTED || statuses[PERMISSIONS.IOS.MEDIA_LIBRARY] !== RESULTS.GRANTED || statuses[PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY] !== RESULTS.GRANTED) {
            requestPermissionIOS()
        }
    });
}
