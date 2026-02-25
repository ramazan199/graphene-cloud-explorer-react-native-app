import {
  base64ToBuffer,
  bufferToBase64,
  bufferToHex,
  bufferToInt,
  bufferToString,
  decryptDataFromTheDevice,
  decryptRsaOaep,
  encryptDataForTheDevice,
  encryptRsaOaep,
  enumToString,
  importRsaPublicKey,
  importSecretKey,
  int16ToBuffer,
  int32ToBuffer,
  joinBuffers,
  splitData,
  stringToBuffer,
} from './proxy-cryptography-utils';
import { store } from '../store';
import { decryptXorAB, hash256 } from './encryption-utils';
import { command, chunkSize, thumbnailSize } from '../constants';
import axios from 'axios';
import { setFavoritesList } from '../reducers/fileReducer';
import { openModal } from '../reducers/modalReducer';
import { setOccupiedSpace } from '../reducers/filesInfoReducer';
import {
  addToMMKV,
  getUserSecretDataMMKV,
  removeUserEncryptionTypeMMKV,
  setUserDeviceKeyMMKV,
  setUserEncryptionTypeMMKV,
  userAuthMMKV,
} from './mmkv';
import { setAuthWait, setUserSecretDataToRedux } from '../reducers/userSecretDataReducer';
import { MinHeap } from './MinHeap';
import { DeviceEventEmitter, Platform } from 'react-native';
import {
  finishUploadProgress,
  registerUploadProgress,
  updateUploadProgress,
} from './files-trasnfer';
import { downloadSetProgress } from '../reducers/filesTransferNewReducer';
import {
  downloadNotificationRegister,
  cancelNotification,
  notificationUpdate,
} from './notification-utils';
import { enqueue, forceEnqueue } from '../reducers/refreshQueueReducer';
import { useErrorAlert } from '../hooks/useErrorAlert';
import { parseSingle } from './parser';
import { reportCrash } from './crashlytics-utils';

var download = [];
var upload = [];



const makeUtilMarker = (flow) => `UTIL_FLOW_${flow}_${Date.now()}`;

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export async function setClient(rsaPubKey) {
  // deviceKey = null; // the server will send a new encryption ke
  let clientPublicKey = base64ToBuffer(store.getState().userSecret.publicKeyB64);
  let clientSetting = joinBuffers(int32ToBuffer(chunkSize), int16ToBuffer(thumbnailSize));
  clientSetting = joinBuffers(clientSetting, clientPublicKey);
  return encryptRsaOaep(rsaPubKey, clientSetting).then((clientSettingEncrypted) => {
    return executeRequest(command.SetClient, clientSettingEncrypted);
  });
}

export function getCommandName(commandId) {
  return enumToString(command, commandId);
}

const maxConcurrentRequest = 2;
const REQUEST_TIMEOUT_MS = 30000;
const SLOW_INTERNET_THRESHOLD_MS = 7000;
var concurrentRequest = 0;
let spooler = [];
const shouldShowSlowInternetModal = (commandId) => commandId !== command.GetFile;

DeviceEventEmitter.addListener('spoolerCleaner', () => {
  spooler = [];
  concurrentRequest = 0;
});

export function executeRequest(commandId, data) {
  return new Promise((resolve, reject) => {
    if (commandId === 8) MinHeap.push(spooler, [10, [commandId, data, resolve, reject]]);
    else if (commandId === 19) MinHeap.push(spooler, [8, [commandId, data, resolve, reject]]);
    else MinHeap.push(spooler, [5, [commandId, data, resolve, reject]]);
    spoolingRequest();
  });
}

function requestDone() {
  concurrentRequest--;
  if (spooler.length > 0) {
    return spoolingRequest();
  }
}

