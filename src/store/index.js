import { configureStore } from '@reduxjs/toolkit'
import bottomSheetManagerReducer from '../reducers/bottomSheetReducer'
// import dataSlice from '../reducers/dataReducer'
import fileManagerReducer from '../reducers/fileReducer'
import modalReducer from '../reducers/modalReducer'
import networkConnectionSlice from '../reducers/networkConnectionReducer'
import profileActionsReducer from '../reducers/profileActionsReducer'
import screenControllerReducer from '../reducers/screenControllerReducer'
import screenRendererReducer from '../reducers/screenRerenderReducer'
import testReducer from '../reducers/testReducer'
import filesInfoReducer from '../reducers/filesInfoReducer';
import userSecretDataReducer from '../reducers/userSecretDataReducer';
import newFileTransferReducer from '../reducers/filesTransferNewReducer'
import refreshQueueReducer from '../reducers/refreshQueueReducer'
import proxyManager from '../reducers/proxyReducer'

export const store = configureStore({
    reducer: {
        bottomSheetManager: bottomSheetManagerReducer,
        screenController: screenControllerReducer,
        files: fileManagerReducer,
        rerender: screenRendererReducer,
        modalController: modalReducer,
        test: testReducer,
        profile: profileActionsReducer,
        network: networkConnectionSlice,
        fileOccupiedInfo: filesInfoReducer,
        userSecret: userSecretDataReducer,
        newFileTransfer: newFileTransferReducer,
        refreshReducer: refreshQueueReducer,
        proxyManager: proxyManager
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})