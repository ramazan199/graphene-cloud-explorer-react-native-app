import { btoa, toByteArray } from 'react-native-quick-base64';
import { store } from '../store';
import { decryptXorAB, encryptXorAB } from './encryption-utils';
import 'text-encoding';
import { getUserSecretDataMMKV } from './mmkv';
import { useErrorAlert } from '../hooks/useErrorAlert';

export function decodeBase64Url(input) {
    // Replace non-url compatible chars with base64 standard chars
    input = input.replace(/\-/g, '+').replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    let pad = input.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error('Invalid base64url string');
        }
        input += new Array(5 - pad).join('=');
    }
    return input;
}

export function base64ToBuffer(base64) {
    var bytes = toByteArray(base64);
    return bytes.buffer;
    // var binary_string = atob(base64);
    // var len = binary_string.length;
    // var bytes = new Uint8Array(len);
    // for (var i = 0; i < len; i++) {
    //     bytes[i] = binary_string.charCodeAt(i);
    // }
}

export function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function bufferToString(buf) {
    var decoder = new TextDecoder('utf-8');
    return decoder.decode(buf);
}

export function bufferToStringBinary(buf) {
    const buffer = new Uint8Array(buf);
    let result = '';
    let offset = 0;

    while (offset < buffer.length) {
        let size = Math.min(8192, buffer.length - offset);
        result += String.fromCharCode.apply(null, buffer.slice(offset, offset + size));
        offset += size;
    }
    return result;
}

export function joinBuffers(buffer1, buffer2) {
    let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
}

export function int32ToBuffer(int) {
    return numberToBuffer(int, 4);
}

export function int16ToBuffer(short) {
    return numberToBuffer(short, 2);
}

function numberToBuffer(number, returnBytes) {
    var byteBuffer = new Uint8Array(returnBytes);
    for (var index = 0; index < byteBuffer.length; index++) {
        var byte = number & 0xff;
        byteBuffer[index] = byte;
        number = (number - byte) / 256;
    }
    return byteBuffer;
}

//Convert a string into an Buffer (UTF8 encoding)
export function stringToBuffer(str) {
    let encoder = new TextEncoder(); // always utf-8
    return encoder.encode(str).buffer;
}

export function enumToString(enumerator, value) {
    for (var k in enumerator) if (enumerator[k] == value) return k;
    return null;
}

export function bufferToInt(data, offset) {
    offset = offset != undefined ? offset : 0;
    let bytes = data.slice(offset, offset + 4);
    return new Int32Array(bytes)[0];
}

export function splitData(data) {
    let offset = 0;
    let datas = [];
    while (offset < data.byteLength) {
        let len = bufferToInt(data, offset);
        offset += 4;
        let part = data.slice(offset, offset + len);
        datas.push(part);
        offset += len;
    }
    return datas;
}

export function bufferToBase64(buffer) {
    const exportedAsString = bufferToStringBinary(buffer);
    return btoa(exportedAsString);
}

export function bufferToJwkBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    var base64 = btoa(binary);
    var jwk_base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
    return jwk_base64;
}

export function importRsaPublicKey(modulus, exponent) {
    let n = bufferToJwkBase64(modulus);
    let e = bufferToJwkBase64(exponent);
    let jwk = {
        kty: 'RSA',
        n: n,
        e: e,
        alg: 'RSA-OAEP-256',
        ext: true,
    };

    let algo = {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
    };

    var importedKey = window.crypto.subtle
        .importKey('jwk', jwk, algo, true, ['encrypt'])
        .catch(function (err) {
            debugger;
        });

    return importedKey;
}

export function encryptRsaOaep(publicKey, data) {
    let blockSize = 190;
    let promises;
    let i = 0;
    while (i < data.byteLength) {
        let chunk = data.slice(i, i + blockSize);
        let promise = window.crypto.subtle
            .encrypt(
                {
                    name: 'RSA-OAEP',
                },
                publicKey,
                chunk
            )
            .catch(function (err) {
                useErrorAlert('encryptRsaOaep', err);
                // console.log(err);
                return err;
            });
        if (promises == undefined) {
            promises = [promise];
        } else {
            promises = promises.concat([promise]);
        }
        i += blockSize;
    }

    return Promise.all(promises).then(function (buffers) {
        let result;
        buffers.forEach(function (item) {
            if (result == undefined) {
                result = item;
            } else {
                result = joinBuffers(result, item);
            }
        });
        return result;
    });
}

export function importSecretKey(rawKey) {
    return crypto.subtle.importKey('raw', rawKey, 'aes-cbc', false, ['encrypt', 'decrypt']);
}

export function decryptRsaOaep(ciphertext, privateKey) {
    //https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt
    let blockSize = 256;
    let promises;
    let i = 0;
    while (i < ciphertext.byteLength) {
        let chunk = ciphertext.slice(i, i + blockSize);
        let decryptedPromise = window.crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP',
            },
            privateKey,
            chunk
        );
        if (promises == undefined) {
            promises = [decryptedPromise];
        } else {
            promises = promises.concat([decryptedPromise]);
        }
        i += blockSize;
    }

    return Promise.all(promises).then(function (buffers) {
        let result;
        buffers.forEach(function (item) {
            if (result == undefined) {
                result = item;
            } else {
                result = joinBuffers(result, item);
            }
        });
        return result;
    });
}

export async function encryptDataForTheDevice(data) {
    let deviceKey = store.getState().userSecret.deviceKey;
    const { encryptionType } = await getUserSecretDataMMKV();
    // Data greater than about 12k gives an error in decryption. To send larger data it is recommended to break packets with encryptBigDataForTheDevice()
    if (encryptionType == 'xorAB') {
        return encryptXorAB(base64ToBuffer(store.getState().userSecret.publicKeyB64), data);
    } else {
        return crypto.subtle.encrypt({ name: 'aes-cbc', iv: deviceKey.IV }, deviceKey.key, data);
    }
}

export async function decryptDataFromTheDevice(data) {
    let deviceKey = store.getState().userSecret.deviceKey;
    const { encryptionType } = await getUserSecretDataMMKV();

    if (encryptionType == 'xorAB') {
        return decryptXorAB(base64ToBuffer(store.getState().userSecret.publicKeyB64), data);
    }
    return crypto.subtle.decrypt({ name: 'aes-cbc', iv: deviceKey.IV }, deviceKey.key, data);
}