async function spoolingRequest() {
  console.log('Concurrent requests:', concurrentRequest);

  if (concurrentRequest < maxConcurrentRequest && spooler.length > 0) {
    concurrentRequest++;
    // -try
    try {
      let [priority, toProcessing] = MinHeap.pop(spooler);
      // spooler.pop();

      console.log('Priority: ', priority, ', CommandId:', getCommandName(toProcessing[0]));
      let commandId = toProcessing[0];
      let data = toProcessing[1];
      let resolve = toProcessing[2];
      let reject = toProcessing[3];

      if (commandId == null) {
        console.log('Command does not exist');
      }
      if (!data) {
        data = '';
      }
      if (typeof data === 'string') {
        data = stringToBuffer(data);
      }
      let get = commandId == command.GetPushNotifications;
      let url =
        store.getState().proxyManager.proxy +
        '/data?cid=' +
        encodeURIComponent(store.getState().userSecret.clientId);
      console.log('url set to: ' + url);

      let purpose;

      if (commandId == command.SetClient || commandId == command.GetEncryptedQR) {
        url += '&sid=' + encodeURIComponent(store.getState().userSecret.serverId);
        purpose = getCommandName(commandId);
        url += '&purpose=' + getCommandName(commandId); // SetClient Parameter is used only in debug that indicates whether a public encryption key is sent to the device. In releise the key is never sent it must be scanned by QR code
      }

      const workPromise = (async () => {
        if (purpose === getCommandName(command.GetEncryptedQR)) {
          const controller = new AbortController();
          const signal = controller.signal;
          let reqTimeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
          let lowInternet = setTimeout(() => {
            store.dispatch(
              openModal({
                head: 'Pay attention',
                content: 'Your internet connection is slow. Would you like to retry?',
                type: 'confirm',
                buttonText: 'Retry',
                icon: 'ex',
                callback: () => {
                  controller.abort();
                  store.dispatch(setAuthWait(false));
                }
              })
            );
          }, SLOW_INTERNET_THRESHOLD_MS);
          try {
            const response = await axios.post(url, data, { timeout: REQUEST_TIMEOUT_MS, signal });
            return onCommandResponse.GetEncryptedQR(response.data);
          } catch (error) {
            console.log('Error fetching encrypted QR data:', error);
            reportCrash(error, {
              screen: 'DataTransmission',
              flow: 'getEncryptedQrRequest',
              commandId,
              proxy: store.getState().proxyManager.proxy,
            });
            return error;
          } finally {
            clearTimeout(reqTimeout);
            clearTimeout(lowInternet);
          }
        } else if (commandId == command.SetClient) {
          const controller = new AbortController();
          const signal = controller.signal;
          let reqTimeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
          let lowInternet = setTimeout(() => {
            store.dispatch(openModal({
              head: 'Pay attention',
              content: 'Your internet connection is slow. Would you like to retry?',
              type: 'confirm',
              buttonText: 'Retry',
              icon: 'ex',
              callback: () => {
                controller.abort();
                store.dispatch(setAuthWait(false));
              }
            }))
          }, SLOW_INTERNET_THRESHOLD_MS)
          try {
            const response = await axios.post(url, data, { timeout: REQUEST_TIMEOUT_MS, signal });
            clearTimeout(reqTimeout);
            clearTimeout(lowInternet);
            return handleResponse(response);
          } catch (error) {
            reportCrash(error, {
              screen: 'DataTransmission',
              flow: 'setClientRequest',
              commandId,
              proxy: store.getState().proxyManager.proxy,
            });
            clearTimeout(reqTimeout);
            clearTimeout(lowInternet);
            store.dispatch(setAuthWait(false));

            if (error.name !== 'CanceledError' && error.name !== 'AbortError' && error.message !== 'canceled') {
              store.dispatch(
                openModal({
                  head: 'Pay attention',
                  content:
                    'There was a problem connect to Uup-Cloud. Please try again and make sure the Cloud Box or mobile phone is connected to the Internet.',
                  type: 'info',
                  icon: 'ex',
                })
              );
            }
          }
        } else if (get) {
          const controller = new AbortController();
          const signal = controller.signal;
          let reqTimeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
          let lowInternet = setTimeout(() => {
            store.dispatch(openModal({
              head: 'Pay attention',
              content: 'Your internet connection is slow. Would you like to retry?',
              type: 'confirm',
              buttonText: 'Retry',
              icon: 'ex',
              callback: () => {
                controller.abort();
              }
            }))
          }, SLOW_INTERNET_THRESHOLD_MS)
          try {
            const response = await axios.get(url, { timeout: REQUEST_TIMEOUT_MS, signal });
            clearTimeout(reqTimeout);
            clearTimeout(lowInternet);
            return handleResponse(response);
          } catch (error) {
            reportCrash(error, {
              screen: 'DataTransmission',
              flow: 'getRequest',
              commandId,
              proxy: store.getState().proxyManager.proxy,
            });
            return error;
          } finally {
            clearTimeout(reqTimeout);
            clearTimeout(lowInternet);
          }
        } else {
          if (data == null) {
            data = int32ToBuffer(commandId);
          } else {
            let cmd = int32ToBuffer(commandId);
            data = joinBuffers(cmd, data);
          }
          return await encryptDataForTheDevice(data, commandId)
            .then(async (encrypted) => {
              const controller = new AbortController();
              const signal = controller.signal;
              let reqTimeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
              let lowInternet = shouldShowSlowInternetModal(commandId)
                ? setTimeout(() => {
                  store.dispatch(openModal({
                    head: 'Pay attention',
                    content: 'Your internet connection is slow. Would you like to retry?',
                    type: 'confirm',
                    buttonText: 'Retry',
                    icon: 'ex',
                    callback: () => {
                      controller.abort();
                    }
                  }))
                }, SLOW_INTERNET_THRESHOLD_MS)
                : null;
              try {
                const response = await axios.post(url, encrypted, { timeout: REQUEST_TIMEOUT_MS, signal });
                const result = await handleResponse(response);
                clearTimeout(reqTimeout);
                clearTimeout(lowInternet);
                return result;
              } catch (error) {
                reportCrash(error, {
                  screen: 'DataTransmission',
                  flow: 'encryptedPostRequest',
                  commandId,
                  proxy: store.getState().proxyManager.proxy,
                });
                clearTimeout(reqTimeout);
                clearTimeout(lowInternet);
                if (error.name !== 'CanceledError' && error.name !== 'AbortError' && error.message !== 'canceled') {
                  store.dispatch(
                    openModal({
                      head: 'Failed to connect',
                      content:
                        'Please try again and make sure the Cloud Box or device is connected to the Internet and Cloud Box working correctly.',
                      type: 'confirm',
                      callback: () => {
                        DeviceEventEmitter.emit('spoolerCleaner');
                        store.dispatch(enqueue(['CloudScreen', 'MediaScreen', 'FavoriteScreen']));
                      },
                    })
                  );
                }
              }
            })
            .catch((error) => {
              reportCrash(error, {
                screen: 'DataTransmission',
                flow: 'encryptDataForTheDevice',
                commandId,
                proxy: store.getState().proxyManager.proxy,
              });
            });
        }
      })();

      workPromise
        .then((result) => resolve?.(result))
        .catch((error) => reject?.(error));
    } catch (error) {
      reportCrash(error, {
        screen: 'DataTransmission',
        flow: 'spoolingRequest',
        proxy: store.getState().proxyManager.proxy,
      });
    } finally {
      requestDone();
    }
  }
}

