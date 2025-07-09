import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';


let lists = {};

export const displayUploadNotification = async (title, path) => {
    await notifee.requestPermission()
    const channelId = await notifee.createChannel({
        id: 'com.cloudStorage.upload',
        name: 'Default Channel',
        playSound: true
    });
    await notifee.displayNotification({
        title: title,
        body: `File uploading to ${path !== "" ? path : 'Cloud Services'}`,
        android: {
            channelId,
            smallIcon: 'ic_small_icon',
            pressAction: {
                id: 'channel-upload',
            },
        },
    });
}

export const clearUploadNotification = async (title, path) => {
    await notifee.displayNotification({
        title: title,
        body: `File uploaded successfully to ${path !== "" ? path : 'Cloud Services'}`,
        android: {
            channelId: 'com.cloudStorage.upload',
            smallIcon: 'ic_small_icon',
            // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
                id: 'com.cloudStorage.upload',
            },
            // progress: {
            //     max: 10,
            //     current: 5,
            // },
        },
    });
    // await notifee.deleteChannel('com.cloudStorage.upload');
}


export const errorMessageNotification = async () => {
    await notifee.displayNotification({
        title: 'Upload cancelled',
        body: 'Something went wrong, please try again',
        android: {
            channelId: 'com.cloudStorage.upload',
            smallIcon: 'ic_small_icon',
            pressAction: {
                id: 'com.cloudStorage.upload',
            },
        }
    })
    await notifee.deleteChannel('com.cloudStorage.upload');
}


// ---------- new arc ---------

export const downloadNotificationRegister = async ({ id, title, size, max }) => {
    lists[id] = { id, size, max };
    await notifee.requestPermission()
    const channelId = await notifee.createChannel({
        id: 'com.cloudStorage.download',
        name: 'Default Channel',
        playSound: true,
        importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
        id,
        title,
        body: `File downloading | ${size}`,
        android: {
            channelId,
            smallIcon: 'ic_small_icon',
            progress: {
                max: 0,
                current: 0,
                indeterminate: true,
                importance: AndroidImportance.HIGH,
            }
        }
    })
}

export const notificationUpdate = async ({ id, current, title }) => {

    await notifee.displayNotification({
        id,
        title,
        body: `File downloading: ${Math.floor((current * 100) / lists[id].max)}%`,
        android: {
            channelId: 'com.cloudStorage.download',
            smallIcon: 'ic_small_icon',
            style: { type: AndroidStyle.BIGTEXT, text: `Size | ${lists[id].size}` },
            progress: {
                max: lists[id].max,
                current,
                indeterminate: false,
            }
        }
    })
}

export const cancelNotification = async ({ id, title }) => {
    delete lists[id];
    await notifee.displayNotification({
        id,
        title,
        body: "File downloaded successfully | 100%",
        android: {
            channelId: 'com.cloudStorage.download',
            smallIcon: 'ic_small_icon',
            importance: AndroidImportance.HIGH,
        }
    })

}
