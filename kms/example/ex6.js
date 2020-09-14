//비대칭키를 이용하여 sign.
//
const aws = require('aws-sdk');

const kms = new aws.KMS({
    region: "ap-northeast-2",
    accessKeyId : 'AKIA4AJG35IQ3K7RJAI2',
    secretAccessKey : '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', //접근자에 대한 정보
});
function Sign(){
    const params = {
        KeyId: '4e3040e7-d7bc-4715-9e8f-c197533957d2',
        Message: "123",
        SigningAlgorithm: 'ECDSA_SHA_256',
    }
    return new Promise((resolve,reject)=>{
        kms.sign(params,function (err,data){
            if(err){
                reject(err);
            } else {
                data['Message'] = params.Message;
                resolve(data);
            }
        })
    });
}

function Verify(param){
    kms.verify(param,function(err,data){
       if(err) console.log(err);
       else {
           console.log("Verify");
           console.log(data);
       }
    });
}
//실행 코드
Sign().then(
    data => {
        console.log(data);
        Verify(data);
    }
)