async function handleResponse(response) {
  // console.log('Handling response');  log for
  if (
    response.readyState == response.DONE &&
    response.status == 200 &&
    response.responseText != ''
  ) {
    const { encryptionType } = await getUserSecretDataMMKV();
    if (encryptionType === 'xorAB') {
      // Use the generated key sent by the server
      return decryptResponse(response.data).then((decrypted) => {
        return onResponse(decrypted);
      });
    } else {
      // Use encryption with keys generated on the client
      return asymmetricalDecrypt(response.data).then((decrypted) => {
        return onResponse(decrypted);
      });
    }
  }
}

export function onResponse(binary) {
  let commandId = bufferToInt(binary.slice(0, 4));
  let command = getCommandName(commandId);
  let data = binary.slice(4);
  let params = splitData(data);
  return onCommandResponse[command](params);
}

export function decryptResponse(encryptedResponseB64) {
  let encryptedData = base64ToBuffer(encryptedResponseB64);
  let data = decryptDataFromTheDevice(encryptedData);
  return data;
}

export async function authentication(auth, clientId) {
  let pin = store.getState().userSecret.devicePin;
  let pin4 = int32ToBuffer(pin);
  let authentication = joinBuffers(auth, pin4);
  const hash = await hash256(authentication);
  let verify = hash.slice(0, 4);
  return await executeRequest(command.Authentication, verify, clientId);
}

