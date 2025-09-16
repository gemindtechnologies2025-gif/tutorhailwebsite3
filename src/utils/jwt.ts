import { SignJWT } from "jose";

export const ZOOM_APP_KEY = "YP8IaT01eftU7faN7SnFG3L00ZeZ7IBmCoc5";
export const ZOOM_APP_SECRET = "3uPrsonmYn6LHWO8oM2l6BtR6IOwHzKMy7dr";

function makeId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default async function generateJwt(
  sessionName: string,
  roleType: string
) {
  try {
    const payload = {
      app_key: ZOOM_APP_KEY,
      version: 1,
      user_identity: makeId(10),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 23 * 3600,
      tpc: sessionName,
      role_type: parseInt(roleType, 10),
      cloud_recording_option: 1,
    };

    const secret = new TextEncoder().encode(ZOOM_APP_SECRET); // Secret as Uint8Array
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    return token;
  } catch (e) {
    console.error("Error generating JWT:", e);
    return "";
  }
}
