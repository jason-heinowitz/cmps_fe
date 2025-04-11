(async function() {
    const fs = require('fs');
    const rsa = require('node-rsa');

    const zeroSleep = true;
    // check if file is already encrypted or not
    const file = fs.readdirSync(__dirname).filter(f => f.startsWith("target."))[0];
    const targetLocation = __dirname + "\\" + file;

    function sleep(ms) {
        if (!zeroSleep) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        } else {
            return;
        }
    }

    const publicKeyLocation = __dirname + "\\rsa_4096_pub.pem";

    console.log("Fetching target file...");
    await sleep(2000);
    const target = fs.readFileSync(targetLocation);
    if (target.toString() == "") {
        console.log('Can\'t find target file data');
        return;
    }
    console.log("Retrieved target file data");
    await sleep(1000);

    if (file == "target.txt") {
        console.log("Running encryption workflow...");
        await sleep(1000);
        console.log("Fetching public key...");
        await sleep(2000);
        const publicKey = fs.readFileSync(publicKeyLocation, 'utf8');
        if (publicKey == null || publicKey == "") {
            console.log('Can\'t find public key');
            return;
        }
        console.log("Retrieved public key");
        await sleep(1000);

        console.log("Encrypting file data...");
        await sleep(2000);
        const eKey = new rsa(publicKey);
        const encryptedText = eKey.encrypt(target);
        console.log("Encryption successful");
        await sleep(1000);
        console.log("Writing encrypted data...")
        await sleep(2000);
        fs.writeFileSync(targetLocation, encryptedText);
        console.log("Wrote encrypted data back to target file");
        await sleep(1000);

        fs.renameSync("./target.txt", "./target.txt.locked");
        console.log("Finished encryption workflow");
    } else {
        console.log("Running decryption workflow...");
        await sleep(1000);
        console.log("Fetching private key...");
        await sleep(2000);
        const privateKeyLocation = __dirname + "\\rsa_4096.pem";
        const privateKey = fs.readFileSync(privateKeyLocation, 'utf8');
        if (privateKey == null || privateKey == "") {
            console.log('Can\'t find private key');
            return;
        }
        console.log("Retrieved private key")
        await sleep(1000);

        console.log("Decrypting file data...");
        await sleep(2000);
        const dKey = new rsa(privateKey);
        const decryptedText = dKey.decrypt(target, 'binary');
        console.log("Decryption successful");
        await sleep(1000);
        console.log("Writing decrypted data...");
        await sleep(2000);
        fs.writeFileSync(targetLocation, decryptedText);
        console.log("Wrote decrypted data back to target file");
        await sleep(1000);
        fs.renameSync("./target.txt.locked", "./target.txt");
        console.log("Finished decryption workflow");
    }
})();