export function downloadArrayBuffer(fileName, bytes, isShare) {
  let extension = fileName.substring(fileName.lastIndexOf('.') + 1);
  extension = extension.toLowerCase();
  let type;
  switch (extension) {
    case 'mp4':
    case 'mpg':
    case 'mpeg':
    case 'mpe':
      type = 'video/mpeg';
      break;
    case 'mov':
    case 'qt':
    case 'movie':
      type = 'video/quicktime';
      break;
    case 'avi':
      type = 'video/x-msvideo';
      break;
    case 'mp3':
      type = 'audio/mpeg';
      break;
    case 'jpg':
    case 'jpeg':
      type = 'image/jpeg';
      break;
    case 'png':
      type = 'image/png';
      break;
    case 'tif':
      type = 'image/tiff';
      break;
    case 'ico':
      type = 'image/ico';
      break;
    case 'doc':
    case 'docx':
      type = 'application/msword';
      break;
    default:
      type = 'application/' + extension;
  }
  if (isShare) {
    var isShare = confirm('Share ' + fileName + ' ?');
  }
  if (isShare) {
    // NOTE: In the tested browser the share function does not work, it returns an error on permissions in performing the operation. So in fact you need to download and then share the file
    let file = new File([bytes], fileName, { type: type });
    let filesArray = [];
    filesArray.push(file);
    navigator
      .share({
        files: filesArray,
        title: 'Share file',
        text: fileName,
      })
      .then(() => console.log('Share was successful.'))
      .catch((error) => {
        // alertBox(error);
        console.log('Sharing failed', error);
      });
  } else {
    // return `data:${type};base64, ${bufferToBase64(bytes)}`;
    const bufferedToBase64 = bufferToBase64(bytes);
    return {
      type,
      data: bufferedToBase64,
      thumbnail: `data:${type};base64, ${bufferedToBase64}`,
    };
  }
}

