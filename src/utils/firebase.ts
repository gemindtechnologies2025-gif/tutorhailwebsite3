import { getMessaging, getToken } from "firebase/messaging";
import { getFromStorage, setToStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import app from "./firebaseKeys";

const firebaseCloudMessaging = {
  // eslint-disable-next-line consistent-return
  init: async () => {
    try {
      const messaging = getMessaging(app);
      const tokenInLocalForage = await getFromStorage(STORAGE_KEYS.fcmToken);

      if (tokenInLocalForage) {
        return tokenInLocalForage;
      }

      const status = await Notification.requestPermission();
      if (status && status === "granted") {
        const fcm_token = await getToken(messaging, {
          vapidKey:
            "BCjWv1Ugsq1MQm9iyEj0tMGdKbAMh-5nVxOgN_NkMaie7eO8MPVdV3QpuPvfnRAHkMJ71bcK3uJeQwlc0Gdamvk",
        });
        //        console.log(fcm_token,"fcm_token in firebase file");

        if (fcm_token) {
          //          console.log({ fcm_token });
          setToStorage(STORAGE_KEYS.fcmToken, fcm_token);
          return fcm_token;
        }
      } else {
        console.log("Notification permission not granted.");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
    // }
  },
};

export { firebaseCloudMessaging };
