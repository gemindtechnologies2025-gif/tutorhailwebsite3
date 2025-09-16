import io from "socket.io-client";

// export const Socket_URL = "https://tutorapi.appgrowthcompany.com";
// export const Socket_URL = "https://api.tutorhail.com";

export const Socket_URL = process.env.REACT_APP_SOCKET_URL;


export const socket = io(Socket_URL, {
  autoConnect: false,
});