export const onCommandResponse = {
  SetClient: function (params) {
    console.log('The device received the public key in debug mode!');
  },
  Authentication: async function (params) {
    await userAuthMMKV();
    DeviceEventEmitter.emit('logIn');
    store.dispatch(forceEnqueue("CloudScreen"))
    store.dispatch(setAuthWait(false));
    store.dispatch(
      openModal({
        content: 'You successfully authenticated your account',
        head: 'Successful',
        type: 'info',
        icon: 'qr',
      })
    );
    // return getDir("");
    // getDir("");
  },
  // Successful pairing with the device: When the device has scanned the QR code with the public key we receive the encryption key that we must use to send and receive commands to the server!
  Pair: async function (params) {
    let clientIdHex = bufferToHex(params[0]);
    let deviceIV = params[2];
    let auth = params[3];
    if (clientIdHex != store.getState().userSecret.clientId) {
      // console.log('Wrong connection, key verification failed!');  log for
    } else if (store.getState().userSecret.deviceKey != undefined) {
      // console.log('Attempt to change the encryption key!');  log for
    } else {
      let deviceKey;
      if (params[1].byteLength > 0) {
        await setUserEncryptionTypeMMKV('aes');
        store.dispatch(setUserSecretDataToRedux({ encryptionType: 'aes' }));
        deviceKey = params[1];
        importSecretKey(deviceKey).then(async (key) => {
          deviceKey.key = key;
          deviceKey.IV = deviceIV;
          let fin = { key: key, IV: deviceIV };

          await setUserDeviceKeyMMKV(fin);
          store.dispatch(setUserSecretDataToRedux({ deviceKey: fin }));
        });
      } else {
        await setUserEncryptionTypeMMKV('xorAB');
        store.dispatch(setUserSecretDataToRedux({ encryptionType: 'xorAB' }));
      }
    }
    // Authentication
    return authentication(auth, store.getState().userSecret.clientId);
  },

  // Error: async function (params) {
  //   let error = bufferToString(params[0]);
  //   // useErrorAlert('error -> ', error);
  //   if (error && error === 'error: wrong pin') {
  //     await removeUserEncryptionTypeMMKV();
  //     store.dispatch(setAuthWait(false));
  //     store.dispatch(setUserSecretDataToRedux(null));
  //     store.dispatch(
  //       openModal({
  //         content: 'Qr or pin is incorrect',
  //         head: 'Error',
  //         type: 'info',
  //         icon: 'qr',
  //         callback: async () => {
  //           // await AsyncStorage.multiRemove(["clientId", "encryptionType", "publicKeyB64", "serverId", "auth"])
  //           // store.dispatch(renderScreen(['WelcomeScreen']))
  //         },
  //       })
  //     );
  //   }
  // },
  GetDir: function (params) {
    // let currentPath = bufferToString(params[0]);
    let jsonObject = JSON.parse(bufferToString(params[1]));
    return jsonObject;
  },

  Error: async function (params) {
    let error = bufferToString(params[0]);
    // useErrorAlert('error -> 2', error);
    if (error && error === 'error: wrong pin') {
      store.dispatch(setAuthWait(false));
      await removeUserEncryptionTypeMMKV();
      // store.dispatch(setUserSecretDataToRedux(null));
      // store.dispatch(setUserSecretDataToRedux())
      // console.log(error);
      store.dispatch(
        openModal({
          content: 'Wrong pin',
          head: 'Error',
          type: 'info',
          icon: 'qr',
          callback: async () => { },
        })
      );
      return false;
    }
  },

  GetFile: function (params, isShare) {
    if (isShare === undefined) {
      isShare = false;
    }

    let jsonObject = JSON.parse(bufferToString(params[0]));
    // let crc = jsonObject.Crc; // uint
    let fullName = jsonObject.FullName; // string
    let filename = fullName.replace(/^.*[\\\/]/, '');
    let dataBase64 = jsonObject.Data; // base64
    let chunkPart = jsonObject.ChunkPart;
    let totalChunk = jsonObject.TotalChunk;
    const isTrackedDownload = store.getState().newFileTransfer.downloadQueue.includes(fullName);

    if (chunkPart == 1) {
      download[fullName] = base64ToBuffer(dataBase64);
      if (isTrackedDownload) {
        store.dispatch(downloadSetProgress({ path: fullName, progress: 0 }));
      }
      let selectedFile = store.getState().files.selectedFile;
      let mb = bytesToSize(selectedFile['Length']);
      downloadNotificationRegister({ id: fullName, title: fullName, size: mb, max: totalChunk });
    } else {
      if (isTrackedDownload) {
        const progress = Math.floor((chunkPart * 100) / totalChunk);
        store.dispatch(downloadSetProgress({ path: fullName, progress }));
      }
      Platform.OS === 'android' &&
        notificationUpdate({ id: fullName, current: chunkPart, title: fullName });
      download[fullName] = joinBuffers(download[fullName], base64ToBuffer(dataBase64));
    }
    //   downloadProgressBar(filename, download[fullName].byteLength)

    if (chunkPart == totalChunk) {
      if (isTrackedDownload) {
        store.dispatch(downloadSetProgress({ path: fullName, progress: 100 }));
      }
      cancelNotification({ id: fullName, title: fullName });
      const buffer = downloadArrayBuffer(filename, download[fullName], isShare);
      download[fullName] = null;
      return buffer;
    } else {
      return getFile(fullName, chunkPart + 1);
    }
  },
  Share: function (params) {
    return this.GetFile(params, true);
  },
  SetFile: function (params) {
    // let nameFileAndChunk = bufferToString(params[0]);
    // let nameFileAndChunkParts = nameFileAndChunk.split('\t');
    // let fullNameFile = nameFileAndChunkParts[0];
    // let chunkNumber = parseInt(nameFileAndChunkParts[1]);
    // return setFile(fullNameFile, chunkNumber + 1, upload[fullNameFile]);
    return true;
  },
  Delete: function (params) {
    return this.GetDir(params);
  },
  Rename: function (params) {
    return this.GetDir(params);
  },
  Move: function (params) {
    return this.GetDir(params);
  },
  Copy: function (params) {
    // return this.GetDir(params);
  },
  CreateDir: function (params) {
    return this.GetDir(params);
  },
  Search: function (params) {
    return this.GetDir(params);
  },
  GetGroup: function (params) {
    return this.GetDir(params);
  },
  AddToGroup: function (params) {
    return this.GetDir(params);
  },
  RemoveFromGroup: function (params) {
    return this.GetDir(params);
  },
  GetStorageInfo: function (params) {
    let freeSpace = bufferToString(params[0]);
    let usedSpace = bufferToString(params[1]);
    return { usedMemory: usedSpace, totalMemory: freeSpace };
  },
  GetOccupiedSpace: function (params) {
    let path = bufferToString(params[0]);
    if (path == '') {
      path = 'cloud';
    }
    let regEx = bufferToString(params[1]);
    let spaceOccupied = bufferToString(params[2]);
    store.dispatch(
      setOccupiedSpace({
        type: regEx,
        size: Math.floor(parseInt(spaceOccupied)),
        total: store.getState().profile.usedMemory,
      })
    );
    return spaceOccupied;
  },
  GetEncryptedQR: function (encryptedDataB64) {
    let encryptedData = base64ToBuffer(encryptedDataB64);
    decryptXorAB(store.getState().userSecret.qr, encryptedData).then((data) => {
      store.dispatch(setUserSecretDataToRedux({ qr: null }));
      let offset = 0;
      let type = new Uint8Array(data.slice(offset, 1))[0];
      if (type == 2) {
        offset += 1;
        let mSize = 2048 / 8; //NOTE: modules with sizes different of 2048 give an error during encryption in JavaScript
        let modulus = data.slice(offset, offset + mSize);
        offset += mSize;
        let exponent = data.slice(offset, offset + 3);
        importRsaPublicKey(modulus, exponent).then((rsaPubKey) => {
          setClient(rsaPubKey);
        });
      } else {
        // console.log("QR code format not supported!")  log for s
      }
    });
  },
};

