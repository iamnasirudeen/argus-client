import { createContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/"
    : window.location.origin;

const socket = io(baseURL, {
  path: "/argus-websocket-server/",
});

socket.on("connect", () => {
  console.log("Websocket conncected to argus server");
});

socket.on("disconnect", () => {
  console.log("Disconnecting from argus server");
});

const SocketContextProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketContextProvider };
