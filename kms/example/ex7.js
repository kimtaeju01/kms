//keyring 구현
const { KmsKeyringNode, encrypt, decrypt } = require("@aws-crypto/client-node");
const masterKeyId = "arn:aws:kms:ap-northeast-2:825252112929:key/f3011fd4-cd14-45df-a9d3-5f326935e2d5";
const keyring = new KmsKeyringNode({ generatorKeyId:masterKeyId });
const aws = require('aws-sdk');
const context = {
    accountId: "100",
    purpose: "youtube demo",
    country: "ap-northeast-2"
};

const kms = new aws.KMS({
    region: "ap-northeast-2",
    accessKeyId : 'AKIA4AJG35IQ3K7RJAI2',
    secretAccessKey : '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',
});
let plainText = "My passwords for senstive data";
kms.encrypt(keyring, plainText, { encryptionContext: context },function (err,data) {
    if(err) console.log(err,err.stack);
    else console.log(data);
});