export function getDir(path) {
  return executeRequest(command.GetDir, path);
}

export const setFileStream = async (b64, file, index, path) => {
  // chunkSize -> chunk size
  let totalChunk = Math.ceil(file.size / chunkSize);
  let position = (index - 1) * chunkSize;
  if (index === 1) {
    registerUploadProgress({
      name: file.name,
      size: file.size,
      chunkNumber: index,
      parts: totalChunk,
    });
  }

  if (index < totalChunk) {
    updateUploadProgress({
      name: file.name,
      size: position,
      chunkNumber: index,
      parts: totalChunk,
    });
  }

  if (index > totalChunk) {
    finishUploadProgress({
      name: file.name,
      size: position,
      chunkNumber: index,
      parts: totalChunk,
    });
    const res = await getDir(path);
    let find = res.find((item) => item.Name == file.name);
    let currentFile = parseSingle(find, path);
    return addToMMKV(currentFile);
  }

  let File = {
    FullName: path + file.name,
    Data: b64,
    ChunkPart: index,
    TotalChunk: totalChunk,
  };
  return executeRequest(command.SetFile, JSON.stringify(File));
};

// export async function setFile(fullFileName, chunkNumber, data) {
//   // chunkNumber is base 1 (the first chunk is number 1)
//   var chunkSize = 1024 * 256;
//   let fileLength = new Uint8Array(data).length;
//   let parts = Math.ceil(fileLength / chunkSize);
//   parts = parts == 0 ? 1 : parts;
//   let position = (chunkNumber - 1) * chunkSize;

//   if (chunkNumber == 1) {
//     registerUploadProgress({ name: fullFileName, size: fileLength, chunkNumber, parts })
//     upload[fullFileName] = data;
//   }
//   if (chunkNumber > parts) {
//     upload[fullFileName] = null;
//     let path = fullFileName.split('/').slice(0, -1).join('/');
//     const uploadedFileName = fullFileName.split('/').pop();
//     finishUploadProgress({ name: fullFileName, size: position, chunkNumber, parts });

