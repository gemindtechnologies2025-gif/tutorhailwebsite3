/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
const firebaseConfig = {
  apiKey: "AIzaSyAtmkzL_1Y9LLgOXknagjGh_-TZUbE3U_A",
  authDomain: "tutorhail-c9fd4.firebaseapp.com",
  projectId: "tutorhail-c9fd4",
  storageBucket: "tutorhail-c9fd4.appspot.com",
  messagingSenderId: "831651786344",
  appId: "1:831651786344:web:9301357b0ba7a8d0a315dd",
  measurementId: "G-F1MTV5RGJ4",
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload?.data?.title || "";
  const role=localStorage.getItem("roleName")
  const notificationOptions = {
    body: payload?.data?.message || "",
    icon: "/static/images/logo.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);

  self.addEventListener("notificationclick", function (event) {
    event.notification.close(); 
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        for (let client of windowClients) {
          if (
            client.url === `https://tutorweb.appgrowthcompany.com/${role}/my-bookings` &&
            "focus" in client
            // client.url === `https://tutorhail.com/${role}/my-bookings` &&
            // "focus" in client
           
          ) {
            return client.focus();
          }
        }
        return clients.openWindow(`https://tutorweb.appgrowthcompany.com/${role}/my-bookings`);
        // return clients.openWindow(`https://tutorhail.com/${role}/my-bookings`);

      })
    );
  });

});
