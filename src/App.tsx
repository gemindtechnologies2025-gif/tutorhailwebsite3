import { useEffect, useState } from "react";
// import "./App.css";
import "./App.scss";
import Routing from "./Routes";
import { socket, Socket_URL } from "./utils/socket";
import { useAppSelector } from "./hooks/store";
import { getToken } from "./reducers/authSlice";
import { firebaseCloudMessaging } from "./utils/firebase";
import { toast } from "sonner";

function App() {
  const socketToken = useAppSelector(getToken);

  function onConnect() {
    console.log("connected");
  }
  function onDisconnect() {
    console.log("disconnected");
  }
  function onError(error: any) {
    console.error("Socket connection error:", error);
  }

  useEffect(() => {
    if (socketToken?.length) {
      const modifiedURL = `${Socket_URL}?token=${socketToken || ""}`;
      socket.io.uri = modifiedURL;
      if (!socket?.connected) {
        socket.connect();
      }
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("error", onError);
      return () => {
        socket.disconnect();
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("error", onError);
      };
    } else {
      socket.disconnect();
    }
  }, [socketToken]);

  useEffect(() => {
    console.log("newwwwww");
    async function registerServiceWorker() {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      }
    }

    async function setToken() {
      try {
        const registration = await navigator.serviceWorker.ready; // Ensures service worker is ready
        const fcmToken = await firebaseCloudMessaging.init();
        if (fcmToken) {
          console.log("fcm_Token", fcmToken);
        }
      } catch (error) {
        console.log("Error setting FCM token:", error);
      }
    }

    registerServiceWorker().then(setToken); // Register service worker first, then set FCM token

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        try {
          event?.source?.postMessage("Hi client");
          console.log("Event from the service worker:", event);
          toast(
            <div style={{ height: "100%" }}>
              <div style={{ color: "#820000" }}>
                {event?.data?.notification?.title}
              </div>
              <div style={{ color: "#1d1d1d", paddingTop: "10px" }}>
                {event?.data?.notification?.body}
              </div>
            </div>
          );
        } catch (e) {
          console.error("Error handling service worker message:", e);
        }
      });
    }

    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "notifications" })
        .then((notificationPerm) => {
          notificationPerm.onchange = function () {
            if (notificationPerm.state === "granted") {
              setToken();
              if (window) {
                window.location.reload();
              }
            }
          };
        });
    }

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", (e) =>
          console.log(e)
        );
      }
    };
  }, []);



  return (
    <div className="App">
      <Routing />
    </div>
  );
}

export default App;
