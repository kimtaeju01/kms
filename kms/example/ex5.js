//datakey로 문장 암호화 및 복호화
//aes알고리즘 볼 것.
const aws = require('aws-sdk');
const crypto = require('crypto');
const fs = require('fs');
function generateDataKey() {
    const kms = new aws.KMS({
        region: "ap-northeast-2",
        accessKeyId : 'AKIA4AJG35IQ3K7RJAI2',
        secretAccessKey : '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', //접근자에 대한 정보
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
    const encryptor = crypto.createCipheriv(algorithm, key, iv); //암호화하는 객체 생성, iv는 초기화 벡터로 암호화 순서 및 규칙에 대한 표준을 정의한다.
    encryptor.write(buffer);
    encryptor.end();
    return encryptor.read();
}
function decryptAES(key, buffer) {
    const algorithm = 'AES-256-CBC';

    const iv = Buffer.from('00000000000000000000000000000000', 'hex');

    const decryptor = crypto.createDecipheriv(algorithm, key, iv);

    decryptor.write(buffer);
    decryptor.end();

    return decryptor.read();

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
//새로운 datakey를 만들고 암복호화 실행하는 콛,
generateDataKey() //then은 generateDataKey 가 제대로 실행이 되었을 때 실행하는 것
    .then(data => { //data는 매번 다르게 생성된다.
        console.log("data:" ,data.Plaintext.toString('hex')); //256bit 다.
        var text = fs.readFileSync('pr','binary');
        const cipherTextBlob = encryptAES(data.Plaintext, text); //abc라는 문장을 암호화 한다.
        for (let i = 0; i < data.Plaintext.length; i++) { //key data는 없어져야 하기 때문에 null 값으로 초기화 한다.
            data.Plaintext[i] = null;
        }
        decrypt(data.CiphertextBlob) //복호화할 때는 암호화된 data key를 이용해 원래의 data key를 복호화한 후 암호문을 복호화한다.
            .then(key =>    {
                console.log(key); //원래 키
                const dataBuffer = decryptAES(key, cipherTextBlob); //복호화한 데이터
                fs.writeFileSync("./ss",dataBuffer,{encoding:"base64"});
                console.log(dataBuffer.toString('utf-8'));
            });
    });
//기존의 data key를 사용하는 코드
//data.Plaintext = data key, data.CiphertextBlob = 암호화된 data key
/*
var text = fs.readFileSync('pr','binary');
    const cipherTextBlob = encryptAES(data.Plaintext, text); //abc라는 문장을 암호화 한다.
    for (let i = 0; i < data.Plaintext.length; i++) { //key data는 메모리상에서 없어져야 하기 때문에 null 값으로 초기화 한다.
        data.Plaintext[i] = null;
    }
    decrypt(data.CiphertextBlob) //복호화할 때는 암호화된 data key를 이용해 원래의 data key를 복호화한 후 암호문을 복호화한다.
        .then(key =>    {
            console.log(key); //원래 키
            const dataBuffer = decryptAES(key, cipherTextBlob); //복호화한 데이터
            fs.writeFileSync("./ss",dataBuffer,{encoding:"base64"});
            console.log(dataBuffer.toString('utf-8'));
        });
 */