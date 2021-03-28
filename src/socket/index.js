import { createContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const socket = io("/argus");

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
