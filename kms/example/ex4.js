//datakey로 암호화 및 복호화
//aes알고리즘 볼 것.
const aws = require('aws-sdk');
const crypto = require('crypto');
function generateDataKey() {
    const kms = new aws.KMS({
        region: "ap-northeast-2",
        accessKeyId : 'AKIA4AJG35IQ3K7RJAI2',
        secretAccessKey : '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',
    });
    return new Promise((resolve, reject) => {
        const params = {
            KeyId: '02b7f3b9-0dd9-4a56-a9ae-92ed51a576f6', // The identifier of the CMK to use to encrypt the data key. You can use the key ID or Amazon Resource Name (ARN) of the CMK, or the name or ARN of an alias that refers to the CMK.
            KeySpec: 'AES_256'// Specifies the type of data key to return.
        };
        kms.generateDataKey(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}
function encryptAES(key, buffer) {
    const algorithm = 'AES-256-CBC';

    const iv = Buffer.from('00000000000000000000000000000000', 'hex');
    encryptor = crypto.createCipheriv(algorithm, key, iv);
    encryptor.write(buffer);
    encryptor.end();

    return encryptor.read();
}
function decryptAES(key, buffer) {
    const algorithm = 'AES-256-CBC';

    const iv = Buffer.from('00000000000000000000000000000000', 'hex');

    encryptor = crypto.createDecipheriv(algorithm, key, iv);
    encryptor.write(buffer);
    encryptor.end();

    return encryptor.read();

}
function decrypt(buffer) {
    const kms = new aws.KMS({
        region: "ap-northeast-2",
        accessKeyId : 'AKIA4AJG35IQ3K7RJAI2',
        secretAccessKey : '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',
    });
    return new Promise((resolve, reject) => {
        const params = {
            CiphertextBlob: buffer// The data to dencrypt.
        };
        kms.decrypt(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Plaintext);
            }
        });
    });
}
generateDataKey()
    .then(data => {
        const cipherTextBlob = encryptAES(data.Plaintext, new Buffer('abc', 'utf-8'));
        for (let i = 0; i < data.Plaintext.length; i++) {
            data.Plaintext[i] = null;
        }
        decrypt(data.CiphertextBlob)
            .then(key =>    {
                console.log(key);
                const dataBuffer = decryptAES(key, cipherTextBlob);
                console.log(dataBuffer.toString('utf-8'));
            });
    });