//kms 평문 암호화 및 복호화
const AWS = require('aws-sdk');
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
var params = {
    KeyId: "02b7f3b9-0dd9-4a56-a9ae-92ed51a576f6" ,
    Plaintext: 'hello worlds'
        };

kmsClient.encrypt(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else{
                console.log(data);
                var encrytext = data['CiphertextBlob'];
                console.log(typeof(encrytext));
                params = {
                    CiphertextBlob: encrytext,// The encrypted data (ciphertext).
                };
                kmsClient.decrypt(params,function(err,data){
                    if(err) console.log(err,err.stack);
                    else console.log("decrypt:",data.Plaintext.toString());
                });

            }           // successful response
        });
