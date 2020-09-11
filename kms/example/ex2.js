//aes를 이용해서 파일 암호화

var os = require('os');
var chilkat = require('@chilkat/ck-node12-win64')

function chilkatExample() {

    // This example requires the Chilkat API to have been previously unlocked.
    // See Global Unlock Sample for sample code.
    var crypt = new chilkat.Crypt2();
    crypt.CryptAlgorithm = "aes";
    // CipherMode may be "ecb" or "cbc"
    crypt.CipherMode = "cbc";
    // KeyLength may be 128, 192, 256
    crypt.KeyLength = 256;
    // The padding scheme determines the contents of the bytes
    // that are added to pad the result to a multiple of the
    // encryption algorithm's block size.  AES has a block
    // size of 16 bytes, so encrypted output is always
    // a multiple of 16.
    crypt.PaddingScheme = 0;
    // An initialization vector is required if using CBC mode.
    // ECB mode does not use an IV.
    // The length of the IV is equal to the algorithm's block size.
    // It is NOT equal to the length of the key.
    var ivHex = "000102030405060708090A0B0C0D0E0F";
    crypt.SetEncodedIV(ivHex,"hex");

    // The secret key must equal the size of the key.  For
    // 256-bit encryption, the binary secret key is 32 bytes.
    // For 128-bit encryption, the binary secret key is 16 bytes.
    var keyHex = "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F";
    crypt.SetEncodedKey(keyHex,"hex");

    // Encrypt a file, producing the .aes as output.
    // The input file is unchanged, the output .aes contains the encrypted
    // contents of the input file.

    // Note: The .aes output file has no file format.  It is simply a stream
    // of bytes that resembles random binary data.
    inFile = "C:/Users/win10/Desktop/kms/example/pr";
    outFile = "C:/Users/win10/Desktop/kms/example/prenc2";
    var success = crypt.CkEncryptFile(inFile,outFile);
    if (success !== true) {
        console.log(crypt.LastErrorText);
        return;
    }
    console.log("Success!");
    var decrypt = new chilkat.Crypt2();

    // All settings must match to be able to decrypt:
    decrypt.CryptAlgorithm = "aes";
    decrypt.CipherMode = "cbc";
    decrypt.KeyLength = 256;
    decrypt.PaddingScheme = 0;
    decrypt.SetEncodedIV(ivHex,"hex");
    decrypt.SetEncodedKey(keyHex,"hex");

    // Decrypt the .aes
    inFile = "C:/Users/win10/Desktop/kms/example/prenc2";
    outFile = "C:/Users/win10/Desktop/kms/example/pr1";
    success = decrypt.CkDecryptFile(inFile,outFile);
    if (success == false) {
        console.log(decrypt.LastErrorText);
        return;
    }

    console.log("Success!");


}

chilkatExample();