//     return getDir(path).then(res => {
//       let find = res.find(item => item.Name == uploadedFileName)
//       return {
//         file: find,
//         response: res
//       }
//     })
//     // return getDir(path).then((alldata) => {
//     //   const found = alldata.find(function (post, index) {
//     //     if (post.Name == upladedFileName) return true;
//     //   });
//     //   return found;
//     // });
//     // return getDir(path);
//   } else {
//     updateUploadProgress({ name: fullFileName, size: position, chunkNumber, parts });
//   }

//   let toTake = fileLength - position;
//   if (toTake > chunkSize) toTake = chunkSize;
//   let chunkData = data.slice(position, position + toTake);
//   let File = {
//     FullName: fullFileName,
//     Data: bufferToBase64(chunkData),
//     ChunkPart: chunkNumber,
//     TotalChunk: parts,
//   };
//   // onComplete;
//   console.log({
//     FullName: fullFileName,
//     Data: bufferToBase64(chunkData).slice(0, 7),
//     ChunkPart: chunkNumber,
//     TotalChunk: parts,
//   });
//   return executeRequest(command.SetFile, JSON.stringify(File));
// }

export function asymmetricalDecrypt(encryptedResponseB64) {
  let encryptedData = base64ToBuffer(encryptedResponseB64);
  return decryptRsaOaep(encryptedData, store.getState().userSecret.privateKey);
}

export function getFile(fullFileName, chunkNumber) {
  // chunkNumber is base 1 (the first chunk is number 1)
  return executeRequest(command.GetFile, fullFileName + '\t' + chunkNumber);
}

export function search(path, wildcards, page, elementForPage) {
  // for pagination page is the page number (zero base), and elementsForPage indicates how many results are visible for each single page (-1 = do not limit the results)
  if (wildcards) {
    return executeRequest(
      command.Search,
      path + '\t' + wildcards + '\t' + page + '\t' + elementForPage
    );
  }
}

export function GetStorageInfo() {
  return executeRequest(command.GetStorageInfo);
}

export function getGroup(groupName) {
  return executeRequest(command.GetGroup, groupName);
}

function startsWithNumber(str) {
  return /^\d/.test(str);
}

function getNumberAtEnd(str) {
  if (startsWithNumber(str)) {
    let current = Number(str.match(/^\d+/)[0]);
    return str.replace(/^\d+/, current + 1);
  }

  return '0_copy_' + str;
}

export const getFavoritesNames = async () => {
  const data = await getGroup('favorities');
  const names = data?.map((items) => items.Name.replace('loudBoxNuget/Cloud0/', ''));
  store.dispatch(setFavoritesList(names));
  return data;
};

export const delete_ = (path, files) => {
  if (files) {
    if (Array.isArray(files)) {
      files = files.join('\t');
    }
    return executeRequest(command.Delete, path + '\t' + files);
  }
};

export const createDir = (path, files) => {
  return executeRequest(command.CreateDir, path + '\t' + files);
};

export function addToGroup(groupname, files, clientId) {
  if (Array.isArray(files)) files = files.join('\t');
  return executeRequest(command.AddToGroup, groupname + '\t' + files, clientId);
}

export function removeFromGroup(groupname, files) {
  if (Array.isArray(files)) files = files.join('\t');
  return executeRequest(command.RemoveFromGroup, groupname + '\t' + files);
}

export function rename(path, files, target) {
  if (Array.isArray(files)) files = files.join('\t');
  return executeRequest(command.Rename, path + '\t' + files + '\t' + target);
}

export function copy(path, files, target) {
  if (Array.isArray(files)) {
    files = files.join('\t');
  }
  return executeRequest(command.Copy, path + '\t' + files + '\t' + target);
}

export function move(path, files, target) {
  if (Array.isArray(files)) files = files.join('\t');
  return executeRequest(command.Move, path + '\t' + files + '\t' + target);
}
export function GetOccupiedSpace(path, wilscards) {
  // The wildcard can be replaced by regular expressions to perform advanced searches
  if (wilscards) {
    return executeRequest(command.GetOccupiedSpace, path + '\t' + wilscards);
  }
}
