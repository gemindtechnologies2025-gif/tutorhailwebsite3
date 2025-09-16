import crypto from 'crypto-js'

export function generateSEKAndHash(token: string | null) {

  const iv = "9g6y5fdletregttv".slice(0, 16);
  try {
  
    const timestamp = new Date().toISOString();
    const deviceId = navigator.userAgent;

    const key = crypto.lib.WordArray.random(32);
    let dataPayload = {};
    if (token === "" || token === null || token === undefined) {
      dataPayload = {
        appKey:   timestamp,
      };
      
    } else {
      dataPayload = {
        authorization: `Bearer ${token}`,
        appKey: new Date().toISOString(),
        deviceId: timestamp,
    
      };
    }
    let appkey = JSON.stringify(dataPayload);

    const encrypted = crypto.AES.encrypt(appkey, key, {
      iv: crypto.enc.Utf8.parse(iv),
      mode: crypto.mode.CBC,
    });
    const encryptedHex = encrypted.ciphertext.toString();
    const keyHash = key.toString();

    return {
      hash: keyHash,
      sek: encryptedHex,
    };
  } catch (error) {
    console.error("", error);
    return null;
  }
}

export function generateEncryptedKeyBody(body: any) {
  const iv = "9g6y5fdletregttv".slice(0, 16);
  try {
    const key = crypto.lib.WordArray.random(32);
    let dataPayload = JSON.stringify(body);

    const encrypted = crypto.AES.encrypt(dataPayload, key, {
      iv: crypto.enc.Utf8.parse(iv),
      mode: crypto.mode.CBC,
    });
    const encryptedHex = encrypted.ciphertext.toString();
    const keyHash = key.toString();

    return {
      hash: keyHash,
      sek: encryptedHex,
    };
  } catch (error) {
    console.error("", error);
    console.log("crypto")
    return null;
  }
}