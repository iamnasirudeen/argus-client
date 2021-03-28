import { createContext } from "react";
import io from "socket.io-client";
const SOCKET_SERVER =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/horus"
    : "/horus";

const SocketContext = createContext();

const socket = io(SOCKET_SERVER);

socket.on("connect", () => {
  console.log("Websocket conncected to horus server");
});

socket.on("disconnect", () => {
  console.log("Disconnecting from horus server");
});

const SocketContextProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketContextProvider };
