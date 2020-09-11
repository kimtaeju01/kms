//kms 파일 암호화 및 복호화
const path = require('path');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const fs = require('fs');
//클라이언트 생성
//지역 지정을 해주어야 한다.
const SESConfig = {
    region: "ap-northeast-2",
    accessKeyId : 'AKIA4AJG35IQ3K7RJAI2',
    secretAccessKey : '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',
}
AWS.config.update(SESConfig);
const kmsClient = new AWS.KMS();
console.log('--------------------');
//파일 읽어오기
var data = fs.readFileSync('pr','binary');


var params = {
    KeyId: "02b7f3b9-0dd9-4a56-a9ae-92ed51a576f6" , // The identifier of the CMK to use for encryption. You can use the key ID or Amazon Resource Name (ARN) of the CMK, or the name or ARN of an alias that refers to the CMK.
    Plaintext: data,
};
kmsClient.encrypt(params, function (err,data) {
   if(err) console.log(err,err.stack);
   else {console.log(data);
    var encrytext = data['CiphertextBlob'];
    fs.writeFileSync("./ss",encrytext,{encoding:"base64"});
    };
});


var temp = fs.readFileSync('ss');
params = {
    CiphertextBlob: temp,// The encrypted data (ciphertext).
};
kmsClient.decrypt(params,function(err,data){
    if(err) console.log(err,err.stack);
    else console.log("decrypt:",data.Plaintext.toString());
})

